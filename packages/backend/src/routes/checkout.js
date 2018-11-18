import express from 'express';
import status from 'http-status';
import { db, dbQueryPromise } from '../lib/database';
import { ticketTransaction } from '../lib/bank';
import {
  checkCreditCard,
  validCreditCard,
  getCardNumber,
} from '../lib/creditcard';
import { getSellerId, getPrice } from '../lib/tickets';

const router = express.Router();

router.post('/buy/submit/:id', async (req, res, next) => {
  const checkoutInfo = {
    deliveryMethod: req.body.deliveryMethod,
    number: req.body.cardNumber,
    expiration: req.body.expirationDate,
    cvv: req.body.securityCode,
    name: req.body.nameOnCard,
    address: req.body.address,
    ticketId: req.body.ticketId, // need for sellerAcc and price for ticket
  };

  if (req.session.userId === null) {
    res.status(status.NOT_ACCEPTABLE).json('Not logged in');
  }

  // check if existing
  else if (
    (await checkCreditCard(
      checkoutInfo.number,
      checkoutInfo.name,
      checkoutInfo.cvv,
      checkoutInfo.expiration
    )) === false
  ) {
    res.status(status.NOT_ACCEPTABLE).json('invalid credit card information');
  }

  // check if valid
  else if (validCreditCard(checkoutInfo.number) === true) {
    db.query(
      'UPDATE users SET address=?,credit_card=? WHERE id=?',
      [checkoutInfo.address, checkoutInfo.number, req.session.userId],
      (error, results, fields) => {
        if (error) res.status(status.INTERNAL_SERVER_ERROR).json(error);
      }
    );

    // get sellerAcc and price of ticket
    const sellerId = await getSellerId(checkoutInfo.ticketId);
    const amount = await getPrice(checkoutInfo.ticketId);
    const sellerAcc = await getCardNumber(sellerId);

    ticketTransaction(checkoutInfo.number, sellerAcc, amount);

    // mark ticket as sold
    dbQueryPromise(
      'UPDATE tickets SET buyerId=?, deliveryMethod=?, available=0 WHERE id=?',
      [req.session.userId, checkoutInfo.deliveryMethod, checkoutInfo.ticketId]
    ).catch(err =>
      console.log(`Error contacting database: ${JSON.stringify(err)}`)
    );

    res.status(status.OK).json();
  } else {
    res.status(status.NOT_ACCEPTABLE).json();
  }
});

export default router;
