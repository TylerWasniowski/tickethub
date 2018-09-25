var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/account',function (req, res, next) {
  res.render('account', {name : req.session.name, username : req.session.username, email : req.session.email, success : req.session.success,})
})

module.exports = router;
