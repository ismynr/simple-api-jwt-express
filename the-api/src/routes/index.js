const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');

const profileController = require('../controllers/profile');
const registerController = require('../controllers/register');
const articleController = require('../controllers/article');
const apiController = require('../controllers/api');

router.post("/register", bodyParser.json(), registerController.register);
router.get("/profile", profileController.profileDetails);
router.post("/article", bodyParser.json(), articleController.articleCreate);
router.get("/article", articleController.articleList);
router.get("/article/:id", articleController.articleGetById);
router.post("/api/token", bodyParser.json(), apiController.apiCreate);
router.post("/api/token/refresh", bodyParser.json(), apiController.apiRefreshToken);

module.exports = router;
