const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Require a valid gallery-scoped JWT token from Authorization header or cookie.
 */
module.exports = function requireGalleryAuth(req, res, next) {
  try {
    // Step 1: Resolve token from bearer auth header or fallback cookie.
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : (req.cookies?.token || null);

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Step 2: Verify signature and expiration using default auth secret.
    const payload = jwt.verify(token, config.jwt.secret);

    // Step 3: Ensure token belongs to gallery auth scope only.
    if (payload.scope !== 'gallery') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
