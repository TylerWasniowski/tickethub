import express from 'express';

import {
  checkCreditCard,
  validCreditCard,
  getCardNumber,
} from '../lib/creditcard';
import { ticketTransaction } from '../lib/bank';

const router = express.Router();

router.get('/test/creditcard/:input', (req, res, next) => {
  res.send(validCreditCard(req.params.input));
});

router.post('/check/creditcard/', async (req, res, next) => {
  console.log(req.body.number + req.body.name + req.body.cvv + req.body.exp);

  const success = await checkCreditCard(
    req.body.number,
    req.body.name,
    req.body.cvv,
    req.body.exp
  );

  if (success) res.send('success');
  else res.send('false');
});

router.post('/check/', (req, res, next) => {
  ticketTransaction(req.body.buyer, req.body.seller, req.body.amount);
  res.send('OK');
});

router.get('/getCard/:id', async (req, res, next) => {
  res.send(await getCardNumber(req.params.id));
});

export default router;
