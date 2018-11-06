import express from 'express';
import db from '../lib/database';
import deliveryBy from '../lib/distanceMatrix';

const router = express.Router();

router.post('/buy/submit', (req, res, next) => {
  const ticketInfo = {
    boughtUserId: req.session.id, // check
    deliveryMethod: req.body.deliveryMethod,
    address: req.body.address,
    ticketId: req.body.ticketId,
  };

  db.query(
    'UPDATE tickets SET boughtUserId=?, deliveryMethod=?, address=?, available=0 WHERE id=?',
    [
      ticketInfo.boughtUserId,
      ticketInfo.deliveryMethod,
      ticketInfo.address,
      ticketInfo.ticketId,
    ],
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }
      res.json('OK');
    }
  );
});

// not in database yet
router.post('/payment/submit', (req, res, next) => {
  const paymentInfo = {
    boughtUserId: req.session.id, // check
    cardNumber: req.body.cardNumber,
    cardBrand: req.body.cardBrand,
    nameOnCard: req.body.cardNumber,
    cardExpiration: req.body.cardExpiration,
  };

  // check if valid
  // if valid then add into database
  db.query(
    'UPDATE users SET cardNumber=?, cardBrand=?, nameOnCard=?, cardExpiration=? WHERE id=?',
    [
      paymentInfo.cardNumber,
      paymentInfo.cardBrand,
      paymentInfo.nameOnCard,
      paymentInfo.cardExpiration,
      paymentInfo.boughtUserId,
    ],
    (error, results, fields) => {
      if (error) {
        console.log(`Error contacting database: ${JSON.stringify(error)}`);
        res.json(500, error);
      }
      res.json('OK');
    }
  );
});

// delivery
let buyerAddress;
let sellerAddress;

router.get('/:id', async (req, res) => {
  async function run() {
    try {
      res.json(await deliveryBy(buyerAddress, sellerAddress));
    } catch (error) {
      res.json(error);
    }
  }

  // Check if session exists
  if (req.session && req.session.username) {
    // Retrieve seller id
    const selluserId = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM tickets WHERE id = ?',
        req.params.id,
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results[0].sellUserId);
          }
        }
      );
    });

    // Retrieve buyer's address from db using buyer's username
    db.query(
      'SELECT * FROM users WHERE  username = ?',
      req.session.username,
      (error, results) => {
        if (error) throw error;
        buyerAddress = [results[0].address];
      }
    );

    if (!selluserId) {
      throw new Error('No seller Id');
    } else {
      // Retrieve seller's address from db using ticket's info
      db.query(
        'SELECT * FROM users WHERE id = ?',
        await selluserId,
        (error, results) => {
          if (error) throw error;
          sellerAddress = [results[0].address];
        }
      );
    }

    run();
  } else {
    res.redirect('/login');
  }
});

export default router;
