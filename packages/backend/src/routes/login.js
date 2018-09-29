var express = require('express');
var router = express.Router();


var mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';


router.get('/', function(req, res, next){
    res.render('login', {});
});


router.post('/submit',  function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    mongo.connect(url, function(err, db) {
        var dbo = db.db('tickethub');
        var query = { username: username, password: password};
        dbo.collection('user-data').find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            console.log(result.length);

            if (result.length == 1) {
                req.session.success = true;
                req.session.username = result[0].username;
                req.session.name = result[0].name;
                req.session.email = result[0].email;
                res.redirect('/account');
            }
            else {
                res.render('login', {error: 'invalid username or password'});
            }
        });
    });
});

module.exports = router;