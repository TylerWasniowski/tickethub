import express from 'express';
import db from '../lib/database';

const router = express.Router();

// TODO: Add to frontend
// router.get('/account',function (req, res, next) {
//   res.render('account', {name : req.session.name, username : req.session.username, email : req.session.email, success : req.session.success,})
// })

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
