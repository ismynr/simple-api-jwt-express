const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

exports.createUser = ({
  id,
  username,
  password,
  firstName,
  lastName,
  telephone,
  profileImage,
  address,
  city,
  province,
  country,
}) => {
  db.run(
    `INSERT INTO users (id,username,password,firstName,lastName,telephone,profileImage,address,city,province,country)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [
      id,
      username,
      password,
      firstName,
      lastName,
      telephone,
      profileImage,
      address,
      city,
      province,
      country,
    ],
    (err) => {
      if (err) {
        console.log(err);
        throw new Error('error when creating user ');
      }
    }
  );
}
