'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('skills', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      career_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'careers', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING(120), allowNull: false },
      level: { type: Sequelize.ENUM('beginner', 'intermediate', 'advanced', 'expert'), defaultValue: 'intermediate' },
      category: { type: Sequelize.STRING(80) },
      years_experience: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('skills');
  }
};
