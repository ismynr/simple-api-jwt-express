const asyncHandler = require("express-async-handler");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const jwtHelper = require('../security/jwt');
const jwt = require('jsonwebtoken');

exports.profileDetails = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Missing token' });
  }

  try {
    const decoded = jwtHelper.verifyToken(token);
    const userId = decoded.userId;
    db.all(
      `SELECT * FROM users WHERE id = ?`, [userId], (err, rows) => {
        if (err) {
          throw new Error('error when getting user');
        }
        res.json(rows);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting users');
  }
});
