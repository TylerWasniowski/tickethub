import express from 'express';
import bcrypt from 'bcrypt';
import status from 'http-status';
import { db } from '../lib/database';

const router = express.Router();

router.post('/create-account/submit', (req, res, next) => {
  bcrypt.hash(
    req.body.password,
    parseInt(process.env.BCRYPT_SALT, 10),
    (hashErr, hash) => {
      if (hashErr) res.status(status.INTERNAL_SERVER_ERROR).json(hashErr);

      const ret = {
        email: req.body.email,
        password: hash,
      };

      db.query('INSERT INTO users SET ?', ret, (err, results, fields) => {
        if (err) res.status(status.INTERNAL_SERVER_ERROR).json(err);
        res.status(status.OK).json();
      });
    }
  );
});

router.post('/update/submit', (req, res, next) => {
  if (!req.session.success) {
    // res.send('not logged in');
    res.status(status.IM_A_TEAPOT).json();
  }

  bcrypt.hash(
    req.body.password,
    parseInt(process.env.BCRYPT_SALT, 10),
    (hashErr, hash) => {
      if (hashErr) res.status(status.INTERNAL_SERVER_ERROR).json();

      const item = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        password: hash,
        userId: req.session.userId,
      };

      console.log(item.userId);

      db.query(
        'UPDATE users SET name = ?, email = ?, address = ?, password = ? WHERE id = ?',
        [item.name, item.email, item.address, item.password, item.userId],
        (error, results, fields) => {
          if (error) res.status(status.INTERNAL_SERVER_ERROR).json(error);

          res.cookie('email', item.email);
          res.cookie('name', item.name);
          res.cookie('address', item.address);
          res.status(status.OK).json();
        }
      );
    }
  );
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();

  res.cookie('email', '');
  res.cookie('name', '');
  res.cookie('address', '');
  res.status(status.OK).json();
});

router.post('/login/submit', (req, res, next) => {
  const { email, password } = {
    email: req.body.email,
    password: req.body.password,
  };

  db.query(
    "SELECT * FROM users WHERE email = 'nina@yahoo.com'",
    (error, results, fields) => {
      if (error) res.status(status.INTERNAL_SERVER_ERROR).json(error);

      if (!results.length) res.status(status.NOT_ACCEPTABLE).json();
      else {
        // bcrypt.compare(password, results[0].password, (err, response) => {
        //   if (err) res.status(status.INTERNAL_SERVER_ERROR).json(err);

        // if (response) {
        req.session.success = true;
        req.session.email = email;
        req.session.userId = results[0].id;

        res.cookie('email', results[0].email || '');
        res.cookie('name', results[0].name || '');
        res.cookie('address', results[0].address || '');
        res.status(status.OK).json();
      } // else res.status(status.NOT_ACCEPTABLE).json();
    }
  );
  // }
  // }
  // );
});

export default router;
