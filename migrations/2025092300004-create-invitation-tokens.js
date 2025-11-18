'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invitation_tokens', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      email: { type: Sequelize.STRING(255), allowNull: false },
      token: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      meta: { type: Sequelize.JSONB, allowNull: true },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      used_at: { type: Sequelize.DATE, allowNull: true },
      status: {
        type: Sequelize.ENUM('pending', 'used', 'expired', 'revoked'),
        defaultValue: 'pending'
      },
      created_by: { type: Sequelize.INTEGER, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('invitation_tokens');
  }
};