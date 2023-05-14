const asyncHandler = require("express-async-handler");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const Article = require('../models/Article');
const { v4: uuidv4 } = require('uuid');
const jwtHelper = require('../security/jwt');

exports.articleCreate = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Missing token' });
  }

  const article = req.body;
  const articleId = uuidv4();

  try {
    const decoded = jwtHelper.verifyToken(token);
    const userId = decoded.userId;
  
    const newArticle = { ...article, sender_id: userId, id: articleId };
    Article.createArticle(newArticle);
    res.send(newArticle);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating article');
  }
});

exports.articleList = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Missing token' });
  }

  try {
    jwtHelper.verifyToken(token);

    db.all(
      `SELECT * FROM articles`, [], (err, rows) => {
        if (err) {
          throw new Error('error when getting article');
        }
        res.json(rows);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting article');
  }
});

exports.articleGetById = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Missing token' });
  }

  const { id } = req.params;
  try {
    jwtHelper.verifyToken(token);

    db.all(
      `SELECT * FROM articles WHERE id LIKE ?`, [id], (err, rows) => {
        if (err) {
          console.log(err);
          throw new Error('error when getting article');
        }
        res.json(rows);
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting article');
  }
});
