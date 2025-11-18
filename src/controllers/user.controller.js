const { ok, fail } = require('../utils/response');

module.exports = (deps) => {
  const userService = require('../services/user.service')(deps);

  return {
    get: async (req, res) => {
      const userId = Number(req.params.user_id);

      const user = await userService.findUserById(userId);
      if (!user) return fail(res, 'User Not found', 404);

      return ok(res, user);
    },

    update: async (req, res) => {
      const userId = Number(req.params.user_id);
      const id = Number(req.user.id);

      // Authorization check
      const isMe = (userId == id)
      if (!isMe) return fail(res, 'Not authorized personnel', 403);

      const forbiddenFields = ['password', 'password_hash', 'current_pw', 'new_pw'];
      const hasForbiddenField = forbiddenFields.some((field) => Object.prototype.hasOwnProperty.call(req.body, field));
      if (hasForbiddenField) return fail(res, 'Password update is not allowed in this endpoint', 400);

      const [count, row] = await userService.update(userId, req.body);
      if (!count) return fail(res, 'No update', 400);

      return ok(res, row);
    },

    changePassword: async (req, res) => {
      const userId = Number(req.params.user_id);
      const id = Number(req.user.id);

      const isMe = (userId == id);
      if (!isMe) return fail(res, 'Not authorized personnel', 403);

      const { current_pw: currentPassword, new_pw: newPassword } = req.body || {};
      if (!currentPassword || !newPassword) return fail(res, 'Current and new password are required', 400);

      const result = await userService.changePassword(userId, currentPassword, newPassword);
      if (!result.success) return fail(res, result.message, result.status || 400);

      return ok(res, result.data || { message: 'Password updated successfully' });
    },

    delete: async (req, res) => {
      const userId = Number(req.params.user_id);
      const id = Number(req.user.id);

      // Authorization check
      const isMe = (userId == id)
      if (!isMe) return fail(res, 'Not authorized personnel', 403);
      
      const [count, row] = await userService.update(userId, { status: 'disabled' });
      if (!count) return fail(res, 'No update', 400);

      return ok(res, row);
    }
  };
};