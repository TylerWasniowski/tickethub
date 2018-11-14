import express from 'express';
import status from 'http-status';
import { db, dbQueryPromise } from '../lib/database';
import { deliveryBy } from '../lib/distanceMatrix';
import { ticketTransaction } from '../lib/bank';
import {
  checkCreditCard,
  validCreditCard,
  getCardNumber,
} from '../lib/creditcard';
import { getSellerId, getPrice } from '../lib/tickets';

const router = express.Router();

router.post('/shipping/submit', async (req, res, next) => {
  const ticketInfo = {
    deliveryMethod: req.body.deliveryMethod,
    address: req.body.address,
    ticketId: req.body.ticketId,
  };

  dbQueryPromise(
    'UPDATE tickets SET boughtUserId=?, deliveryMethod=?, address=?, available=0 WHERE id=?',
    [
      req.session.userId,
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

router.post('/billing/submit', async (req, res, next) => {
  const paymentInfo = {
    number: req.body.number,
    expiration: req.body.expiration,
    cvv: req.body.cvv,
    name: req.body.name,
    address: req.body.address,
    ticketId: req.body.ticketId, // need for sellerAcc and price for ticket
  };

  // check if existing
  if (
    (await checkCreditCard(
      paymentInfo.number,
      paymentInfo.name,
      paymentInfo.cvv,
      paymentInfo.expiration
    )) === false
  ) {
    res.status(status.NOT_ACCEPTABLE).json();
  }

  // check if valid
  if (validCreditCard(paymentInfo.number) === true) {
    db.query(
      'UPDATE users SET address=?,credit_card=? WHERE id=?',
      [paymentInfo.address, paymentInfo.number, req.session.userId],
      (error, results, fields) => {
        if (error) res.status(status.INTERNAL_SERVER_ERROR).json(error);
      }
    );

    // get sellerAcc and price of ticket
    const sellerId = await getSellerId(paymentInfo.ticketId);
    const amount = await getPrice(paymentInfo.ticketId);
    const sellerAcc = await getCardNumber(sellerId);

    ticketTransaction(paymentInfo.number, sellerAcc, amount);

    res.status(status.OK).json();
  } else {
    res.status(status.NOT_ACCEPTABLE).json();
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
