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
    const distMiles = result.distance.value;
    const durationSeconds = result.duration.value;

    // Your Fare (UberX type, US dollar) = Base Fare + (Cost per minute * time in ride)
    //            + (Cost per mile * ride distance) + Booking Fee + Other Fees
    const yourFare =
      0 + 0.24 * (durationSeconds / 60) + 1.06 * distMiles + 2.3 + 7.3;
    return {
      price: yourFare,
      eta: moment()
        .add(durationSeconds, 'seconds')
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

export default async function getInfo(ticketId, buyerAddress, shippingMethod) {
  const sellerAddress = await dbQueryPromise(
    'SELECT * FROM tickets WHERE id = ?',
    ticketId
  )
    .then(results => results[0].sellerId)
    .then(async sellerId =>
      dbQueryPromise('SELECT address FROM users WHERE id = ?', sellerId).catch(
        console.log
      )
    )
    .then(results => results[0].address)
    .catch(console.log);

  console.log(buyerAddress);
  console.log(sellerAddress);
  return getDeliveryFunction(shippingMethod)(buyerAddress, sellerAddress).catch(
    console.log
  );
}
