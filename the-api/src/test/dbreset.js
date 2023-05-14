const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

exports.reset = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id STRING PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        firstName TEXT NULL,
        lastName TEXT NULL,
        telephone TEXT NULL,
        profileImage TEXT NULL,
        address TEXT NULL,
        city TEXT NULL,
        province TEXT NULL,
        country TEXT NULL
      )
    `);
  
    db.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id STRING PRIMARY KEY,
        sender_id STRING,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        FOREIGN KEY (sender_id) REFERENCES users(id)
      )
    `);
  
    db.run(`
      CREATE TABLE IF NOT EXISTS authentications (
        token TEXT NOT NULL
      )
    `);
  });
}