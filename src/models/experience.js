'use strict';
const { DataTypes } = require('sequelize');

// Describes a professional experience entry tied to a career profile.
module.exports = (sequelize) => {
  // Model fields capture employer, role, dates, and descriptive context.
  return sequelize.define('Experience', {
    career_id: { type: DataTypes.INTEGER, allowNull: false },
    company_name: { type: DataTypes.STRING(150), allowNull: false },
    title: { type: DataTypes.STRING(150), allowNull: false },
    employment_type: { type: DataTypes.STRING(80) },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY },
    is_current: { type: DataTypes.BOOLEAN, defaultValue: false },
    description: { type: DataTypes.TEXT },
  }, {
    tableName: 'experiences',
    timestamps: true,
    underscored: true,
  });
};
