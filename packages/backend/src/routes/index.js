var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var url = 'mongodb://localhost:27017/tickethub';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// TODO: Add to frontend
// router.get('/account',function (req, res, next) {
//   res.render('account', {name : req.session.name, username : req.session.username, email : req.session.email, success : req.session.success,})
// })

// router.get('/account/update',function (req, res, next) {
//     res.render('updateaccount', {});
// })


// TODO: Move to it's own account routes file
router.post('/account/submit', function (req, res, next) {

    var item = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };


    req.session.name = item.name;
    req.session.email = item.email;
    req.session.password = item.password;

    console.log(item);


    mongo.connect(url, function(err, db) {
        var dbo = db.db('tickethub');
        dbo.collection('user-data').updateOne({"username": req.session.username}, {$set: item}, function(err, result) {
            if (err) throw err;
            console.log('Item updated');
            db.close();

        });
    });


    res.redirect('/account');


});

// TODO: Move to other route file
router.get('/logout', function (req, res, next) {
    req.session.destroy();
    res.redirect('login');
});

module.exports = router;
