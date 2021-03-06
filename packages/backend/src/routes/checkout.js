import express from 'express';
import status from 'http-status';
import { db, dbQueryPromise } from '../lib/database';
import { ticketTransaction } from '../lib/bank';
import {
  checkCreditCard,
  validCreditCard,
  getCardNumber,
} from '../lib/creditcard';
import { getSellerId, getCheckoutInfo } from '../lib/tickets';

const router = express.Router();

router.post('/buy/submit', async (req, res, next) => {
  if (!req.session.userId) {
    res.status(status.NOT_ACCEPTABLE).send('Not logged in');
    return;
  }

  const formData = {
    shippingMethod: req.body.shippingMethod,
    number: req.body.cardNumber,
    expiration: req.body.expirationDate,
    cvv: req.body.securityCode,
    name: req.body.nameOnCard,
    billingAddress: req.body.billingAddress,
    shippingAddress: req.body.shippingAddress,
    ticketId: req.session.ticketId, // need for sellerAcc and price for ticket
  };

  console.log(formData);

  // check if existing
  if (
    !(await checkCreditCard(
      formData.number,
      formData.name,
      formData.cvv,
      formData.expiration
    ))
  ) {
    res.status(status.NOT_ACCEPTABLE).send('invalid credit card information');
  }
  // check if valid
  else if (validCreditCard(formData.number)) {
    db.query(
      'UPDATE users SET address=?,credit_card=? WHERE id=?',
      [formData.billingAddress, formData.number, req.session.userId],
      (error, results, fields) => {
        if (error) res.status(status.INTERNAL_SERVER_ERROR).json(error);
      }
    );

    dbQueryPromise(
      'UPDATE tickets SET available=0, buyerId=?, deliveryMethod=? WHERE id=?',
      [req.session.userId, formData.shippingMethod, req.session.ticketId]
    );

    // get sellerAcc and price of ticket
    const checkoutInfo = await getCheckoutInfo(
      req.session.ticketId,
      formData.billingAddress,
      formData.shippingMethod
    );
    const sellerId = await getSellerId(formData.ticketId);
    const sellerAcc = await getCardNumber(sellerId);

    ticketTransaction(formData.number, sellerAcc, checkoutInfo);
    res.status(200).json('Success');
  } else {
    res.status(status.NOT_ACCEPTABLE).send('Invalid credit card info');
  }
});

router.get('/info/:id/:shippingMethod/:address', async (req, res, next) => {
  if (!req.session.success) res.status(401).json('Not authorized.');
  else
    getCheckoutInfo(
      req.params.id,
      req.params.address,
      req.params.shippingMethod
    )
      .then(info => res.json(info))
      .catch(err => res.status(500).json(err));
});

export default router;
