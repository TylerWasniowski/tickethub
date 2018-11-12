import express from 'express';
import status from 'http-status';
import { db, dbQueryPromise } from '../lib/database';
import deliveryBy from '../lib/distanceMatrix';
import ticketTransaction from '../lib/bank';
import { checkCreditCard, validCreditCard } from '../lib/creditcard';

const router = express.Router();

router.post('/shipping/submit', (req, res, next) => {
  const ticketInfo = {
    boughtUserId: req.session.id, // check
    deliveryMethod: req.body.deliveryMethod,
    address: req.body.address,
    ticketId: req.body.ticketId,
  };

  dbQueryPromise(
    'UPDATE tickets SET boughtUserId=?, deliveryMethod=?, address=?, available=0 WHERE id=?',
    [
      ticketInfo.boughtUserId,
      ticketInfo.deliveryMethod,
      ticketInfo.address,
      ticketInfo.ticketId,
    ]
  ).catch(err =>
    console.log(`Error contacting database: ${JSON.stringify(err)}`)
  );

  // call function calculating shipping cost
  // add to current price -database (display new price)
});

router.post('/billing/submit', (req, res, next) => {
  const paymentInfo = {
    boughtUserId: req.session.id, // check
    number: req.body.number,
    expiration: req.body.expiration,
    cvv: req.body.cvv,
    name: req.body.name,
    address: req.body.address,
    // ticketId: //need for sellerAcc and price for ticket
  };

  // check if existing
  if (
    checkCreditCard(
      paymentInfo.number,
      paymentInfo.name,
      paymentInfo.cvv,
      paymentInfo.expiration
    ) === 'Invalid Credit Card Info'
  ) {
    res.status(status.BAD_REQUEST).json();
  }

  // check if valid
  if (validCreditCard(paymentInfo.number) === true) {
    // if valid then connect to user? and make transaction
    dbQueryPromise('UPDATE users SET credit_card=? WHERE id=?', [
      paymentInfo.number,
      req.session.id,
    ]).catch(err =>
      console.log(`Error contacting database: ${JSON.stringify(err)}`)
    );

    //    ticketTransaction(paymentInfo.number, sellerAcc, amount); // need to get sellerAcc and amount
  } else {
    res.status(status.BAD_REQUEST).json();
  }
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
        'SELECT address FROM users WHERE id = ?',
        sellerId
      );

      Promise.all([buyerAddressPromise, sellerAddressPromise])
        .then(bothResults => bothResults.map(results => results[0].address))
        .then(addresses => deliveryBy(addresses[0], addresses[1]))
        .catch(console.log);
    }
  } else res.json(401, 'Error: Not logged in');
});

export default router;
