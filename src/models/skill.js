'use strict';
const { DataTypes } = require('sequelize');

// Describes a skill or competency linked to a career profile.
module.exports = (sequelize) => {
  // Fields capture skill name, proficiency level, and classification.
  return sequelize.define('Skill', {
    career_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(120), allowNull: false },
    level: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'), defaultValue: 'intermediate' },
    category: { type: DataTypes.STRING(80) },
    years_experience: { type: DataTypes.INTEGER },
  }, {
    tableName: 'skills',
    timestamps: true,
    underscored: true,
  });
};
