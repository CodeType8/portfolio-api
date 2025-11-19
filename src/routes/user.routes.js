const router = require('express').Router();
const requireAuth = require('../middlewares/auth');
/**
 * User API Usage
 *
 * GET /api/users/:user_id
 *   - Purpose: Retrieve a single user profile by id.
 *   - Path params: { user_id: number }
 *   - Auth: Required; caller must be authenticated.
 *
 * PUT /api/users/update/:user_id
 *   - Purpose: Update profile attributes for the specified user.
 *   - Path params: { user_id: number }
 *   - Body: { first_name?: string, last_name?: string, email?: string, status?: 'invited'|'verified'|'disabled', phone_number?: string }
 *   - Auth: Required; typically the owner or an admin.
 *
 * PUT /api/users/password/:user_id
 *   - Purpose: Change the password after validating the current one.
 *   - Path params: { user_id: number }
 *   - Body: { current_pw: string, new_pw: string }
 *   - Auth: Required; caller must be the account owner.
 *
 * PUT /api/users/:user_id
 *   - Purpose: Soft-delete or disable a user account within a brand/branch context.
 *   - Path params: { user_id: number }
 *   - Body: { status?: 'disabled', brand_id?: number, branch_id?: number }
 *   - Auth: Required; generally restricted to admins.
 */

module.exports = (deps) => {
  // Load the user controller containing membership management logic.
  const ctrl = require('../controllers/user.controller')(deps);
  const settingCtrl = require('../controllers/userSetting.controller')(deps);

  // Retrieve a single user profile by identifier.
  router.get('/:user_id', requireAuth, ctrl.get);
  // Allow a user to update their own account details.
  router.put('/update/:user_id', requireAuth, ctrl.update);
  // Allow a user to update their password securely.
  router.put('/password/:user_id', requireAuth, ctrl.changePassword);
  // Disable a user's branch assignment (requires additional brand/branch parameters).
  router.put('/:user_id', requireAuth, ctrl.delete);

  return router;
};