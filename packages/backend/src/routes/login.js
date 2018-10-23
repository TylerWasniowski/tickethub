import mysql from 'mysql';
import express from 'express';
import expressSession from 'express-session';
import bcrypt from 'bcrypt';
import { type } from 'os';
import db from '../lib/database';

const router = express.Router();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

router.get('/', (req, res, next) => {
  res.render('login');
});

router.post('/submit', (req, res, next) => {
  // var username, password;
  const { username, password } = {
    username: req.body.username,
    password: req.body.password,
  };

  // db.query(
  //   'SELECT * FROM users WHERE username = ?',
  //   username,
  //   (error, results, fields) => {
  //     if (error) throw error;

  //     // catch when result is empty
  //     if (results.length === 0) {
  //       res.send('WRONG USERNAME OR PASSWORD!');
  //     } else if (
  //       results[0].username.toLowerCase() === username.toLowerCase() &&
  //       results[0].password === password
  //     ) {
  //       // connection.end();
  //       req.session.success = true;
  //       req.session.username = results[0].username;
  //       res.redirect('/');
  //     } else {
  //       res.send('WRONG USERNAME OR PASSWORD!');
  //     }
  //   }
  // );

  db.query(
    'SELECT * FROM users WHERE username = ?',
    username,
    (error, results, fields) => {
      if (error) throw error;

      // if (results.length === 0)
      //   res.json('WRONG USERNAME OR PASSWORD!');
      if (
        results.length === 0 ||
        results[0].username.toLowerCase() !== username.toLowerCase()
      )
        res.json('WRONG USERNAME!');
      else {
        bcrypt.compare(password, results[0].password, (err, response) => {
          // res.json({pass: typeof password, hash: typeof results[0].password});
          if (err) throw err;

          if (response) {
            // res.json('inside');
            req.session.success = true;
            req.session.username = results[0].username;
            res.json('LOGIN SUCCESSFUL');
          } else res.json('WRONG PASSWORD!');
        });
      }

      // bcrypt.compare(password, results[0].password, (err, response) => {
      //   if (response) {
      //     req.session.success = true;
      //     req.session.username = results[0].username;
      //     res.json({msg: 'LOGIN SUCCESSFUL'});
      //   } else res.send('WRONG PASSWORD!');
      // });
    }
  );

  // res.json({ user: username, pass: password, some: 'blah' });
});

export default router;
