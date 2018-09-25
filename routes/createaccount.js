var express = require('express');
var router = express.Router();

var mongo = require('mongodb');

var url = 'mongodb://localhost:27017/tickethub';

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('createaccount', {});
});


router.post('/submit', function(req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;


    var item = {
        username: username,
        email: email,
        password: password
    };

    mongo.connect(url, function(err, db) {
        db.collection('user-data').insertOne(item, function(err, result) {
            //assert.equal(null, err);
            console.log('Item inserted');
            db.close();
        });
    });

    res.render('register', {username: username, email: email, password: password});
});

module.exports = router;
