const router = require('express').Router();
const requireAuth = require('../middlewares/auth');
/**
 * Auth API Usage
 *
 * POST /api/auth/login
 *   - Purpose: Authenticate a user and start a session.
 *   - Body: { email: string, password: string, autoLogin?: boolean }
 *   - Auth: Not required; returns a token/cookie for subsequent requests.
 *
 * GET /api/auth/logout
 *   - Purpose: Destroy the active session/token.
 *   - Auth: Required via cookie or Authorization header.
 *
 * GET /api/auth/me
 *   - Purpose: Fetch the profile of the currently authenticated user.
 *   - Auth: Required; returns user metadata if the token is valid.
 *
 * POST /api/auth/forgot-password
 *   - Purpose: Start password recovery by emailing a reset token.
 *   - Body: { email: string }
 *   - Auth: Not required.
 *
 * GET /api/auth/check-forgot-password-token/:token
 *   - Purpose: Validate whether a reset token is still usable.
 *   - Path params: { token: string }
 *   - Auth: Not required.
 *
 * POST /api/auth/change-password
 *   - Purpose: Set a new password using a valid reset token.
 *   - Body: { token: string, password: string }
 *   - Auth: Not required; token is validated server-side.
 *
 * GET /api/auth/check-invitation/:token
 *   - Purpose: Confirm that an invitation token is valid and not expired.
 *   - Path params: { token: string }
 *   - Auth: Not required.
 *
 * POST /api/auth/invite-member
 *   - Purpose: Create a new invitation for another user.
 *   - Body: { email: string }
 *   - Auth: Required; only authenticated users may invite.
 *
 * POST /api/auth/accept-invitation
 *   - Purpose: Complete onboarding for an invited user.
 *   - Body: { token: string, user: object }
 *   - Auth: Not required; token is validated server-side.
 */

module.exports = (deps) => {
  // Initialize the auth controller with shared dependencies.
  const ctrl = require('../controllers/auth.controller')(deps);

  /*=============================================
  ||=============== Basic Auth ================||
  =============================================*/
  // Handle user login with email, password, and optional autoLogin flag.
  router.post('/login', ctrl.login);
  // End the current authenticated session.
  router.get('/logout', ctrl.logout);
  // Retrieve profile information for the authenticated user.
  router.get('/me', requireAuth, ctrl.me);

  /*=============================================
  ||================ Password =================||
  =============================================*/
  // Start the password reset process by sending a reset token.
  router.post('/forgot-password', ctrl.forgotPassword);
  // Validate a reset token that was issued for password recovery.
  router.get('/check-forgot-password-token/:token', ctrl.checkResetPasswordToken);
  // Change the password using a valid reset token.
  router.post('/change-password', ctrl.changePassword);

  /*=============================================
  ||=============== invitation ================||
  =============================================*/
  // Confirm that an invitation token is valid and active.
  router.get('/check-invitation/:token', ctrl.checkInvitation);
  // Invite a new member to the organization with role and scope details.
  router.post('/invite-member', requireAuth, ctrl.inviteMember);
  // Accept a member invitation with the desired user profile.
  router.post('/accept-invitation', ctrl.acceptMemberInvite);

  return router;
};