'use strict';
const { DataTypes } = require('sequelize');

// Describes a skill or competency linked to a career profile.
module.exports = (sequelize) => {
  // Fields capture skill name, proficiency level, and classification.
  return sequelize.define('Skill', {
    career_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: false },
    category: { type: DataTypes.STRING(80) },
  }, {
    tableName: 'skills',
    timestamps: true,
    underscored: true,
  });
};
