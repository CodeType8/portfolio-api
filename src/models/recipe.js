'use strict';
const { DataTypes } = require('sequelize');

// Represents a recipe entry within the bar menu module.
module.exports = (sequelize) => {
  // Fields capture ownership, preparation steps, and serving details.
  return sequelize.define('Recipe', {
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    ingredients: { type: DataTypes.TEXT },
    instructions: { type: DataTypes.TEXT },
    glass_type: { type: DataTypes.STRING },
    garnish: { type: DataTypes.STRING },
    is_alcoholic: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    prep_time_minutes: { type: DataTypes.INTEGER },
    abv: { type: DataTypes.DECIMAL(5, 2) },
  }, {
    tableName: 'recipes',
    timestamps: true,
    underscored: true,
  });
};
