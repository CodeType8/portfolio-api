// app.js
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');

const config = require('./config/config');
const { sequelize } = require('./config/db');
const initModels = require('./models/initModels');
const extractUserFromToken = require('./middlewares/extractUserFromToken');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const { createCorsMiddleware } = require('./config/cors');

const app = express();

const { corsMiddleware, preflightMiddleware } = createCorsMiddleware(config.url);

app.use(corsMiddleware);

/**
 * Handle preflight requests explicitly for all routes.
 * This improves reliability for complex requests using credentials/headers.
 */
app.options('*', preflightMiddleware);

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