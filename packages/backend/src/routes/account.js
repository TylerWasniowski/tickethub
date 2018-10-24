import express from 'express';
import bcrypt from 'bcrypt';
import db from '../lib/database';

const router = express.Router();

router.post('/create-account/submit', (req, res, next) => {
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
});

router.post('/update/submit', (req, res, next) => {
  const item = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  console.log(item);

  if (!req.session.success) {
    res.send('not logged in');
  }

  db.query(
    'UPDATE users SET name = ?, email = ?, password = ? WHERE username = ?',
    [item.name, item.email, item.password, req.session.username],
    (error, results, fields) => {
      if (error) throw error;
    }
  );

  res.redirect('/');
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.send('logged out');
});

router.post('/login/submit', (req, res, next) => {
  const { username, password } = {
    username: req.body.username,
    password: req.body.password,
  };

  console.log(username + password);

  db.query(
    'SELECT * FROM users WHERE username = ?',
    username,
    (error, results, fields) => {
      if (error) throw error;

      if (
        results.length === 0 ||
        results[0].username.toLowerCase() !== username.toLowerCase()
      )
        res.json('WRONG USERNAME!');
      else {
        bcrypt.compare(password, results[0].password, (err, response) => {
          if (err) throw err;

          if (response) {
            req.session.success = true;
            req.session.username = results[0].username;
            res.json('LOGIN SUCCESSFUL');
          } else res.json('WRONG PASSWORD!');
        });
      }
    }
  );
});

export default router;
