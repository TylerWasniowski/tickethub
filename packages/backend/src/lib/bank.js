import mysql from 'mysql';

import { dbQueryPromise } from './database';

export async function buyerTransaction(buyerAcc, amount) {
  /*
  Buyer transaction and updates the database with the updated balance
  param buyerAcc String: the credit card number for the buyer
  param amount int: the amount of the ticket
  */
  const buyerCharge = amount + amount * 0.05;
  return dbQueryPromise(
    `UPDATE credit_cards 
     SET balance=balance-? 
     WHERE number=?`,
    [buyerCharge, buyerAcc]
  ).catch(err =>
    console.log(`Error contacting database: ${JSON.stringify(err)}`)
  );
}

export async function sellerTransaction(sellerAcc, amount) {
  /*
  Seller transaction and updates the dtabase with the updated balance
  param sellerAcc String: the credit card number for the seller
  param amount int: the amount of the ticket
  */
  const sellerPayment = amount - amount * 0.05;

  return dbQueryPromise(
    `UPDATE credit_cards 
     SET balance=balance+? 
     WHERE number=?`,
    [sellerPayment, sellerAcc]
  ).catch(err =>
    console.log(`Error contacting database: ${JSON.stringify(err)}`)
  );
}

export async function tickethubPayment(amount) {
  /*
  Updates the tickethub account with the payment from the 5% charge on both buyer and seller
  param amount int: the amount of the ticket
  */
  const tickethubCard = '4012888888881881';

  return dbQueryPromise(
    `UPDATE credit_cards 
     SET balance=balance+? 
     WHERE number=?`,
    [amount, tickethubCard]
  ).catch(err =>
    console.log(`Error contacting database: ${JSON.stringify(err)}`)
  );
}

export async function ticketTransaction(buyerAcc, sellerAcc, info) {
  buyerTransaction(buyerAcc, info.ticketPrice + info.fee + info.shippingPrice);
  sellerTransaction(sellerAcc, info.ticketPrice);
  tickethubPayment(info.fee);
}
