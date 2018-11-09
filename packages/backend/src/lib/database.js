import mysql from 'mysql';

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export const dbQueryPromise = (sql, args) =>
  new Promise((resolve, reject) => {
    db.query(sql, args, (error, results) => {
      if (error) return reject(error);
      return resolve(results);
    });
  });

export default db;
