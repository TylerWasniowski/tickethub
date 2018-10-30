import express from 'express';
import db from '../lib/database';

const router = express.Router();

router.get('/:id', (req, res, next) => {
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

// function bankInfoExists(id) {
//   db.query('SELECT email FROM Users WHERE Id = ?', 1, (error, results, fields) => {
//     if(error) {
//       console.log(`Error contacting database: ${JSON.stringify(error)}`);
//       res.json(500, error);
//     }
//     else {
//       email = results[0].email; // just testing
//     }
//   });
// };

router.get('/check-email', (req, res, next) => {
  res.json('email'); // just testing
});

// bank info & ADDRESS
// check if bank info exists using SELECT
// if doesn't exist, ask for

router.post('/submit-bank', (req, res, next) => {
  const bankInfo = {
    stuff: req.body.stuff,
  };

  // db.query('SELECT * FROM users WHERE username = ?', req.session.username, //?
  //   (error,results, fields) => {
  //     if(error) {
  //       console.log(`Error contacting database: ${JSON.stringify(error)}`);
  //       res.json(500, error);
  //     }
  //     if(results) {

  //     }
  //   }
  // );
});

// drop down menu of all events? choose one or create new
// new event
router.post('/new-event', (req, res, next) => {
  const eventInfo = {
    eventName: req.body.eventName,
    dateTime: req.body.dateTime,
    venue: req.body.vanue,
    city: req.body.city,
    details: req.body.details, // can be null
    artistName: req.body.artistName,
  };

  db.query(
    'INSERT INTO events (eventName, dateTime, venue, city, details, artistName) SET ?',
    eventInfo,
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }
    }
  );
});

// //new event
// function newEvent(eventInfo){
// 	db.query('INSERT INTO events (eventName, dateTime, venue, city, details, artistName) SET ?',
// 		eventInfo, (error, results, fields) => {
//       if (error) throw error;
//     }
//   );
// };

// ticket
router.post('/new/submit', (req, res, next) => {
  const ticketInfo = {
    price: req.body.price,
    eventId: req.body.eventId,
    seat: req.body.seat, // can be null, general seating
  };

  db.query(
    'INSERT INTO tickets (sellUserId, eventID, price, seat) VALUES (?,?,?,?)',
    [req.session.id, ticketInfo.eventId, ticketInfo.price, ticketInfo.seat],
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }

      res.json('OK');
    }
  );
});

// leave ticketID blank, auto
// insert new ticket, use User_ID as sellUserId
// function newTicket(userID, eventID, ticketInfo) {
// 	db.query('INSERT INTO ticket (sellUser, eventID, price, name, seat) SET ?',
// 		userID, eventID, ticketInfo, (error, results, fields) => {
// 			if (error) throw error;
// 		}
// 		//put mutiple? or merge into one?
//   );
// };

// //calculate actual amount after 5% charge (GET?)
// function saleCharge(price) {
//   let ret = price*1.05;
//   res.json(ret);
// };

router.get('/sale-charge/:price', (req, res, next) => {
  // res.send(saleCharge(req.params.price));
  const ret = req.params.price * 1.05;
  res.json(ret);
});

// delivery instructions?

export default router;
