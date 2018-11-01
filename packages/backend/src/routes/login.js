import express from 'express';
import expressSession from 'express-session';
import db from '../lib/database';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/submit', (req, res) => {
  // var username, password;
  const { username, password } = {
    username: req.body.username,
    password: req.body.password,
  };

  db.query(
    'SELECT * FROM users WHERE username = ?',
    username,
    (error, results) => {
      if (error) throw error;

      // catch when result is empty
      if (results.length === 0) {
        res.send('WRONG USERNAME OR PASSWORD!');
      } else if (
        results[0].username.toLowerCase() === username.toLowerCase() &&
        results[0].password === password
      ) {
        // db.end();
        req.session.success = true;
        req.session.username = results[0].username;
        res.redirect('/');
      } else {
        res.send('WRONG USERNAME OR PASSWORD!');
      }
    }
  );
});

export default router;
