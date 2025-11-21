const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

// Provides user-centric data helpers with consistent active-user filtering.
module.exports = ({ models }) => {
  // User model reference injected for testability.
  const { User } = models;

  // Shared where clause to prevent operating on disabled accounts.
  const activeUserClause = { status: { [Op.ne]: 'disabled' } };

  // Looks up a user by id while omitting sensitive password hash fields.
  const findUserById = (id) => User.findOne({
    where: { id, ...activeUserClause },
    attributes: { exclude: ['password_hash'] },
  });

  // Applies partial updates to the provided user id and returns the affected rows.
  const update = (id, payload) => User.update(payload, { where: { id }, returning: true });

  // Validates the current password, hashes the new one, and persists the change.
  const changePassword = async (id, currentPassword, newPassword) => {
    // Step 1: Ensure the account exists and remains active.
    const user = await User.findOne({ where: { id, ...activeUserClause } });
    if (!user) {
      return { success: false, message: 'User Not found', status: 404 };
    }

    // Step 2: Guard against incorrect current password submissions.
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return { success: false, message: 'Current password is incorrect', status: 400 };
    }

    // Step 3: Hash and store the new password securely.
    const passwordHash = await bcrypt.hash(newPassword, Number(config.saltRound));
    await user.update({ password_hash: passwordHash });

    return { success: true, data: { message: 'Password updated successfully' } };
  };

  return { findUserById, update, changePassword };
};
