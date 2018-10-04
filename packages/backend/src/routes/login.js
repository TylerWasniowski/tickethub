import mysql from 'mysql';
import express from 'express';

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
        res.redirect('/');
      } else {
        res.send('WRONG USERNAME OR PASSWORD!');
      }
    }
  );

  // mongo.connect(url, function(err, db) {
  //     var dbo = db.db('tickethub');
  //     var query = { username: username, password: password};
  //     dbo.collection('user-data').find(query).toArray(function(err, result) {
  //         if (err) throw err;
  //         console.log(result);
  //         db.close();
  //         console.log(result.length);

  //         if (result.length == 1) {
  //             req.session.success = true;
  //             req.session.username = result[0].username;
  //             req.session.name = result[0].name;
  //             req.session.email = result[0].email;
  //             res.redirect('/account');
  //         }
  //         else {
  //             res.render('login', {error: 'invalid username or password'});
  //         }
  //     });
  // });
});

export default router;
