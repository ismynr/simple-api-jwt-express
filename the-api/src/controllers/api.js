const asyncHandler = require("express-async-handler");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const Auth = require('../models/Auth');
const jwtHelper = require('../security/jwt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.apiRefreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not provided' });
  }

  db.all(
    `SELECT * FROM authentications WHERE token = ?`,
    [
      refreshToken,
    ],
    (err, rows) => {
      if (err) {
        console.log(err);
        throw new Error('error when getting refresh token ');
      }

      try {
        const decoded = jwtHelper.verifyRefreshToken(refreshToken);
        const userId = decoded.userId;
    
        const token = jwtHelper.generateToken({ userId });
    
        res.json({ token });
      } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Invalid refresh token' });
      }
    }
  );
});

exports.apiCreate = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  db.all(
    `SELECT * FROM users WHERE username = ?`,
    [
      username,
    ],
    async (err, rows) => {
      if (err) {
        console.log(err);
        throw new Error('error when getting refresh token ');
      }

      const { id, password: hashedPassword } = rows[0];
      const match = await bcrypt.compare(password, hashedPassword);

      if (!match) {
        res.status(403).json({ message: 'Wrong credential' });
      }

      try {
        const token = jwtHelper.generateToken({ userId: id });
        const refreshToken = jwtHelper.generateRefreshToken({ userId: id });
        Auth.createRefreshToken(refreshToken);
    
        res.json({ token, refreshToken });
      } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Invalid refresh token' });
      }
    }
  );
});