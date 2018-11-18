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
  return dbQueryPromise('SELECT name FROM events WHERE name = ?', [eventName])
    .then(results => {
      if (!results.length) {
        console.log('NOT FOUND');
        return false;
      }
      return true;
    })
    .catch(err => console.log(`ERROR: ${JSON.stringify(err)}`));
}

export async function createEvent(
  eventName = null,
  eventDateTime = null,
  eventVenue = null,
  eventCity = null,
  eventDetails = null,
  eventArtistName = null,
  eventImage = null
) {
  /*
  Creates an event in the event table if it does not already exist
  */
  if (!(await checkEvents(eventName))) {
    return dbQueryPromise(
      'INSERT INTO events (name,dateTime,venue,city,details,artistName,image) VALUES(?,?,?,?,?,?,?)',
      [
        eventName,
        eventDateTime,
        eventVenue,
        eventCity,
        eventDetails,
        eventArtistName,
        eventImage,
      ]
    ).catch(err => console.log(`ERROR: ${JSON.stringify(err)}`));
  }
  return false;
}

export async function getEventId(eventName, eventDateTime) {
  return dbQueryPromise(
    'SELECT id FROM events WHERE name = ? AND dateTime = ?',
    [eventName, eventDateTime]
  )
    .then(results => {
      if (!results.length) {
        return false;
      }
      return results[0].id;
    })
    .catch(err => console.log(`ERROR: ${JSON.stringify(err)}`));
}
