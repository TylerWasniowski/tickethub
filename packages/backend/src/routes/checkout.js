import express from 'express';
import db from '../lib/database';

const router = express.Router();

router.post('/buy/submit', (req, res, next) => {
  const ticketInfo = {
    boughtUserId: req.session.id, // check
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

router.post('/payment/submit', (req, res, next) => {
  const paymentInfo = {
    boughtUserId: req.session.id, // check
    cardNumber: req.body.cardNumber,
    cardBrand: req.body.cardBrand,
    nameOnCard: req.body.cardNumber,
    cardExpiration: req.body.cardExpiration,
  };

  // check if valid
  // if valid then add into database
  db.query(
    'UPDATE users SET cardNumber=?, cardBrand=?, nameOnCard=?, cardExpiration=? WHERE id=?',
    [
      paymentInfo.cardNumber,
      paymentInfo.cardBrand,
      paymentInfo.nameOnCard,
      paymentInfo.cardExpiration,
      paymentInfo.boughtUserId,
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
