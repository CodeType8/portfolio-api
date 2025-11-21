const { ok, fail } = require('../utils/response');

// Manages user profile endpoints with shared validation and guard rails.
module.exports = (deps) => {
  const userService = require('../services/user.service')(deps);

  // Converts a route param to an integer or null when invalid.
  const parseUserId = (raw) => {
    const parsed = Number(raw);
    return Number.isInteger(parsed) ? parsed : null;
  };

  // Prevents cross-account access by ensuring the requester is acting on self.
  const enforceSelfAccess = (res, targetId, authenticatedId) => {
    const isAuthorized = targetId && authenticatedId && targetId === authenticatedId;
    if (!isAuthorized) {
      fail(res, 'Not authorized personnel', 403);
    }
    return isAuthorized;
  };

  // Guards against updating password-related fields in non-password endpoints.
  const hasForbiddenPasswordFields = (payload = {}) => {
    const forbiddenFields = ['password', 'password_hash', 'current_pw', 'new_pw'];
    return forbiddenFields.some((field) => Object.prototype.hasOwnProperty.call(payload, field));
  };

  return {
    // Retrieves a sanitized user profile by id.
    get: async (req, res) => {
      const userId = parseUserId(req.params.user_id);
      if (userId === null) return fail(res, 'Invalid user id', 400);

      const user = await userService.findUserById(userId);
      if (!user) return fail(res, 'User Not found', 404);

      return ok(res, user);
    },

    // Updates non-sensitive profile attributes for the authenticated user.
    update: async (req, res) => {
      const requestedId = parseUserId(req.params.user_id);
      const authenticatedId = parseUserId(req.user?.id);

      // Step 1: Confirm the caller is updating their own account.
      if (!enforceSelfAccess(res, requestedId, authenticatedId)) return;

      // Step 2: Reject attempts to change password fields via the generic update route.
      if (hasForbiddenPasswordFields(req.body)) {
        return fail(res, 'Password update is not allowed in this endpoint', 400);
      }

      // Step 3: Apply profile updates and return the changed row.
      const [count, rows] = await userService.update(requestedId, req.body);
      const updatedUser = Array.isArray(rows) ? rows[0] : rows;
      if (!count || !updatedUser) return fail(res, 'No update', 400);

      return ok(res, updatedUser);
    },

    // Changes the password after verifying ownership and current password.
    changePassword: async (req, res) => {
      const requestedId = parseUserId(req.params.user_id);
      const authenticatedId = parseUserId(req.user?.id);

      // Step 1: Ensure the caller is acting on their own account.
      if (!enforceSelfAccess(res, requestedId, authenticatedId)) return;

      // Step 2: Validate required password fields.
      const { current_pw: currentPassword, new_pw: newPassword } = req.body || {};
      if (!currentPassword || !newPassword) {
        return fail(res, 'Current and new password are required', 400);
      }

      // Step 3: Delegate to the service for verification and persistence.
      const result = await userService.changePassword(requestedId, currentPassword, newPassword);
      if (!result.success) return fail(res, result.message, result.status || 400);

      return ok(res, result.data || { message: 'Password updated successfully' });
    },

    // Soft-disables the authenticated user account.
    delete: async (req, res) => {
      const requestedId = parseUserId(req.params.user_id);
      const authenticatedId = parseUserId(req.user?.id);

      // Step 1: Require self-ownership to proceed with account disabling.
      if (!enforceSelfAccess(res, requestedId, authenticatedId)) return;

      // Step 2: Flag the account as disabled instead of hard-deleting.
      const [count, rows] = await userService.update(requestedId, { status: 'disabled' });
      const updatedUser = Array.isArray(rows) ? rows[0] : rows;
      if (!count || !updatedUser) return fail(res, 'No update', 400);

      return ok(res, updatedUser);
    },
  };
};