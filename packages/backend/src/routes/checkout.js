import express from 'express';
import { dbQueryPromise } from '../lib/database';
import deliveryBy from '../lib/distanceMatrix';

const router = express.Router();

router.get('/:id', async (req, res) => {
  // Check if session exists
  if (req.session && req.session.userId) {
    const sellerId = dbQueryPromise(
      'SELECT sellerId FROM tickets WHERE id = ?',
      req.params.id
    )
      .then(results => results[0].sellerId)
      .catch(console.log);

    if (!sellerId) {
      throw new Error('No seller Id');
    } else {
      const buyerAddressPromise = dbQueryPromise(
        'SELECT address FROM users WHERE id = ?',
        req.session.userId
      );

      const sellerAddressPromise = dbQueryPromise(
        'SELECT address FROM users WHERE id = ?',
        sellerId
      );

      Promise.all([buyerAddressPromise, sellerAddressPromise])
        .then(bothResults => bothResults.map(results => results[0].address))
        .then(addresses => deliveryBy(addresses[0], addresses[1]))
        .catch(console.log);
    }
  } else res.json(401, 'Error: Not logged in');
});

export default router;
