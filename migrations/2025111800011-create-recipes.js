'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('recipes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      base_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'bases', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: { type: Sequelize.STRING(180), allowNull: false },
      description: { type: Sequelize.TEXT },
      ingredients: { type: Sequelize.TEXT },
      instructions: { type: Sequelize.TEXT },
      glass_type: { type: Sequelize.STRING(120) },
      garnish: { type: Sequelize.STRING(180) },
      is_alcoholic: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      abv: { type: Sequelize.DECIMAL(5, 2) },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('recipes');
  }
};
