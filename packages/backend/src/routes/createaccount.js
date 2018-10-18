import mysql from 'mysql';

import express from 'express';

const router = express.Router();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// TODOD: Move to frontend
router.get('/', (req, res, next) => {
  res.render('createaccount');
});

router.post('/submit', (req, res, next) => {
  const ret = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

  connection.query('INSERT INTO users SET ?', ret, (error, results, fields) => {
    // connection.query('SELECT * FROM users WHERE name = ?', ret.name, function (error, results, fields) {
    if (error) throw error;
    // res.send(query.sql);
    res.redirect('/');
  });
  // connection.end();
  // res.json(ret);
});

export default router;
