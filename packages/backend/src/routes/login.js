import express from 'express';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('login', {});
});

router.post('/submit', (req, res, next) => {
  const { username, password } = req.body;
  res.redirect('/account');
});

export default router;
