const crypto = require('crypto');

exports.randomToken = (len = 48) => crypto.randomBytes(len).toString('hex');