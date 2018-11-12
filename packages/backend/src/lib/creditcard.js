import { db, dbQueryPromise } from './database';

// returns true if user has credit card
export function cardExists(sessionId) {
  dbQueryPromise(
    `SELECT * 
     FROM users
     WHERE id=?`,
    [sessionId]
  )
    .then(results => {
      if (!results[0].cardId) return false;
      return true;
    })
    .catch(console.log('Error connecting to db'));
}

// returns true or false if the credit card number is a valid credit card

export function validCreditCard(input) {
  // accept only digits, dashes or spaces
  if (/[^0-9-\s]+/.test(input)) return false;

  let nCheck = 0;
  let nDigit = 0;
  let bEven = false;
  const value = input.replace(/\D/g, '');

  for (let n = value.length - 1; n >= 0; n -= 1) {
    const cDigit = value.charAt(n);
    nDigit = parseInt(cDigit, 10);

    if (bEven) {
      nDigit *= 2;
      if (nDigit > 9) {
        nDigit -= 9;
      }
    }

    nCheck += nDigit;
    bEven = !bEven;
  }

  return nCheck % 10 === 0;
}

export async function checkCreditCard(number, name, cvv, exp) {
  return dbQueryPromise(
    'SELECT * FROM credit_cards WHERE number=? AND name=? AND cvv=? AND expiration=?',
    [number, name, cvv, exp]
  )
    .then(results => {
      if (results.length === 1) return true;

      return false;
    })
    .catch(console.log);
}
