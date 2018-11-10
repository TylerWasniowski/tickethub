import express from 'express';
import { ticketTransaction, buyerTransaction } from '../lib/bank';

const router = express.Router();

router.post('/check/', (req, res, next) => {
  ticketTransaction(req.body.buyer, req.body.seller, req.body.amount);
  res.send('OK');
});

export default router;
