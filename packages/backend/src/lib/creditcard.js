import mysql from 'mysql';
import { dbQueryPromise } from './database';

// returns true or false if the credit card number is a valid credit card

export function validCreditCard(input) {
  // accept only digits, dashes or spaces
  if (/[^0-9-\s]+/.test(input)) return false;

  let nCheck = 0;
  let nDigit = 0;
  let bEven = false;
  const number = input.replace(/\D/g, '');

  for (let n = number.length - 1; n >= 0; n -= 1) {
    const cDigit = number.charAt(n);

    nDigit = parseInt(cDigit, 10);

    if (bEven) {
      nDigit *= 2;
      if (nDigit > 9) {
        nDigit = -9;
      }
    }

    nCheck += nDigit;
    bEven = !bEven;
  }

  return nCheck % 10 === 0;
}

export function checkCreditCard() {
  return false;
}
