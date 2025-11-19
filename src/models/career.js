'use strict';
const { DataTypes } = require('sequelize');

// Defines the primary profile record that summarizes a user's career.
module.exports = (sequelize) => {
  // Declare columns that describe a user's professional overview and contact links.
  return sequelize.define('Career', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    headline: { type: DataTypes.STRING(150), allowNull: false },
    name: { type: DataTypes.STRING(20), allowNull: false },
    nickname: { type: DataTypes.STRING(20) },
    summary: { type: DataTypes.TEXT },
    location: { type: DataTypes.STRING(120) },
    website_url: { type: DataTypes.STRING },
    github_url: { type: DataTypes.STRING },
    linkedin_url: { type: DataTypes.STRING },
  }, {
    tableName: 'careers',
    timestamps: true,
    underscored: true,
  });
};
