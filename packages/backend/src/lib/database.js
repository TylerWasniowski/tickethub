import mysql from 'mysql';
import assert from 'assert';

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// function compareResult(queryName, result) {
//   for (let i = 0; i < result.length; i++) {
//     if(queryName )
//   };
// }

export default db;

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });
