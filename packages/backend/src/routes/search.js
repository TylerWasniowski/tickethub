import express from 'express';
import db from '../lib/database';

const router = express.Router();

router.get('/suggestions/:query', (req, res, next) => {
  db.query(
    `SELECT Name FROM events WHERE Name LIKE ${db.escape(
      `%${req.params.query}%`
    )}`,
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      } else {
        res.json(results.map(event => event.Name));
      }
    }
  );
});

export default router;
