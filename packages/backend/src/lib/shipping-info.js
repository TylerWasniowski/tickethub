import distance from 'google-distance-matrix';
import Maps from '@google/maps';
import Easypost from '@easypost/api';
import moment from 'moment';

import { dbQueryPromise } from './database';

const maps = Maps.createClient({
  key: process.env.GOOGLE_API_KEY_PLACES,
  Promise,
});
const easypost = new Easypost(process.env.EASYPOST_API_KEY);

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
    return 'result was not found in the above loops';
  }
  return 'status is not ok';
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

function findComponent(components, name) {
  const comp = components.find(component => component.types[0] === name);

  if (!comp) return '';
  return comp.long_name;
}

function findComponentShort(components, name) {
  const comp = components.find(component => component.types[0] === name);

  if (!comp) return '';
  return comp.short_name;
}

async function getAddressInfo(address) {
  return maps
    .geocode({ address })
    .asPromise()
    .then(response => response.json.results)
    .then(results => {
      if (!results.length) throw new Error("Can't find address");
      else return results;
    })
    .then(results => results[0].address_components)
    .then(comps => ({
      street1: `${findComponent(comps, 'street_number')} ${findComponent(
        comps,
        'route'
      )}`,
      street2: findComponent(comps, 'subpremise'),
      city: findComponent(comps, 'locality'),
      zip: findComponent(comps, 'postal_code'),
      state: findComponent(comps, 'administrative_area_level_1'),
      country: findComponentShort(comps, 'country'),
    }))
    .catch(console.log);
}

async function easypostRequest(fromAddress, toAddress, carrier) {
  const fromAddressInfoPromise = getAddressInfo(fromAddress);
  const toAddressInfoPromise = getAddressInfo(toAddress);

  const fromAddressInfo = await fromAddressInfoPromise;
  const toAddressInfo = await toAddressInfoPromise;

  const fromAddressObject = new easypost.Address({
    street1: fromAddressInfo.street1,
    street2: fromAddressInfo.street2,
    city: fromAddressInfo.city,
    state: fromAddressInfo.state,
    zip: fromAddressInfo.zip,
    country: fromAddressInfo.country,
  });

  const toAddressObject = new easypost.Address({
    street1: toAddressInfo.street1,
    street2: toAddressInfo.street2,
    city: toAddressInfo.city,
    state: toAddressInfo.state,
    zip: toAddressInfo.zip,
    country: toAddressInfo.country,
  });

  const parcelType = carrier === 'ups' ? 'UPSLetter' : 'FedExEnvelope';

  const parcelObject = new easypost.Parcel({
    predefined_package: parcelType,
    weight: 3.0,
  });

  const shipment = new easypost.Shipment({
    mode: 'production',
    to_address: toAddressObject,
    from_address: fromAddressObject,
    parcel: parcelObject,
  });

  const serviceName = carrier === 'ups' ? '2ndDayAir' : 'FEDEX_EXPRESS_SAVER';

  return shipment
    .save()
    .then(result => result.rates)
    .then(rates => rates.find(rate => rate.service === serviceName))
    .then(rate => ({
      eta: moment()
        .add(rate.delivery_days, 'days')
        .utc()
        .endOf('day')
        .format(),
      price: parseFloat(rate.rate),
    }))
    .catch(console.log);
}

async function upsDeliveryInfo(buyerAddress, sellerAddress) {
  return easypostRequest(sellerAddress, buyerAddress, 'ups');
}

async function fedexDeliveryInfo(buyerAddress, sellerAddress) {
  return easypostRequest(sellerAddress, buyerAddress, 'fedex');
}

async function uberDeliveryInfo(buyerAddress, sellerAddress) {
  distance.key(process.env.GOOGLE_API_KEY_ROUTING);
  distance.units('imperial');
  distance.mode('driving');

  const results = await new Promise((resolve, reject) => {
    distance.matrix([sellerAddress], [buyerAddress], (err, dis) => {
      if (err) {
        reject(err);
      } else {
        resolve(dis);
      }
    });
  });

  if (!results || !results.rows.length || !results.rows[0].elements.length)
    throw new Error('Uber devilvery error');

  const result = results.rows[0].elements[0];
  if (result.status === 'OK') {
    const distMiles = parseFloat(result.distance.text);
    const durationMinutes = parseFloat(result.duration.text);

    // Your Fare (UberX type, US dollar) = Base Fare + (Cost per minute * time in ride)
    //            + (Cost per mile * ride distance) + Booking Fee + Other Fees
    const yourFare = 0 + 0.24 * durationMinutes + 1.06 * distMiles + 2.3 + 7.3;
    return {
      price: yourFare,
      eta: moment()
        .add(durationMinutes, 'minutes')
        .utc()
        .format(),
    };
  }

  throw new Error('Uber delivery error');
}

function getDeliveryFunction(shippingMethod) {
  if (shippingMethod === 'ups') return upsDeliveryInfo;
  if (shippingMethod === 'uber') return uberDeliveryInfo;
  return fedexDeliveryInfo;
}

export default async function getInfo(ticketId, userId, shippingChoice) {
  const buyerAddressPromise = dbQueryPromise(
    'SELECT address FROM users WHERE id = ?',
    userId
  );

  const sellerAddressPromise = dbQueryPromise(
    'SELECT * FROM tickets WHERE id = ?',
    ticketId
  )
    .then(results => results[0].sellerId)
    .then(result =>
      dbQueryPromise('SELECT address FROM users WHERE id = ?', result)
    )
    .catch(console.log);

  return Promise.all([buyerAddressPromise, sellerAddressPromise])
    .then(bothResults => bothResults.map(results => results[0].address))
    .then(async addresses =>
      getDeliveryFunction(shippingChoice)(addresses[0], addresses[1])
    )
    .catch(console.log);
}
