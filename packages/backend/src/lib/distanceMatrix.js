import distance from 'google-distance-matrix';
import { dbQueryPromise } from './database';

export async function deliveryBy(buyerAddress, sellerAddress) {
  const origins = [buyerAddress];
  const destinations = [sellerAddress];

  distance.key(process.env.GOOGLE_API_KEY);
  distance.units('imperial');
  distance.mode('driving');

  const durations = await new Promise((resolve, reject) => {
    distance.matrix(origins, destinations, (err, dura) => {
      if (err) {
        reject(err);
      } else {
        resolve(dura);
      }
    });
  });

  if (!durations) {
    throw new Error('no duration');
  }

  if (durations.status === 'OK') {
    for (let i = 0; i < origins.length; i += 1) {
      for (let j = 0; j < destinations.length; j += 1) {
        const origin = durations.origin_addresses[i];
        const destination = durations.destination_addresses[j];
        if (durations.rows[0].elements[j].status === 'OK') {
          const duration = durations.rows[i].elements[j].duration.text;
          const dist = durations.rows[i].elements[j].distance.text;
          return { duration, dist };
        }
        return `${destination} is not reachable by land from ${origin}`;
      }
    }
    return console.log('result was not found in the above loops');
  }
  return console.log('status is not ok');
}

export function getDurationAndDistance(ticketid, userid) {
  const buyerAddressPromise = dbQueryPromise(
    'SELECT address FROM users WHERE id = ?',
    userid
  );

  let sellerAddressPromise;

  const sellerId = dbQueryPromise(
    'SELECT sellerId FROM tickets WHERE id = ?',
    ticketid
  )
    .then(results => results[0])
    .catch(console.log);

  if (!sellerId) {
    throw new Error('No seller Id');
  } else {
    sellerAddressPromise = dbQueryPromise(
      'SELECT address FROM users WHERE id = ?',
      sellerId
    );
  }

  Promise.all([buyerAddressPromise, sellerAddressPromise])
    .then(bothResults => bothResults.map(results => results[0].address))
    .then(addresses => deliveryBy(addresses[0], addresses[1]))
    .catch(console.log);
}

export default getDurationAndDistance;
