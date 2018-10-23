import express from 'express';
import db from '../lib/database';

const router = express.Router();

router.get('/suggestions/:query', (req, res, next) => {
  db.query(
    `SELECT Name FROM events WHERE Name LIKE ${db.escape(
      `%${req.params.query}%`
    )}`,
    (error, results, fields) => {
      if (error) throw error;

      res.json(results.map(event => event.Name));
    }
  );
});

export default router;
