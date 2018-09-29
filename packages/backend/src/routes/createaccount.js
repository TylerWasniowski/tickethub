var express = require('express');
var router = express.Router();

var mongo = require('mongodb');

var url = 'mongodb://localhost:27017/tickethub';

// TODOD: Move to frontend
router.get('/', function(req, res, next) {
    res.render('createaccount', {});
});


router.post('/submit', function(req, res, next) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;


    var item = {
        name: name,
        username: username,
        email: email,
        password: password
    };

    console.log(name + ' ' + username + ' ' + email + ' ' + password);

    mongo.connect(url, function(err, db) {
        db.collection('user-data').insertOne(item, function(err, result) {
            console.log('Item inserted');
            db.close();
        });
    });

    res.send('success');
});

module.exports = router;
