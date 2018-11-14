import distance from 'google-distance-matrix';
import { dbQueryPromise } from './database';

async function deliveryBy(buyerAddress, sellerAddress) {
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
          const dist = distances.rows[i].elements[j].distance.text;
          return dist;
        }
        return `${destination} is not reachable by land from ${origin}`;
      }
    }
  }
  return '204 No Content';
}

export function getDistance(ticketid, userid) {
  const buyerAddressPromise = dbQueryPromise(
    'SELECT address FROM users WHERE id = ?',
    userid
  );

  const sellerAddressPromise = dbQueryPromise(
    'SELECT * FROM tickets WHERE id = ?',
    ticketid
  )
    .then(results => results[0].sellerId)
    .then(result =>
      dbQueryPromise('SELECT address FROM users WHERE id = ?', result)
    )
    .catch(console.log);

  return Promise.all([buyerAddressPromise, sellerAddressPromise])
    .then(bothResults => bothResults.map(results => results[0].address))
    .then(addresses => deliveryBy(addresses[0], addresses[1]))
    .catch(console.log);
}

export default getDistance;
