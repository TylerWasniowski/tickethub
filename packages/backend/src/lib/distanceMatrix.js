import distance from 'google-distance-matrix';
import { dbQueryPromise } from './database';

export async function deliveryBy(buyerAddress, sellerAddress) {
  const origins = [buyerAddress];
  const destinations = [sellerAddress];

  distance.key(process.env.GOOGLE_API_KEY);
  distance.units('imperial');
  distance.mode('driving');

  const distances = await new Promise((resolve, reject) => {
    distance.matrix(origins, destinations, (err, dura) => {
      if (err) {
        reject(err);
      } else {
        resolve(dura);
      }
    });
  });

  if (!distances) {
    throw new Error('no distance');
  }

  if (distances.status === 'OK') {
    for (let i = 0; i < origins.length; i += 1) {
      for (let j = 0; j < destinations.length; j += 1) {
        const origin = distances.origin_addresses[i];
        const destination = distances.destination_addresses[j];
        if (distances.rows[0].elements[j].status === 'OK') {
          // const duration = distances.rows[i].elements[j].duration.text;
          const dist = distances.rows[i].elements[j].distance.text;
          return dist;
        }
        return `${destination} is not reachable by land from ${origin}`;
      }
    }
    return console.log('result was not found in the above loops');
  }
  return console.log('status is not ok');
}

export function getDistance(ticketid, userid) {
  const buyerAddressPromise = dbQueryPromise(
    'SELECT address FROM users WHERE id = ?',
    userid
  );

  let sellerAddressPromise;

  const sellerId = dbQueryPromise(
    'SELECT * FROM tickets WHERE id = ?',
    ticketid
  )
    .then(results => results[0].sellerId)
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

export default getDistance;
