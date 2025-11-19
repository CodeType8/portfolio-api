'use strict';
const { DataTypes } = require('sequelize');

// Captures academic history entries associated with a career profile.
module.exports = (sequelize) => {
  // Columns store institution details, study focus, and attendance dates.
  return sequelize.define('Education', {
    career_id: { type: DataTypes.INTEGER, allowNull: false },
    school_name: { type: DataTypes.STRING(180), allowNull: false },
    degree: { type: DataTypes.STRING(140) },
    field_of_study: { type: DataTypes.STRING(140) },
    start_date: { type: DataTypes.DATEONLY },
    end_date: { type: DataTypes.DATEONLY },
    grade: { type: DataTypes.STRING(40) },
  }, {
    tableName: 'educations',
    timestamps: true,
    underscored: true,
  });
};
