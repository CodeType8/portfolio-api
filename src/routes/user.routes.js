const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

/**
 * User profile endpoints documenting access patterns for API consumers.
 */
module.exports = (deps) => {
  // Load the user controller containing membership management logic.
  const ctrl = require('../controllers/user.controller')(deps);

  /**
   * GET /api/users/:user_id
   * - Purpose: Fetch a single user's profile by id.
   * - Auth: Protected.
   * - Params: { user_id }
   */
  router.get('/:user_id', requireAuth, ctrl.get);

  /**
   * PUT /api/users/update/:user_id
   * - Purpose: Update account details (name, email, phone, status) for the user.
   * - Auth: Protected; should typically be self-update.
   * - Body: { first_name?, last_name?, email?, phone_number?, status? }
   */
  router.put('/update/:user_id', requireAuth, ctrl.update);

  /**
   * PUT /api/users/password/:user_id
   * - Purpose: Change the user's password with verification of the current password.
   * - Auth: Protected.
   * - Body: { current_pw, new_pw }
   */
  router.put('/password/:user_id', requireAuth, ctrl.changePassword);

  /**
   * PUT /api/users/:user_id
   * - Purpose: Soft-disable a user by updating their status/role associations.
   * - Auth: Protected.
   * - Params: { user_id }
   * - Additional: May require brand_id/branch_id depending on business rules.
   */
  router.put('/:user_id', requireAuth, ctrl.delete);

  return router;
};