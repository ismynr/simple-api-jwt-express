const express = require('express');
const app = express();
const port = 8001;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('storage/sqlite/database.db');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id STRING PRIMARY KEY,
      username TEXT NOT NULL UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id STRING PRIMARY KEY,
      sender_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      FOREIGN KEY (sender_id) REFERENCES users(id)
    )
  `);
});

app.post('/users', bodyParser.json(), (req, res) => {
  const { username } = req.body;
  
  const userId = uuidv4();
  const user = { id: userId, username };
  // save user data to your database
  db.run(`INSERT INTO users(id, username) VALUES (?, ?)`, [userId, username], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating user');
    } else {
      res.send(user);
    }
  });
});

app.post("/messages", bodyParser.json(), (req, res) => {
  const { sender_id: senderId, content } = req.body;
  const messageId = uuidv4();
  const message = { id: messageId, senderId, content };
  db.run(`INSERT INTO messages(id, sender_id, content) VALUES (?, ?, ?)`, [messageId, senderId, content], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating messages');
    } else {
      res.send(message);
    }
  });
});

app.get("/users", async (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get("/messages", async (req, res) => {
  db.all(`SELECT users.username, msg.content FROM messages AS msg INNER JOIN users ON msg.sender_id = users.id`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.listen(port, () => console.log(`Express app running on port ${port}!`));