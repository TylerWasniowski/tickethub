import express from 'express';
import bcrypt from 'bcrypt';
import status from 'http-status';
import { db, dbQueryPromise } from '../lib/database';
import { checkCreditCard } from '../lib/creditcard';

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
  if (!req.session.userId) {
    res.status(status.NOT_ACCEPTABLE).json('Not logged in');
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

  // console.log(username); //email?
  console.log(password);
  console.log();

  db.query(
    'SELECT * FROM users WHERE email = ?',
    email,
    (error, results, fields) => {
      if (error) res.status(status.INTERNAL_SERVER_ERROR).json(error);

      if (!results.length || !results[0])
        res.status(status.NOT_ACCEPTABLE).json();
      else
        bcrypt.compare(password, results[0].password, (err, response) => {
          if (err) res.status(status.INTERNAL_SERVER_ERROR).json(err);

          if (response) {
            req.session.success = true;
            req.session.email = email;
            req.session.userId = results[0].id;

            res.cookie('email', results[0].email || '');
            res.cookie('name', results[0].name || '');
            res.cookie('address', results[0].address || '');
            res.status(status.OK).json();
          } else res.status(status.NOT_ACCEPTABLE).json();
        });
    }
  );
});

router.post('/payment-info/submit', async (req, res, next) => {
  const { number, name, cvv, exp } = {
    number: req.body.number,
    name: req.body.name,
    cvv: req.body.cvv,
    exp: req.body.exp,
  };

  if (req.session.userId == null) {
    res.status(status.NOT_ACCEPTABLE).json('Not logged in');
  } else if (await checkCreditCard(number, name, cvv, exp)) {
    db.query(
      'UPDATE users SET credit_card = ? WHERE id = ?',
      [number, req.session.userId],
      (error, results, fields) => {
        if (error) res.status(status.INTERNAL_SERVER_ERROR).json(error);
      }
    );

    res.status(status.OK).json();
  } else {
    res.status(status.NOT_ACCEPTABLE).json('Invalid Credit Card Information');
  }
});

export default router;
