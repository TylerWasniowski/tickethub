import express from 'express';

const router = express.Router();

// TODO: Add to frontend
// router.get('/account',function (req, res, next) {
//   res.render('account', {name : req.session.name, username : req.session.username, email : req.session.email, success : req.session.success,})
// })

// TODO: Move to it's own account routes file
router.post('/account/submit', (req, res, next) => {
  res.redirect('/account');
});

// TODO: Move to other route file
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('login');
});

export default router;
