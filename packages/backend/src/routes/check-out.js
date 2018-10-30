import express from 'express';
import db from '../lib/database';

const router = express.Router();

router.post('/buy/submit', (req, res, next) => {
  const ticketInfo = {
    boughtUserId: req.body.boughtUserId,
    deliveryMethod: req.body.deliveryMethod,
    address: req.body.address,
    ticketId: req.body.ticketId,
  };

  db.query(
    'UPDATE tickets SET boughtUserId=?, deliveryMethod=?, address=?, available=0 WHERE id=?',
    [
      ticketInfo.boughtUserId,
      ticketInfo.deliveryMethod,
      ticketInfo.address,
      ticketInfo.ticketId,
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

export default router;
