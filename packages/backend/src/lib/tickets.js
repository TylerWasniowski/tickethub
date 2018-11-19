import moment from 'moment';
import mysql from 'mysql';

import { dbQueryPromise } from './database';
import getInfo from './shipping-info';

export function getTicketInfo(ticket) {
  return {
    id: ticket.id,
    eventId: ticket.eventId,
    seat: ticket.seat,
    price: ticket.price,
  };
}

export function hasTicket(session) {
  return (
    session.lockedUntil && moment.utc().isBefore(moment(session.lockedUntil))
  );
}

export async function getAvailableTickets(eventId) {
  const currentTimestamp = mysql.raw('UTC_TIMESTAMP()');
  return dbQueryPromise(
    `SELECT * FROM tickets WHERE
      eventId = ?
      AND available
      AND (lockedUntil IS NULL OR ? >= lockedUntil)
    `,
    [eventId, currentTimestamp]
  ).catch(err =>
    console.log(`Error contacting database: ${JSON.stringify(err)}`)
  );
}

export async function getTicket(id) {
  return dbQueryPromise('SELECT * FROM tickets WHERE id = ?', id)
    .then(results => {
      if (!results.length) return 'Ticket does not exist';

      return getTicketInfo(results[0]);
    })
    .catch(console.log);
}

export async function getAssignedTicket(session) {
  if (!hasTicket(session)) return undefined;
  return getTicket(session.ticketId);
}

export async function lockTicket(id) {
  const { LOCK_TIME_MINUTES } = process.env;
  const lockedTimestamp = mysql.raw(
    `UTC_TIMESTAMP() + INTERVAL ${LOCK_TIME_MINUTES} MINUTE`
  );
  const lockedMoment = moment()
    .add(LOCK_TIME_MINUTES, 'minutes')
    .utc();

  return dbQueryPromise('UPDATE tickets SET lockedUntil = ? WHERE id = ?', [
    lockedTimestamp,
    id,
  ])
    .then(() => lockedMoment.format())
    .catch(err =>
      console.log(`Error contacting database: ${JSON.stringify(err)}`)
    );
}

export async function getCheckoutInfo(ticketId, userId, shippingMethod) {
  const ticketPromise = getTicket(ticketId);
  const shippingInfoPromise = getInfo(ticketId, userId, shippingMethod);

  return Promise.all([ticketPromise, shippingInfoPromise])
    .then(results => ({
      ticketPrice: results[0].price,
      fee: results[0].price * 0.05,
      shippingPrice: results[1].price,
      eta: results[1].eta,
    }))
    .catch(console.log);
}
