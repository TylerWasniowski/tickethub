import express from 'express';
import { db, dbQueryPromise } from '../lib/database';
import deliveryBy from '../lib/distanceMatrix';

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

// not in database yet
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

      // subtract from buyer, add to seller and admin bank
    }
  );
});

router.get('/:id', async (req, res) => {
  // Check if session exists
  if (req.session && req.session.userId) {
    const sellerId = dbQueryPromise(
      'SELECT sellerId FROM tickets WHERE id = ?',
      req.params.id
    )
      .then(results => results[0].sellerId)
      .catch(console.log);

    if (!sellerId) {
      throw new Error('No seller Id');
    } else {
      const buyerAddressPromise = dbQueryPromise(
        'SELECT address FROM users WHERE id = ?',
        req.session.userId
      );

      const sellerAddressPromise = dbQueryPromise(
        'SELECT * FROM users WHERE id = ?',
        sellerId
      );

      Promise.all([buyerAddressPromise, sellerAddressPromise])
        .then(addresses => deliveryBy(addresses[0], addresses[1]))
        .catch(console.log);
    }
  } else res.json(401, 'Error: Not logged in');
});

export default router;
