const jwt = require('jsonwebtoken');
const config = require('../config/config');

const extractUserFromToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    req.logUser = null;
    return next();
  }

  try {
    const decoded = jwt.decode(token);
    req.logUser = decoded
      ? {
          user_id: decoded.id,
          email: decoded.email,
        }
      : null;
  } catch (err) {
    req.logUser = null;
  }

  next();
};

module.exports = extractUserFromToken;
