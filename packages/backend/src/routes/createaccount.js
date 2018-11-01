import express from 'express';
import db from '../lib/database';

const router = express.Router();

// TODOD: Move to frontend
router.get('/', (req, res) => {
  res.send('createaccount');
});

router.post('/submit', (req, res) => {
  const ret = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  res.json(ret);
});

export default router;
