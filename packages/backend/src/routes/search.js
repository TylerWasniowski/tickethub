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
    `SELECT name, id FROM events WHERE
      name LIKE ${db.escape(`%${req.params.query}%`)}
    `,
    async (error, results, fields) => {
      if (!error) {
        if (results.length) {
          const tickets = await getAvailableTickets(results[0].id);
          const ticketInfo = tickets.map(getTicketInfo);

          res.json({
            event: results[0].name,
            tickets: ticketInfo,
          });
        } else
          res.json({
            name: results[0].name,
            tickets: [],
          });
      } else {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }
    }
  );
});

export default router;
