import express from 'express';
import mysql from 'mysql';
import request from 'request';

const router = express.Router();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

let buyerAddress = '';
let sellerAddress = '';

// Retrieve address from buyer with id=1.
// When login integrate with this function, id would be retrived from username and password
connection.query(
  'SELECT * FROM users WHERE id = ?',
  1,
  (error, results, fields) => {
    if (error) throw error;
    buyerAddress += results[0].address;
  }
);

// Retrieve address from sellers with id=2.
// When login integrate with this function, id would be retrived from username and password
connection.query(
  'SELECT * FROM sellers WHERE id = ?',
  2,
  (error, results, fields) => {
    if (error) throw error;
    sellerAddress += results[0].address;
  }
);

// Get time it takes based on addresses of buyer and seller.
// The 'howlong' variable is a string. Need to convert to integer if needs calculation.
router.get('/', (req, res, next) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${buyerAddress}&destinations=${sellerAddress}&key=YOUR-API-KEY`;
  request(url, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const data = JSON.parse(body, true);
      const rowStr = JSON.stringify(data.rows);
      const howlong = rowStr.split(':')[6].split(',')[0];
      res.send(howlong);
    }
  });
});

export default router;
