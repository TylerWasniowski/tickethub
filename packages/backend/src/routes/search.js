import express from 'express';

import db from '../lib/database';
import { getAvailableTickets, getTicketInfo } from '../lib/tickets';

const router = express.Router();

router.get('/suggestions/:query', (req, res, next) => {
  db.query(
    `SELECT name FROM events WHERE name LIKE ${db.escape(
      `%${req.params.query}%`
    )}`,
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      } else {
        res.json(results.map(event => event.name));
      }
    }
  );
});

router.get('/:query', (req, res, next) => {
  db.query(
    `SELECT id FROM events WHERE
      name LIKE ${db.escape(`%${req.params.query}%`)}
    `,
    async (error, results, fields) => {
      if (!error) {
        if (results.length) {
          const tickets = await getAvailableTickets(results[0].id);
          res.json(tickets.map(getTicketInfo));
        } else res.json([]);
      } else {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }
    }
  );
});

export default router;
