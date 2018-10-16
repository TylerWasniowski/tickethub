import mysql from 'mysql';
import express from 'express';
import expressSession from 'express-session';

const router = express.Router();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

router.get('/', (req, res, next) => {
  res.render('login');
});

router.post('/submit', (req, res, next) => {
  // var username, password;
  const { username, password } = {
    username: req.body.username,
    password: req.body.password,
  };

  connection.query(
    'SELECT * FROM users WHERE username = ?',
    username,
    (error, results, fields) => {
      if (error) throw error;

      // catch when result is empty
      if (results.length === 0) {
        res.send('WRONG USERNAME OR PASSWORD!');
      } else if (
        results[0].username.toLowerCase() === username.toLowerCase() &&
        results[0].password === password
      ) {
        // connection.end();
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
