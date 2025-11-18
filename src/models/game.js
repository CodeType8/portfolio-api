'use strict';
const { DataTypes } = require('sequelize');

// Simple placeholder model for future game server integrations.
module.exports = (sequelize) => {
  // Stores metadata for a hosted game instance or configuration.
  return sequelize.define('Game', {
    name: { type: DataTypes.STRING, allowNull: false },
    port: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM('draft', 'open', 'closed'), defaultValue: 'draft' },
    description: { type: DataTypes.TEXT },
  }, {
    tableName: 'games',
    timestamps: true,
    underscored: true,
  });
};
