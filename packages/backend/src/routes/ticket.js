import express from 'express';

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
