const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function requireAuth(req, res, next) {
  try {
    // support Bearer token or cookie token
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : (req.cookies?.token || null);
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });


    const payload = jwt.verify(token, config.jwt.secret);
    req.user = payload; // { id, email, roles, brand_ids, ... }
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};