'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('PasswordResetTokens', {
    email: { type: DataTypes.STRING(255), allowNull: false },
    token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used_at: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'used', 'expired', 'revoked'),
      defaultValue: 'pending'
    },
  }, {
    tableName: 'password_reset_tokens',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['email'] },
      { fields: ['token'] },
      { fields: ['brand_id'] },
      { fields: ['branch_id'] }
    ]
  });
};