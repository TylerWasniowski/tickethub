import moment from 'moment';
import mysql from 'mysql';

import { dbQueryPromise } from './database';

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

export async function lockTicket(id) {
  const { LOCK_TIME_MINUTES } = process.env;
  const lockedTimestamp = mysql.raw(
    `UTC_TIMESTAMP() + INTERVAL ${LOCK_TIME_MINUTES} MINUTE`
  );
  const lockedMoment = moment.add(LOCK_TIME_MINUTES, 'minutes').utc();

  console.log(lockedTimestamp);
  return dbQueryPromise('UPDATE tickets SET lockedUntil = ? WHERE id = ?', [
    lockedTimestamp,
    id,
  ])
    .then(() => lockedMoment)
    .catch(err =>
      console.log(`Error contacting database: ${JSON.stringify(err)}`)
    );
}

export function hasTicket(session) {
  return session.lockedUntil && moment.utc().isBefore(session.lockedUntil);
}

export function getTicketInfo(ticket) {
  return {
    id: ticket.id,
    eventId: ticket.eventId,
    seat: ticket.seat,
    price: ticket.price,
  };
}
