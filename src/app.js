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

app.use(cors({ origin: config.url?.frontend, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(extractUserFromToken);

app.use((req, res, next) => {
  req.config = config;

  // Skip logging if req.logUser does not exist or if req.url includes '/api/auth/me'
  if (!req.logUser || req.url.includes('/api/auth/me')) {
    return next();
  }

  const user = `User: ${req.logUser.user_id} (${req.logUser.email})`;

  const bodyData = req.body && Object.keys(req.body).length > 0
    ? `- Body: ${JSON.stringify(req.body)}`
    : '';

  logger.info(`${req.method} ${req.url} - ${req.ip} - ${user} ${bodyData}`);
  next();
});

const models = initModels(sequelize);
const deps = { sequelize, models };

app.use('/api/master', require('./routes/master.routes')(deps));
app.use('/api/auth', require('./routes/auth.routes')(deps));
app.use('/api/users', require('./routes/user.routes')(deps));
app.use('/api/portfolio', require('./routes/portfolio.routes')(deps));
app.use('/api/user-roles', require('./routes/userRole.routes')(deps));
app.use('/api/brands', require('./routes/brand.routes')(deps));
app.use('/api/branchs', require('./routes/branch.routes')(deps));
app.use('/api/warehouses', require('./routes/warehouse.routes')(deps));
app.use('/api/suppliers', require('./routes/supplier.routes')(deps));
app.use('/api/categories', require('./routes/category.routes')(deps));
app.use('/api/items', require('./routes/item.routes')(deps));
app.use('/api/inventories', require('./routes/inventory.routes')(deps));
app.use('/api/inventory-log', require('./routes/inventoryChangeLog.routes')(deps));
app.use('/api/cart', require('./routes/cart.routes')(deps));
app.use('/api/orders', require('./routes/order.routes')(deps));
app.use('/api/purchase-orders', require('./routes/purchaseOrder.routes')(deps));

app.use(errorHandler);

module.exports = app;
