'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('experiences', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      career_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'careers', key: 'id' },
        onDelete: 'CASCADE',
      },
      company_name: { type: Sequelize.STRING(150), allowNull: false },
      title: { type: Sequelize.STRING(150), allowNull: false },
      location: { type: Sequelize.STRING(20), allowNull: false },
      employment_type: { type: Sequelize.STRING(80) },
      start_date: { type: Sequelize.DATEONLY, allowNull: false },
      end_date: { type: Sequelize.DATEONLY },
      is_current: { type: Sequelize.BOOLEAN, defaultValue: false },
      description: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('experiences');
  }
};
