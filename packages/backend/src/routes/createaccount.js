// import mysql from 'mysql';
import express from 'express';
import bcrypt from 'bcrypt';
import db from '../lib/database';

const router = express.Router();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// TODOD: Move to frontend
router.get('/', (req, res, next) => {
  res.render('createaccount');
});

router.post('/submit', (req, res, next) => {
  // const ret = {
  //   name: req.body.name,
  //   username: req.body.username,
  //   email: req.body.email,
  //   password: req.body.password,
  // };

  bcrypt.hash(
    req.body.password,
    parseInt(process.env.BCRYPT_SALT, 10),
    (hashErr, hash) => {
      if (hashErr) throw hashErr;

      const ret = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hash,
      };

      db.query('INSERT INTO users SET ?', ret, (err, results, fields) => {
        if (err) throw err;
        res.redirect('/');
      });
    }
  );

  // db.query('INSERT INTO users SET ?', ret, (error, results, fields) => {
  //   if (error) throw error;
  //   res.redirect('/');
  // });
});

export default router;
