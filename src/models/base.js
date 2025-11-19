'use strict';
const { DataTypes } = require('sequelize');

// Provides a simple base taxonomy used by bar menu features.
module.exports = (sequelize) => {
  // Columns capture the display name and optional description for a base.
  return sequelize.define('Base', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
  }, {
    tableName: 'bases',
    timestamps: true,
    underscored: true,
  });
};
