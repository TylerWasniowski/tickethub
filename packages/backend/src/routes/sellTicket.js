import express from 'express';
// import mysql from 'mysql';
// import sellCharge from '../lib/saleCharge';

const router = express.Router();

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// const connection = mysql.createConnection({
//   host: '35.233.153.166',
//   user: 'root',
//   password: 'group3cs160',
//   database: 'tickethub'
// });

// let email = '';

// //ask for bank info if not in database?
// //function bankInfoExists(id) {
//   connection.query('SELECT email FROM Users WHERE Id = ?', 1, (error, results, fields) => {
//     if(error) throw error;
//     //email = results[0].email;
//   });
// //}

// router.get('/', (req, res, next) => {
//   res.send('email');
// });

// router.post('/submit', (req,res,next) => {
//   //take ticket price, event name, seat #
//   const ticketInfo = {
//     price: req.body.price,
//     eventName: req.body.eventName,
//     seat: req.body.seat //can be null, general seating
//   }
//   //leave id blank, auto

//   //call - eventExists --- OR make user select/create new event

//   //const eventInfo = { artistName }

//   //if event does not exist, make ID for event and create event
//   //connection.query(    'INSERT INTO Events VALUES ?', function(err, results, fields) { //might be SET
//   //    if(err) throw err     }  );

//   //insert new ticket, use User_ID as sellUserId
//   connection.query(
//     'INSERT INTO '
//   );

// });

//  //if event does not exist (how to get input and check right away), take dateTime, details, artistName
//  function eventExists(eventName) //what if multiple of same name? can't ask for id. select event first?

// //calculate actual amount after 5% charge (GET?)
// function saleCharge(price) {
//   let ret = price*1.05;
//   res.json(ret);
// }
// router.get('/', (req, res, next) => {
//   res.send(saleCharge(price));
// }) ; //?????

// delivery instructions?

export default router;
