import express from 'express';
import status from 'http-status';
import { db, dbQueryPromise } from '../lib/database';
import { getDistance } from '../lib/distanceMatrix';
import { ticketTransaction } from '../lib/bank';
import {
  checkCreditCard,
  validCreditCard,
  getCardNumber,
} from '../lib/creditcard';
import { getSellerId, getPrice } from '../lib/tickets';

const router = express.Router();

router.post('/shipping/submit', async (req, res, next) => {
  if (req.session && req.session.userId) {
    const ticketInfo = {
      deliveryMethod: req.body.deliveryMethod,
      // address: req.body.address,
      ticketId: req.body.ticketId,
    };

    dbQueryPromise(
      'UPDATE tickets SET buyerId=?, deliveryMethod=?, available=0 WHERE id=?',
      [
        req.session.userId,
        ticketInfo.deliveryMethod,
        // ticketInfo.address,
        ticketInfo.ticketId,
      ]
    ).catch(err =>
      console.log(`Error contacting database: ${JSON.stringify(err)}`)
    );

    // call function calculating shipping cost

    // Get Distance
    const distance = await getDistance(ticketInfo.ticketId, req.session.userId);
    res.json(`The distance is: ${distance}`);
  } else res.json(401, 'Error: Not logged in');
  // add to current price -database (display new price)
});

router.post('/submit', async (req, res, next) => {
  const paymentInfo = {
    number: req.body.number,
    expiration: req.body.expiration,
    cvv: req.body.cvv,
    name: req.body.name,
    address: req.body.address,
    ticketId: req.body.ticketId, // need for sellerAcc and price for ticket
  };

  if (req.session.userId == null) {
    res.status(status.NOT_ACCEPTABLE).json('Not logged in');
  }

  // check if existing
  else if (
    (await checkCreditCard(
      paymentInfo.number,
      paymentInfo.name,
      paymentInfo.cvv,
      paymentInfo.expiration
    )) === false
  ) {
    res.status(status.NOT_ACCEPTABLE).json('invalid credit card information');
  }

  // check if valid
  else if (validCreditCard(paymentInfo.number) === true) {
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

export default router;
