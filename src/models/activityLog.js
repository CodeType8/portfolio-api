'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ActivityLog', {
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    action: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.JSONB, allowNull: true },
    ip_address: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'activity_logs',
    timestamps: true,
    underscored: true
  });
};
