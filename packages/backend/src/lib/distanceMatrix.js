import distance from 'google-distance-matrix';

async function deliveryBy(buyerAddress, sellerAddress) {
  const origins = [buyerAddress];
  const destinations = [sellerAddress];

  distance.key('YOUR-API-KEY');
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
          return duration;
        }
        return `${destination} is not reachable by land from ${origin}`;
      }
    }
    return 'result was not found in the above loops';
  }
  return 'status is not ok';
}

export default deliveryBy;
