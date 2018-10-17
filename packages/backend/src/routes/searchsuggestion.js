import express from 'express';
import db from '../lib/database';

const router = express.Router();

router.get('/', (req, res, next) => {
  db.query(
    `SELECT Name FROM events WHERE Name LIKE${db.escape(`${req.query.name}%`)}`,
    (error, results, fields) => {
      if (error) throw error;
      // console.log(results);
      res.json({
        events: ['event1', 'event2', 'event3', req.query.name, results],
      });
      // res.json(results);
    }
  );

  // res.json({events: ['event1', 'event2', 'event3', req.query.name]});
});

// router.get('/searchsuggestion', (res,req,next) => {
//   res.json({test: 'Hello world'});
// });

export default router;
