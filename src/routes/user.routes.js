const router = require('express').Router();
const requireAuth = require('../middlewares/auth');
/**
 * API Instructions
 * 
 * Endpoint: GET /api/users/:user_id
 *   Method: GET
 *   Body: none
 *   Params: { user_id: number }
 * 
 * Endpoint: PUT /api/users/update/:user_id
 *   Method: PUT
 *   Body: { first_name?: string, last_name?: string, email?: string, status?: string, ... }
 *   Params: { user_id: number }
 *
 * Endpoint: PUT /api/users/password/:user_id
 *   Method: PUT
 *   Body: { current_pw: string, new_pw: string }
 *   Params: { user_id: number }
 * 
 * Endpoint: PUT /api/users/:user_id
 *   Method: PUT
 *   Body: { status?: string }
 *   Params: { user_id: number }
 * 
 * Notes: The delete handler additionally expects brand_id and branch_id parameters to authorize the request when disabling a user role.
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