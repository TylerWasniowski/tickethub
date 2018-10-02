const express = require('express');

const router = express.Router();

const mongo = require('mongodb');

const bcrypt = require('bcryptjs');

// Should be as many as the server can handle, slowness is good for security. Prevents bruteforcing. 👍
const saltRounds = 10;

const url = 'mongodb://localhost:27017/tickethub';

// TODOD: Move to frontend
router.get('/', (req, res, next) => {
  res.render('createaccount', {});
});


router.post('/submit', (req, res, next) => {
  const name = req.body.name;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Hash a password
  bcrypt.hash(password, saltRounds).then(hash => {
    const item = {
      name,
      username,
      email,
      password: hash
    };

    console.log(`${name  } ${  username  } ${  email  } ${  hash}`);

    mongo.connect(url, (err, db) => {
      db.collection('user-data').insertOne(item, (err, result) => {
        if (err) return serverError();

        console.log('Item inserted');
        db.close();
      });
    });

    res.send('success');
  }).catch(error => {
    serverError();
  });

  function serverError() {
    res.status(500);
    return res.send('error');
  }
});

module.exports = router;
