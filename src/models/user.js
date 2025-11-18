'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('User', {
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    phone_number: DataTypes.STRING(20),
    status: {
      type: DataTypes.ENUM('invited', 'verified', 'disabled'),
      defaultValue: 'invited'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true
  });
};
