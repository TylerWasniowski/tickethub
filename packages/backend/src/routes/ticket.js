import express from 'express';
import db from '../lib/database';

const router = express.Router();

// get ticket
router.get('/:id', (req, res, next) => {
  db.query(
    'SELECT * FROM events WHERE id = ?',
    req.params.id,
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }

      console.log(results);

      if (!results.length) {
        res.send('Ticket does not exist');
      }
      res.send(results[0]);
    }
  );
});

// check if bank info exists using SELECT
// if doesn't exist, ask for
// call function - later, currently in check-out

// choose from existing events or create new event
// not tested yet
router.post('/new-event/submit', (req, res, next) => {
  const eventInfo = {
    eventName: req.body.eventName,
    dateTime: req.body.dateTime,
    venue: req.body.vanue,
    city: req.body.city,
    details: req.body.details, // can be null
    artistName: req.body.artistName,
  };

  db.query(
    'INSERT INTO events (eventName, dateTime, venue, city, details, artistName) SET ?',
    eventInfo,
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }
      res.json('OK');
    }
  );
});

// new ticket
router.post('/new/submit', (req, res, next) => {
  const ticketInfo = {
    price: req.body.price,
    eventId: req.body.eventId,
    seat: req.body.seat, // can be null, general seating
  };

  db.query(
    'INSERT INTO tickets (sellUserId, eventID, price, seat) VALUES (?,?,?,?)',
    [req.session.id, ticketInfo.eventId, ticketInfo.price, ticketInfo.seat],
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }

      res.json('OK');
    }
  );
});

router.get('/sale-charge/:price', (req, res, next) => {
  const ret = req.params.price * 1.05;
  res.json(ret);
});

// delivery instructions?

export default router;
