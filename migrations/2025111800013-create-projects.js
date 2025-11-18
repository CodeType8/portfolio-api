'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('projects', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      career_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'careers', key: 'id' },
        onDelete: 'CASCADE',
      },
      name: { type: Sequelize.STRING(180), allowNull: false },
      role: { type: Sequelize.STRING(120) },
      description: { type: Sequelize.TEXT },
      tech_stack: { type: Sequelize.TEXT },
      link_url: { type: Sequelize.STRING },
      start_date: { type: Sequelize.DATEONLY },
      end_date: { type: Sequelize.DATEONLY },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('projects');
  }
};
