import express from 'express';
import { db } from '../lib/database';
import {
  getAssignedTicket,
  lockTicket,
  hasTicket,
  getTicketInfo,
  getTicket,
} from '../lib/tickets';
import { createEvent, checkEvents } from '../lib/event';

const router = express.Router();

router.get('/:id', (req, res, next) => {
  if (hasTicket(req.session)) return getAssignedTicket(req.session);

  return getTicket(req.params.id);
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
  // const eventInfo = {
  //   eventName: req.body.eventName,
  //   eventDateTime: req.body.eventDateTime,
  //   eventVenue: req.body.eventVenue,
  //   eventCity: req.body.eventCity,
  //   eventDetails: req.body.eventDetails,
  // };

  if (
    !createEvent(
      req.body.eventName,
      req.body.eventDateTime,
      req.body.eventVenue,
      req.body.eventCity,
      req.body.eventDetails
    )
  ) {
    res.json(500);
  }

  const ticketInfo = {
    price: req.body.price,
    eventId: req.body.eventId,
    seat: req.body.seat, // can be null, general seating
  };

  db.query(
    'INSERT INTO tickets VALUES(sellUserId, eventID, price, seat) VALUES (?,?,?,?)',
    [req.session.id, ticketInfo.eventId, ticketInfo.price, ticketInfo.seat],
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      } else {
        res.json('OK');
      }
    }
  );
});

router.get('/sale-charge/:id', async (req, res, next) => {
  const ticket = await getTicket(req.params.id);

  const ret = ticket.price * 1.05;
  res.json(ret);
});

// delivery instructions?

router.post('/lock/:id', async (req, res, next) => {
  if (hasTicket(req.session)) res.json(req.session.lockedUntil);
  else {
    const { id } = req.params;

    const lockedUntil = await lockTicket(id);
    req.session.ticketId = id;
    req.session.lockedUntil = lockedUntil;

    res.json(lockedUntil);
  }
});

export default router;
