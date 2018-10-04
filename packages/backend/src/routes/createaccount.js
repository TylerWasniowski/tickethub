import mysql from 'mysql';

import express from 'express';

const router = express.Router();

const connection = mysql.createConnection({
  host: '35.233.153.166',
  user: 'root',
  password: 'group3cs160',
  database: 'tickethub',
});

const url = 'mongodb://localhost:27017/tickethub';

// TODOD: Move to frontend
router.get('/', (req, res, next) => {
  res.send('createaccount');
});

router.post('/submit', (req, res, next) => {
  const ret = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  res.json(ret);
});

export default router;
