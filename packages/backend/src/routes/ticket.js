import express from 'express';
import status from 'http-status';
import { db, dbQueryPromise } from '../lib/database';
import {
  getAssignedTicket,
  lockTicket,
  hasTicket,
  getTicketInfo,
  getTicket,
} from '../lib/tickets';
import { cardExists } from '../lib/creditcard';

const router = express.Router();

router.get('/:id', (req, res, next) => {
  if (hasTicket(req.session)) return getAssignedTicket(req.session);

  return getTicket(req.params.id);
});

// idea: choose from existing events or create new event
// new event
router.post('/new-event/submit', async (req, res, next) => {
  const eventInfo = {
    name: req.body.name,
    dateTime: req.body.dateTime,
    venue: req.body.venue,
    city: req.body.city,
    details: req.body.details, // can be null
    artistName: req.body.artistName,
  };

  if (req.session.userId == null) {
    res.status(status.NOT_ACCEPTABLE).json('Not logged in');
  } else {
    dbQueryPromise(
      'INSERT INTO events (name, dateTime, venue, city, details, artistName) VALUES (?,?,?,?,?,?)',
      [
        eventInfo.name,
        eventInfo.dateTime,
        eventInfo.venue,
        eventInfo.city,
        eventInfo.details,
        eventInfo.artistName,
      ]
    ).catch(err =>
      console.log(`Error contacting database: ${JSON.stringify(err)}`)
    );
  }
});

// new ticket
router.post('/new/submit', async (req, res, next) => {
  const ticketInfo = {
    price: req.body.price,
    eventId: req.body.eventId,
    seat: req.body.seat, // can be null, general seating
  };

  if (req.session.userId == null) {
    res.status(status.NOT_ACCEPTABLE).json('Not logged in');
  } else {
    // if ((await cardExists(req.session.userId)) === false) {
    //  res.status(status.NOT_ACCEPTABLE).send('User does not have a credit card on file');
    // } else {
    dbQueryPromise(
      'INSERT INTO tickets (sellerId, eventID, price, seat) VALUES (?,?,?,?)',
      [req.session.id, ticketInfo.eventId, ticketInfo.price, ticketInfo.seat]
    ).catch(err =>
      console.log(`Error contacting database: ${JSON.stringify(err)}`)
    );
    res.status(status.OK).json();
    // }
  }
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
