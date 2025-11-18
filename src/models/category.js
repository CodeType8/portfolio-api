'use strict';
const { DataTypes } = require('sequelize');

// Provides a simple category taxonomy used by bar menu features.
module.exports = (sequelize) => {
  // Columns capture the display name and optional description for a category.
  return sequelize.define('Category', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
  }, {
    tableName: 'categories',
    timestamps: true,
    underscored: true,
  });
};
