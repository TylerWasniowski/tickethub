import express from 'express';

import { checkCreditCard, validCreditCard } from '../lib/creditcard';

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

export default router;
