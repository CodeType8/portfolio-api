// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const config = require('./config/config');
const { sequelize } = require('./config/db');
const initModels = require('./models/initModels');
const extractUserFromToken = require('./middlewares/extractUserFromToken');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

/**
 * CORS policy goals
 * 1) Allow localhost (any port) for development convenience.
 * 2) Allow any subdomain for approved base domains.
 * 3) Support multiple allowed addresses; also allow all domains found in config.url if desired.
 *
 * Implementation notes
 * - Use a dynamic origin function to decide per request.
 * - Normalize inputs to hostnames.
 * - Compare by "apex domain" (simple last-2-label rule) to allow any subdomain.
 */

/**
 * Extract hostname from a value.
 * Examples:
 * - "https://a.b.com:3000" -> "a.b.com"
 * - "a.b.com" -> "a.b.com"
 */
function toHostname(value) {
  if (!value) return null;
  try {
    const v = String(value).trim();
    const url = v.includes('://') ? new URL(v) : new URL(`http://${v}`);
    return url.hostname.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Collect allowed hostnames from config.url.
 * - Accepts strings, arrays, and objects (nested).
 * - Adds config.url.frontend AND every string-like value in config.url.
 */
function collectAllowedHostnames(urlConfig) {
  const out = new Set();

  const pushAny = (v) => {
    if (!v) return;

    // If it's an array, traverse all entries
    if (Array.isArray(v)) {
      v.forEach(pushAny);
      return;
    }

    // If it's an object, traverse all values
    if (typeof v === 'object') {
      Object.values(v).forEach(pushAny);
      return;
    }

    // Otherwise treat it as a scalar string candidate
    const h = toHostname(v);
    if (h) out.add(h);
  };

  // Preferred field (legacy / explicit)
  pushAny(urlConfig?.frontend);

  // Allow all domains found in config.url (per requirement #3)
  pushAny(urlConfig);

  return [...out];
}

/**
 * Identify localhost-like hostnames.
 * This allows any port because we match only by hostname.
 */
function isLocalhost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

/**
 * Convert a hostname to an "apex domain" using a simple last-2-label rule.
 * Example:
 * - "foo.bar.example.com" -> "example.com"
 *
 * Note: This does NOT fully handle Public Suffix List cases like "example.co.uk".
 * If you need PSL accuracy, replace this function with a PSL-based implementation.
 */
function toApexDomain(hostname) {
  const parts = hostname.split('.').filter(Boolean);
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join('.');
}

/**
 * Decide whether an origin hostname is allowed:
 * - Always allow localhost.
 * - Allow any subdomain if apex domain matches one of the allowed hostnames' apex domains.
 */
function isAllowedBySubdomainRule(originHostname, allowedHostnames) {
  if (!originHostname) return false;
  if (isLocalhost(originHostname)) return true;

  const originApex = toApexDomain(originHostname);

  return allowedHostnames.some((allowed) => {
    if (!allowed) return false;

    const allowedApex = toApexDomain(allowed);

    // If apex matches, allow both the apex itself and any subdomain under it
    return originApex === allowedApex;
  });
}

// Build the allowlist once at startup from configuration
const allowedHostnames = collectAllowedHostnames(config.url);

/**
 * CORS options with dynamic origin evaluation.
 * - Allows requests without an Origin header (e.g., server-to-server, health checks, Postman).
 * - Allows localhost any port.
 * - Allows any subdomain for approved apex domains derived from config.url.
 */
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    // Allow non-browser or same-origin contexts where Origin is missing
    if (!origin) return callback(null, true);

    let hostname = null;
    try {
      hostname = new URL(origin).hostname.toLowerCase();
    } catch {
      // Reject malformed Origin values
      return callback(new Error('Not allowed by CORS'));
    }

    if (isAllowedBySubdomainRule(hostname, allowedHostnames)) {
      return callback(null, true);
    }

    // Reject any Origin that does not match the policy
    return callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));

/**
 * Handle preflight requests explicitly for all routes.
 * This improves reliability for complex requests using credentials/headers.
 */
app.options('*', cors(corsOptions));

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Extract authenticated user info (if any) from the request token.
 * This runs before logging so logs can include user identity.
 */
app.use(extractUserFromToken);

/**
 * Attach config to req and perform request logging for authenticated users.
 */
app.use((req, res, next) => {
  // Attach config for downstream handlers
  req.config = config;

  // Skip logging if req.logUser does not exist or if req.url includes '/api/auth/me'
  if (!req.logUser || req.url.includes('/api/auth/me')) {
    return next();
  }

  const user = `User: ${req.logUser.user_id} (${req.logUser.email})`;

  // Include request body only when it exists and is non-empty
  const bodyData =
    req.body && Object.keys(req.body).length > 0 ? `- Body: ${JSON.stringify(req.body)}` : '';

  logger.info(`${req.method} ${req.url} - ${req.ip} - ${user} ${bodyData}`);
  next();
});

/**
 * Initialize Sequelize models and inject dependencies into route modules.
 */
const models = initModels(sequelize);
const deps = { sequelize, models };

/**
 * Register API routes.
 */
app.use('/api/auth', require('./routes/auth.routes')(deps));
app.use('/api/gallery', require('./routes/gallery.routes')(deps));
app.use('/api/users', require('./routes/user.routes')(deps));
app.use('/api/portfolio', require('./routes/portfolio.routes')(deps));
app.use('/api/bar', require('./routes/bar.routes')(deps));
app.use('/api/bases', require('./routes/base.routes')(deps));
app.use('/api/games', require('./routes/game.routes')(deps));

/**
 * Centralized error handler (should be the last middleware).
 */
app.use(errorHandler);

module.exports = app;