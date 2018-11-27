import express from 'express';

import { db, dbQueryPromise } from '../lib/database';
import { getAvailableTickets, getTicketInfo } from '../lib/tickets';

const router = express.Router();

router.get('/suggestions/:query', (req, res, next) => {
  db.query(
    `SELECT id, name FROM events WHERE
      name LIKE ${db.escape(`%${req.params.query}%`)}
      ORDER BY RAND()
      LIMIT 10
    `,
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      } else {
        res.json(results);
      }
    }
  );
});

router.get('/:query', (req, res, next) => {
  dbQueryPromise(`
    SELECT id, name FROM events WHERE
    name LIKE ${db.escape(`%${req.params.query}%`)}
  `)
    .then(events => res.json(events))
    .catch(err => res.status(err).json(err));
});

router.get('/tickets/:query', (req, res, next) => {
  if (!req.params.query) {
    res.json({ tickets: [] });
    return;
  }

  dbQueryPromise(`
    SELECT id, name FROM events WHERE
    name LIKE ${db.escape(`%${req.params.query}%`)}
    LIMIT 1
  `)
    .then(events => events[0])
    .then(async event => ({
      eventId: event.id,
      eventName: event.name,
      tickets: (await getAvailableTickets(event.id)).map(getTicketInfo),
    }))
    .then(results => res.json(results))
    .catch(err => res.status(500).json(err));
});

export default router;
