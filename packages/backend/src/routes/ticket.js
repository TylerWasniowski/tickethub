import express from 'express';
import moment from 'moment';
import db from '../lib/database';
import { lockTicket, hasTicket, getTicketInfo } from '../lib/tickets';

const router = express.Router();

// TODO: Add to frontend
// router.get('/account',function (req, res, next) {
//   res.render('account', {name : req.session.name, username : req.session.username, email : req.session.email, success : req.session.success,})
// })

router.get('/:id', (req, res, next) => {
  const id = hasTicket(req.session) ? req.session.ticketId : req.params.id;
  db.query(
    'SELECT * FROM tickets WHERE id = ?',
    id,
    (error, results, fields) => {
      if (error) throw error;

      if (!results.length) {
        res.json('Ticket does not exist');
      }
      res.json(getTicketInfo(results[0]));
    }
  );
});

// idea: choose from existing events or create new event
// new event
router.post('/new-event/submit', (req, res, next) => {
  const eventInfo = {
    name: req.body.name,
    dateTime: req.body.dateTime,
    venue: req.body.venue,
    city: req.body.city,
    details: req.body.details, // can be null
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

router.post('/lock/:id', async (req, res, next) => {
  if (hasTicket(req.session)) res.json(req.session.lockedUntil);
  else {
    const { id } = req.params;

    const lockedUntil = await lockTicket(id);
    console.log(lockedUntil);
    req.session.ticketId = id;
    req.session.lockedUntil = lockedUntil;

    res.json(lockedUntil);
  }
});

export default router;
