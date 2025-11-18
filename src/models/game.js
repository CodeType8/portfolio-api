'use strict';
const { DataTypes } = require('sequelize');

// Simple placeholder model for future game server integrations.
module.exports = (sequelize) => {
  // Stores metadata for a hosted game instance or configuration.
  return sequelize.define('Game', {
    name: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('draft', 'active', 'archived'), defaultValue: 'draft' },
    description: { type: DataTypes.TEXT },
  }, {
    tableName: 'games',
    timestamps: true,
    underscored: true,
  });
};
