import express from 'express';
import db from '../lib/database';
import deliveryBy from '../lib/distanceMatrix';

const router = express.Router();

let buyerAddress;
let sellerAddress;

router.get('/', async (req, res) => {
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
        5, // [req.params.id],
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
      throw new Error('no seller Id');
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
