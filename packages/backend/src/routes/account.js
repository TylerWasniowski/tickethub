import express from 'express';
import bcrypt from 'bcrypt';
import status from 'http-status';
import db from '../lib/database';

const router = express.Router();

router.post('/create-account/submit', (req, res, next) => {
  bcrypt.hash(
    req.body.password,
    parseInt(process.env.BCRYPT_SALT, 10),
    (hashErr, hash) => {
      if (hashErr) res.status(status.INTERNAL_SERVER_ERROR).json(hashErr);

      const ret = {
        name: req.body.name,
        username: req.body.username,
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
        password: hash,
      };

      db.query(
        'UPDATE users SET name = ?, email = ?, password = ? WHERE username = ?',
        [item.name, item.email, item.password, req.session.username],
        (error, results, fields) => {
          if (error) res.status(status.INTERNAL_SERVER_ERROR).json(error);
        }
      );
    }
  );

  res.status(status.OK).json();
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  // res.send('logged out');
  res.status(status.OK).json();
});

router.post('/login/submit', (req, res, next) => {
  const { username, password } = {
    username: req.body.username,
    password: req.body.password,
  };

  db.query(
    'SELECT * FROM users WHERE username = ?',
    username,
    (error, results, fields) => {
      if (error) res.status(status.INTERNAL_SERVER_ERROR).json(error);

      if (
        results.length === 0 ||
        results[0].username.toLowerCase() !== username.toLowerCase()
      )
        res.status(status.NOT_ACCEPTABLE).json();
      else {
        bcrypt.compare(password, results[0].password, (err, response) => {
          if (err) res.status(status.INTERNAL_SERVER_ERROR).json(err);

          if (response) {
            req.session.success = true;
            req.session.username = results[0].username;
            res.status(status.OK).json();
          } else res.status(status.NOT_ACCEPTABLE).json();
        });
      }
    }
  );
});

export default router;
