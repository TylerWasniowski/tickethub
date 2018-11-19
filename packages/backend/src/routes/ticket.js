import express from 'express';
import status from 'http-status';
import { db, dbQueryPromise } from '../lib/database';
import {
  getAssignedTicket,
  lockTicket,
  hasTicket,
  getTicket,
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

  const ticketInfo = {
    price: req.body.price,
    eventId: req.body.eventId,
    seat: req.body.seat, // can be null, general seating
  };

  // If it is a new event, grab the new event id
  if (!ticketInfo.eventId) {
    console.log('GETTING EVENT ID');
    ticketInfo.eventId = await getEventId(req.body.name, req.body.dateTime);
  }
  console.log(`EVENT ID: ${JSON.stringify(ticketInfo.eventId)}`);

  if ((await cardExists(req.session.userId)) === false) {
    res
      .status(status.NOT_ACCEPTABLE)
      .send('User does not have a credit card on file');
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
