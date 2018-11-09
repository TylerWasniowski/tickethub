import express from 'express';

import { checkCreditCard, validCreditCard } from '../lib/creditcard';

const router = express.Router();

router.get('/test/creditcard/:input', (req, res, next) => {
  res.send(validCreditCard(req.params.input));
});

router.post('/check/creditcard/', (req, res, next) => {
  console.log(req.body.number + req.body.name + req.body.cvv + req.body.exp);

  res.send(
    checkCreditCard(req.body.number, req.body.name, req.body.cvv, req.body.exp)
  );
});

export default router;
