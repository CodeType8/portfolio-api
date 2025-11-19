'use strict';
const { DataTypes } = require('sequelize');

// Represents a personal or professional project connected to a career.
module.exports = (sequelize) => {
  // Fields describe the project scope, responsibilities, and reference links.
  return sequelize.define('Project', {
    career_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(180), allowNull: false },
    description: { type: DataTypes.TEXT },
    tech_stack: { type: DataTypes.TEXT },
    link_url: { type: DataTypes.STRING },
    start_date: { type: DataTypes.DATEONLY },
    end_date: { type: DataTypes.DATEONLY },
  }, {
    tableName: 'projects',
    timestamps: true,
    underscored: true,
  });
};
