const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const bcrypt = require('bcrypt');

exports.createRefreshToken = (token) => {
  db.run(
    `INSERT INTO authentications (token)
      VALUES (?)`,
    [
      token,
    ],
    (err) => {
      if (err) {
        console.log(err);
        throw new Error('error when creating refresh token ');
      }
    }
  );
}

exports.deleteRefreshToken = (token) => {
  db.run(
    `DELETE FROM authentications WHERE token = ?`,
    [
      token,
    ],
    (err) => {
      if (err) {
        console.log(err);
        throw new Error('error when getting refresh token ');
      }
    }
  );
}