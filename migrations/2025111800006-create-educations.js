'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('educations', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      career_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'careers', key: 'id' },
        onDelete: 'CASCADE',
      },
      school_name: { type: Sequelize.STRING(180), allowNull: false },
      degree: { type: Sequelize.STRING(140) },
      field_of_study: { type: Sequelize.STRING(140) },
      start_date: { type: Sequelize.DATEONLY },
      end_date: { type: Sequelize.DATEONLY },
      grade: { type: Sequelize.STRING(40) },
      summary: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('educations');
  }
};
