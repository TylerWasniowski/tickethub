import { dbQueryPromise, db } from '../lib/database';

function getConnection() {
  return db;
}

export default getConnection;
