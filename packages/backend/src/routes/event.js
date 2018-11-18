import express from 'express';
import { db, dbQueryPromise } from '../lib/database';
import { getAvailableTickets, getTicketInfo } from '../lib/tickets';

const router = express.Router();

// idea: choose from existing events or create new event
// new event
router.post('/new/submit', (req, res, next) => {
  const eventInfo = {
    name: req.body.name,
    dateTime: req.body.dateTime,
    venue: req.body.venue,
    city: req.body.city,
    details: req.body.details,
    artistName: req.body.artistName,
  };

  db.query(
    'INSERT INTO events (name, dateTime, venue, city, details, artistName) VALUES (?,?,?,?,?,?)',
    [
      eventInfo.name,
      eventInfo.dateTime,
      eventInfo.venue,
      eventInfo.city,
      eventInfo.details,
      eventInfo.artistName,
    ],
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }
      res.json('OK');
    }
  );
});

router.get('/:id', (req, res, next) => {
  dbQueryPromise(
    'SELECT name, dateTime, venue, city, details, artistName from events WHERE id = ?',
    [req.params.id]
  )
    .then(results => res.json(results[0]))
    .catch(err => res.status(500).json(err));
});

router.get('/image/:id', (req, res, next) => {
  dbQueryPromise('SELECT image from events WHERE id = ?', [req.params.id])
    .then(results => res.json(results[0].image))
    .catch(err => res.status(500).json(err));
});

router.get('/tickets/:id', (req, res, next) => {
  getAvailableTickets(req.params.id)
    .then(results => results.map(getTicketInfo))
    .then(tickets => res.json(tickets))
    .catch(err => res.status(500).json(err));
});

export default router;
