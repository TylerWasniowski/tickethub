import express from 'express';
import status from 'http-status';
import { db, dbQueryPromise } from '../lib/database';
import {
  getAssignedTicket,
  lockTicket,
  hasTicket,
  getTicket,
  addressExists,
} from '../lib/tickets';
import { createEvent, checkEvents, getEventId } from '../lib/event';
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
    if (
      !(await createEvent(
        req.body.name,
        req.body.dateTime,
        req.body.venue,
        req.body.city,
        req.body.details
      ))
    ) {
      res.status(status.INTERNAL_SERVER_ERROR).json('Error');
      return;
    }
    res.status(status.OK).json('Successful');
  }
});

// new ticket
router.post('/sell/submit', async (req, res, next) => {
  if (!req.session.userId) {
    res.status(status.NOT_ACCEPTABLE).json('Not logged in');
    return;
  }

  if (
    req.body.eventName &&
    !(await createEvent(
      req.body.eventName,
      req.body.eventDatetime,
      req.body.eventVenue,
      req.body.eventCity,
      req.body.eventDetails
    ))
  ) {
    res.status(status.INTERNAL_SERVER_ERROR).json('Error');
    return;
  }

  const ticketInfo = {
    price: req.body.price,
    eventId: req.body.eventId,
    seat: req.body.seat, // can be null, general seating
  };

  // If it is a new event, grab the new event id
  if (!ticketInfo.eventId) {
    console.log('GETTING EVENT ID');
    ticketInfo.eventId = await getEventId(
      req.body.eventName,
      req.body.eventDatetime
    );
  }
  console.log(`EVENT ID: ${JSON.stringify(ticketInfo.eventId)}`);

  if ((await cardExists(req.session.userId)) === false) {
    res
      .status(status.NOT_ACCEPTABLE)
      .send('User does not have a credit card on file');
  } else if ((await addressExists(req.session.userId)) === false) {
    res
      .status(status.NOT_ACCEPTABLE)
      .send('User does not have an address on file');
  } else {
    dbQueryPromise(
      'INSERT INTO tickets (sellerId, eventID, price, seat) VALUES (?,?,?,?)',
      [
        req.session.userId,
        ticketInfo.eventId,
        ticketInfo.price,
        ticketInfo.seat,
      ]
    ).catch(err =>
      console.log(`Error contacting database: ${JSON.stringify(err)}`)
    );
    res.status(status.OK).json('Successful');
  }
});

// delivery instructions?

router.post('/lock/:id', async (req, res, next) => {
  if (!req.session.success) res.status(401).json('Not logged in.');
  else if (hasTicket(req.session)) res.json(req.session.lockedUntil);
  else {
    const { id } = req.params;

    const lockedUntil = await lockTicket(id);
    req.session.ticketId = id;
    req.session.lockedUntil = lockedUntil;

    res.json(lockedUntil);
  }
});

router.post('/unlock/:id', async (req, res, next) => {
  if (!req.session.success) res.status(401).json('Not logged in.');
  else {
    const { id } = req.params;

    const result = await dbQueryPromise(
      'UPDATE tickets SET lockedUntil = NULL WHERE id = ?',
      [id]
    ).catch(() => res.send('Error with database'));

    req.session.ticketId = undefined;
    req.session.lockedUntil = undefined;

    res.status(status.OK).json('Ticket canceled.');
  }
});

export default router;
