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
        res.status(status.OK).json('Account created Sucesffuly.');
      });
    }
  );
});

router.post('/update/submit', (req, res, next) => {
  if (!req.session.userId) {
    res.status(status.NOT_ACCEPTABLE).send('Not logged in.');
    return;
  }

  bcrypt.hash(
    req.body.password,
    parseInt(process.env.BCRYPT_SALT, 10),
    (hashErr, hash) => {
      if (hashErr) {
        res.status(status.INTERNAL_SERVER_ERROR).send('Error in password.');
        return;
      }

      const item = {
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        cardNumber: req.body.cardNumber,
        password: hash,
        userId: req.session.userId,
      };

      const names = [];
      const vals = [];
      if (item.name) {
        names.push('name');
        vals.push(item.name);
      }
      if (item.email) {
        names.push('email');
        vals.push(item.email);
      }
      if (item.address) {
        names.push('address');
        vals.push(item.address);
      }
      if (item.cardNumber) {
        names.push('credit_card');
        vals.push(item.cardNumber);
      }
      if (item.password) {
        names.push('password');
        vals.push(item.password);
      }
      vals.push(item.userId);

      if (!names.length) {
        res.status(status.OK).json('Nothing changed.');
        return;
      }

      db.query(
        `UPDATE users SET ${names.join(' = ?,')} = ? WHERE id = ?`,
        vals,
        (error, results, fields) => {
          if (error) {
            res.status(status.INTERNAL_SERVER_ERROR).json(error);
            return;
          }

          res.cookie('email', item.email);
          res.cookie('name', item.name);
          res.cookie('address', item.address);
          res.status(status.OK).json('Account updated!');
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
  res.status(status.OK).json('Logged out.');
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

      if (!results || !results.length || !results[0])
        res.status(status.NOT_ACCEPTABLE).send('Invalid username or password.');
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
            res.status(status.OK).json('Logged in!');
          } else
            res
              .status(status.NOT_ACCEPTABLE)
              .send('Invalid username or password.');
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
    res.status(status.NOT_ACCEPTABLE).send('Not logged in');
  } else if (await checkCreditCard(number, name, cvv, exp)) {
    db.query(
      'UPDATE users SET credit_card = ? WHERE id = ?',
      [number, req.session.userId],
      (error, results, fields) => {
        if (error) res.status(status.INTERNAL_SERVER_ERROR).json(error);
      }
    );

    res.status(status.OK).json('Successful.');
  } else {
    res.status(status.NOT_ACCEPTABLE).send('Invalid Credit Card Information.');
  }
});

export default router;
