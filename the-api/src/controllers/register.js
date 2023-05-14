const User = require('../models/User');
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

exports.register = asyncHandler(async (req, res, next) => {
  const user = req.body;
  
  const userId = uuidv4();
  const hashedPassword = await bcrypt.hash(user.password, 10);

  try {
    const newUser = { ...user, id: userId, password: hashedPassword };
    User.createUser(newUser);
    res.send(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});
