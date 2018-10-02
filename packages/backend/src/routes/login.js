const express = require('express');

const router = express.Router();


const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';

const bcrypt = require('bcryptjs');

router.get('/', (req, res, next) => {
  res.render('login', {});
});


router.post('/submit',  (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  mongo.connect(url, (err, db) => {
    const dbo = db.db('tickethub');
    const query = { username};
    dbo.collection('user-data').find(query).toArray((err, result) => {
      if (err) throw err;
      console.log(result);
      db.close();
      console.log(result.length);

      const user = result[0];

      bcrypt.compare(password, user.password).then(valid => {
        if (valid === true) {
          req.session.success = true;
          req.session.username = user.username;
          req.session.name = user.name;
          req.session.email = user.email;
          res.redirect('/account');
        } else {
          res.render('login', {error: 'invalid username or password'});
        }
      }).catch(error => {
        res.render('login', {error: 'invalid username or password'});
      });
    });
  });
});

module.exports = router;
