import express from 'express';
import { db } from '../lib/database';
import { getDistance } from '../lib/distanceMatrix';

const router = express.Router();

router.post('/buy/submit', (req, res, next) => {
  if (req.session && req.session.userId) {
    const ticketInfo = {
      boughtUserId: req.session.id, // check
      deliveryMethod: req.body.deliveryMethod,
      // address: req.body.address,
      ticketId: req.body.ticketId,
    };

    db.query(
      'UPDATE tickets SET buyerId=?, deliveryMethod=?, available=0 WHERE id=?',
      [
        ticketInfo.boughtUserId,
        ticketInfo.deliveryMethod,
        // ticketInfo.address,
        ticketInfo.ticketId,
      ],
      async (error, results, fields) => {
        if (error) {
          console.log(`Error contacting database: ${JSON.stringify(error)}`);
          res.json(500, error);
        } else {
          // Get Distance
          const distance = await getDistance(
            ticketInfo.ticketId,
            ticketInfo.boughtUserId
          );
          res.json(`The distance is: ${distance}`);
        }
      }
    );
  } else res.json(401, 'Error: Not logged in');
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
    }
  );
});

// //Get Duration and Distance
// router.get('/:id', async (req, res) => {
//   // Check if session exists
//   if (req.session && req.session.userId) {
//     return await getDistance(ticketInfo.ticketId, ticketInfo.boughtUserId);
//   } res.json(401, 'Error: Not logged in');
// });

export default router;
