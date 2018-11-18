import distance from 'google-distance-matrix';
import Easypost from '@easypost/api';
import { dbQueryPromise } from './database';

async function UBERFeeCalculation(buyerAddress, sellerAddress) {
  const origins = [buyerAddress];
  const destinations = [sellerAddress];

  distance.key(process.env.GOOGLE_API_KEY);
  distance.units('imperial');
  distance.mode('driving');

  const distances = await new Promise((resolve, reject) => {
    distance.matrix(origins, destinations, (err, dis) => {
      if (err) {
        reject(err);
      } else {
        resolve(dis);
      }
    });
  });

  if (!distances) {
    throw new Error('404 Not Found');
  }

  if (distances.status === 'OK') {
    for (let i = 0; i < origins.length; i += 1) {
      for (let j = 0; j < destinations.length; j += 1) {
        const origin = distances.origin_addresses[i];
        const destination = distances.destination_addresses[j];
        if (distances.rows[0].elements[j].status === 'OK') {
          // distance in mile
          const dist = parseFloat(distances.rows[i].elements[j].distance.text);

          // duration in minute
          const duration = parseFloat(
            distances.rows[i].elements[j].duration.text
          );

          // Your Fare (UberX type, US dollar) = Base Fare + (Cost per minute * time in ride)
          //            + (Cost per mile * ride distance) + Booking Fee + Other Fees
          const yourFare = 0 + 0.24 * duration + 1.06 * dist + 2.3 + 7.3;
          return yourFare;
        }
        throw new Error('404 Not Found');
      }
    }
  }
  throw new Error('406 Not Acceptable');
}

export function upsFeeCalculation(fromAddr, toAddr) {
  const apiKey = process.env.EASYPOST_API_KEY;
  const api = new Easypost(apiKey);

  // set addresses
  const fromAddrArr = fromAddr.split(',');
  const fromAddress = new api.Address({
    street: '1325 E Calaveras Blvd', // fromAddrArr[0],
    city: 'Milpitas', // fromAddrArr[1],
    state: 'CA', // fromAddrArr[2]
  });
  fromAddress
    .save()
    .then(console.log)
    .catch.catch(err => console.log(`Error to save: ${JSON.stringify(err)}`));

  const toAddrArr = toAddr.split(',');
  const toAddress = new api.Address({
    street: '21250 Stevens creek blvd', // toAddrArr[0],
    city: 'cupertino', // toAddrArr[1],
    state: 'CA', // toAddrArr[2]
  });
  toAddress
    .save()
    .then(console.log)
    .catch(err => console.log(`Error to save: ${JSON.stringify(err)}`));

  const parcel = new api.Parcel({
    predefined_package: 'FlatRateEnvelope',
    weight: 1,
  });
  parcel
    .save()
    .then(console.log)
    .catch.catch(err => console.log(`Error to save: ${JSON.stringify(err)}`));

  const rate = new api.Rates({
    mode: 'test',
    carrier: 'ups',
    carrier_account_id: process.env.UPS_ACCOUNT_ID,
  });
  rate
    .save()
    .then(console.log)
    .catch.catch(err => console.log(`Error to save: ${JSON.stringify(err)}`));

  const shipment = new api.Shipment({
    to_address: toAddress,
    from_address: fromAddress,
    parcel,
    rates: rate,
  });
  shipment
    .save()
    .then(console.log)
    .catch.catch(err => console.log(`Error to save: ${JSON.stringify(err)}`));

  return shipment.rates.rate;

  // var t='6';
  // shipment.save().then(s => {
  //   console.log(s.id);
  // });

  // shipment.rates.forEach(rate =>{
  // rate.carrier;
  // rate.service;
  // rate.rate;
  // rate.id;
  // return t;
  //   });
  // return "5"; //shipment.rates['rate'];

  // shipment.retrieve().then(s => {
  //   s.regenerateRates().then(s => { return s.rates;  //, {
  //   //   depth: null,
  //   })
  // });
}

export function fedExFeeCalculation(fromAddress, toAddress) {
  return 'fedExFee';
}

export function shippingMethodSelection(fromAddress, toAddress, shippingSel) {
  switch (shippingSel) {
    case 'ups':
      return upsFeeCalculation(fromAddress, toAddress);
    case 'uber':
      return UBERFeeCalculation(fromAddress, toAddress);
    case 'fedex':
      return fedExFeeCalculation(fromAddress, toAddress);
    default:
      return upsFeeCalculation(fromAddress, toAddress);
  }
}

export function getFee(ticketid, userid, shippingChoice) {
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
    .then(addresses =>
      shippingMethodSelection(addresses[0], addresses[1], shippingChoice)
    )
    .catch(console.log);
}

export default getFee;
