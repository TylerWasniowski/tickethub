import moment from 'moment';
import mysql from 'mysql';
import { dbQueryPromise } from './database';

export async function test() {
  return true;
}

export async function checkEvents(eventName) {
  /*
  Checks if event already exists in the events table in database
  param eventName string: the name of event
  */
  return dbQueryPromise('SELECT name FROM events WHERE name = ?', eventName)
    .then(results => {
      if (!results.length) return false;

      return true;
    })
    .catch(console.log);
}

export async function createEvent(
  eventName = null,
  eventDateTime = null,
  eventVenue = null,
  eventCity = null,
  eventDetails = null
) {
  /*
  Creates an event in the event table if it does not already exist
  */
  if (!checkEvents(eventName)) {
    return dbQueryPromise('INSERT INTO events VALUES(?,?,?,?,?', [
      eventName,
      eventDateTime,
      eventVenue,
      eventCity,
      eventDetails,
    ]).catch(console.log);
  }
  return false;
}
