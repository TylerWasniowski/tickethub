import express from 'express';
import { db } from '../lib/database';
import {
  getAssignedTicket,
  lockTicket,
  hasTicket,
  getTicket,
} from '../lib/tickets';

const router = express.Router();

router.get('/:id', (req, res, next) => {
  if (hasTicket(req.session)) return getAssignedTicket(req.session);

  return getTicket(req.params.id);
});

// new ticket
router.post('/sell/submit', (req, res, next) => {
  const ticketInfo = {
    eventId: req.body.eventId,
    price: req.body.price,
    seat: req.body.seat, // can be null, general seating
  };

  db.query(
    'INSERT INTO tickets (sellerId, eventId, price, seat) VALUES (?,?,?,?)',
    [req.session.userId, ticketInfo.eventId, ticketInfo.price, ticketInfo.seat],
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }

      res.json('OK');
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
