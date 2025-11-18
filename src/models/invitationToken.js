'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('InvitationToken', {
    email: { type: DataTypes.STRING(255), allowNull: false },
    token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    meta: { type: DataTypes.JSONB, allowNull: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    used_at: { type: DataTypes.DATE, allowNull: true },
    status: {
      type: DataTypes.ENUM('pending', 'used', 'expired', 'revoked'),
      defaultValue: 'pending'
    },
    created_by: { type: DataTypes.INTEGER, allowNull: true } // user_id of inviter (null for master)
  }, {
    tableName: 'invitation_tokens',
    timestamps: true,
    underscored: true,
  });
};