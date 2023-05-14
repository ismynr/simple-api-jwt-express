const crypto = require('crypto');
const SECRET_KEY = 'secretkey';
const REFRESH_TOKEN_SECRET = 'refreshtokensecret';

const jwt = require('jsonwebtoken');

const generateRefreshToken = (payload) => {
  const refreshToken = 'TSTMY' + jwt.sign(payload, REFRESH_TOKEN_SECRET);
  return refreshToken;
}

const generateToken = (payload) => {
  const accessToken = 'TSTMY' + jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
  return accessToken;
}

const verifyRefreshToken = (refreshToken) => {
  const result = refreshToken.replace(/^TSTMY/, '');
  const verifyToken = jwt.verify(result, REFRESH_TOKEN_SECRET);
  return verifyToken;
}

const verifyToken = (refreshToken) => {
  const result = refreshToken.replace(/^TSTMY/, '');
  const verifyToken = jwt.verify(result, SECRET_KEY);
  return verifyToken;
}

module.exports = { SECRET_KEY, REFRESH_TOKEN_SECRET, generateRefreshToken, generateToken, verifyToken, verifyRefreshToken }