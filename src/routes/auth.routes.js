const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

/**
 * Configure auth-related API endpoints.
 * Each route description details the HTTP method, authentication requirements,
 * the expected request shape, and the key behavior to help clients integrate.
 */

module.exports = (deps) => {
  // Initialize the auth controller with shared dependencies.
  const ctrl = require('../controllers/auth.controller')(deps);

  /*=============================================
  ||=============== Basic Auth ================||
  =============================================*/
  /**
   * POST /api/auth/login
   * - Purpose: Authenticate a user with email/password and issue session + JWT.
   * - Auth: Public; sets auth cookie/session on success.
   * - Body: { email, password, autoLogin?: boolean }
   * - Response: { user, token } with refresh token cookie when autoLogin is true.
   */
  router.post('/login', ctrl.login);
  /**
   * GET /api/auth/logout
   * - Purpose: Destroy the active session/token pair for the caller.
   * - Auth: Requires existing session cookie or bearer token.
   * - Body: none; call directly to invalidate credentials.
   */
  router.get('/logout', ctrl.logout);
  /**
   * GET /api/auth/me
   * - Purpose: Return the profile object for the authenticated user.
   * - Auth: Bearer token or session cookie required.
   * - Body/Params: none; relies solely on the authenticated context.
   */
  router.get('/me', requireAuth, ctrl.me);

  /*=============================================
  ||================ Password =================||
  =============================================*/
  /**
   * POST /api/auth/forgot-password
   * - Purpose: Generate a reset token and email instructions to the user.
   * - Auth: Public.
   * - Body: { email }
   * - Response: 200 acknowledgement; token emailed if account exists.
   */
  router.post('/forgot-password', ctrl.forgotPassword);
  /**
   * GET /api/auth/check-forgot-password-token/:token
   * - Purpose: Validate password reset token status before accepting a new password.
   * - Auth: Public; token is passed as a URL param.
   * - Params: { token }
   */
  router.get('/check-forgot-password-token/:token', ctrl.checkResetPasswordToken);
  /**
   * POST /api/auth/change-password
   * - Purpose: Persist a new password using a previously validated reset token.
   * - Auth: Public; guarded by token validation.
   * - Body: { token, password }
   * - Response: Confirmation of password change; session can be created afterwards.
   */
  router.post('/change-password', ctrl.changePassword);

  /*=============================================
  ||=============== invitation ================||
  =============================================*/
  /**
   * GET /api/auth/check-invitation/:token
   * - Purpose: Inspect invitation token validity and fetch invite metadata.
   * - Auth: Public; token provided via URL param.
   * - Params: { token }
   */
  router.get('/check-invitation/:token', ctrl.checkInvitation);
  /**
   * POST /api/auth/invite-member
   * - Purpose: Send an invitation email to a new team member.
   * - Auth: Protected; caller must be authenticated.
   * - Body: { email }
   * - Response: Invitation token details for audit/logging.
   */
  router.post('/invite-member', requireAuth, ctrl.inviteMember);
  /**
   * POST /api/auth/accept-invitation
   * - Purpose: Finalize account creation using a valid invitation token.
   * - Auth: Public; controlled via invitation token in the body.
   * - Body: { token, user: { first_name, last_name, password, ... } }
   * - Response: Created user profile plus session token.
   */
  router.post('/accept-invitation', ctrl.acceptMemberInvite);

  return router;
};