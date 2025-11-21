const jwt = require('jsonwebtoken');

// Parses the Authorization header and attaches a lightweight user object for logging.
const extractUserFromToken = (req, res, next) => {
  // Step 1: Pull the bearer token from the Authorization header, if present.
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    req.logUser = null;
    return next();
  }

  try {
    // Step 2: Decode (not verify) the token to avoid blocking requests on expired tokens during logging.
    const decoded = jwt.decode(token);
    req.logUser = decoded
      ? {
          user_id: decoded.id,
          email: decoded.email,
        }
      : null;
  } catch (err) {
    // Step 3: Fail gracefully if decoding breaks; downstream auth will enforce validity.
    req.logUser = null;
  }

  next();
};

module.exports = extractUserFromToken;
