import express from 'express';
import db from '../lib/database';

const router = express.Router();

router.get('/', (req, res, next) => {
  db.query(
    `SELECT Name FROM events WHERE Name LIKE${db.escape(`${req.query.name}%`)}`,
    (error, results, fields) => {
      if (error) throw error;

      res.json(results);
    }
  );
});

export default router;
