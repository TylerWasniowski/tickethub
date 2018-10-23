import express from 'express';
import db from '../lib/database';

const router = express.Router();

// TODO: Add to frontend
// router.get('/account',function (req, res, next) {
//   res.render('account', {name : req.session.name, username : req.session.username, email : req.session.email, success : req.session.success,})
// })

// TODO: Move to it's own account routes file
router.post('/account/submit', (req, res, next) => {
  const item = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  console.log(item);

  if (!req.session.success) {
    res.send('not logged in');
  }

  db.query(
    'UPDATE users SET name = ?, email = ?, password = ? WHERE username = ?',
    [item.name, item.email, item.password, req.session.username],
    (error, results, fields) => {
      if (error) throw error;
    }
  );

  res.redirect('/');
});

// TODO: Move to other route file
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.send('logged out');
});

router.get('/ticket/:id', (req, res, next) => {
  db.query(
    'SELECT * FROM events WHERE id = ?',
    req.params.id,
    (error, results, fields) => {
      if (error) throw error;

      console.log(results);

      if (!results.length) {
        res.send('Ticket does not exist');
      }
      res.send(results[0]);
    }
  );
});

export default router;
