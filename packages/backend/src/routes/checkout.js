import express from 'express';
import mysql from 'mysql';

import deliveryBy from '../lib/distanceMatrix';

const router = express.Router();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

let buyerAddress;
let sellerAddress;

// Retrieve address from buyer with id=1.
// When login integrate with this function, id would be retrived from username and password
connection.query(
  'SELECT * FROM users WHERE id = ?',
  1,
  (error, results, fields) => {
    if (error) throw error;
    buyerAddress = [results[0].address];
  }
);

// Retrieve address from sellers with id=2.
// When login integrate with this function, id would be retrived from username and password
connection.query(
  'SELECT * FROM sellers WHERE id = ?',
  2,
  (error, results, fields) => {
    if (error) throw error;
    sellerAddress = [results[0].address];
  }
);

router.get('/', (req, res, next) => {
  async function run() {
    try {
      res.send(await deliveryBy(buyerAddress, sellerAddress));
    } catch (error) {
      res.send(error);
    }
  }

  run();
});

export default router;
