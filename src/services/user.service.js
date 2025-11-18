const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

module.exports = ({ models }) => {
  const { User } = models;

  const findUserById = (id) => User.findOne({ where: { id, status: { [Op.ne]: 'disabled' } }, attributes: { exclude: ['password_hash'] } });

  const update = (id, payload) => User.update(payload, { where: { id }, returning: true });

  const changePassword = async (id, currentPassword, newPassword) => {
    const user = await User.findOne({ where: { id, status: { [Op.ne]: 'disabled' } } });
    if (!user) {
      return { success: false, message: 'User Not found', status: 404 };
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return { success: false, message: 'Current password is incorrect', status: 400 };
    }

    const passwordHash = await bcrypt.hash(newPassword, Number(config.saltRound));
    await user.update({ password_hash: passwordHash });

    return { success: true, data: { message: 'Password updated successfully' } };
  };

  return { findUserById, update, changePassword };
};
