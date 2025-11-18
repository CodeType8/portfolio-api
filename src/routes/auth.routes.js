const router = require('express').Router();
const requireAuth = require('../middlewares/auth');
/**
 * API Instructions
 * 
 * Endpoint: POST /api/auth/login
 *   Method: POST
 *   Body: { email: string, password: string, autoLogin?: boolean }
 *   Params: none
 * 
 * Endpoint: GET /api/auth/logout
 *   Method: GET
 *   Body: none
 *   Params: none
 * 
 * Endpoint: GET /api/auth/me
 *   Method: GET
 *   Body: none
 *   Params: none
 * 
 * Endpoint: POST /api/auth/forgot-password
 *   Method: POST
 *   Body: { email: string }
 *   Params: none
 * 
 * Endpoint: GET /api/auth/check-forgot-password-token/:token
 *   Method: GET
 *   Body: none
 *   Params: { token: string }
 * 
 * Endpoint: POST /api/auth/change-password
 *   Method: POST
 *   Body: { token: string, password: string }
 *   Params: none
 * 
 * Endpoint: GET /api/auth/check-invitation/:token
 *   Method: GET
 *   Body: none
 *   Params: { token: string }
 * 
 * Endpoint: POST /api/auth/invite-member
 *   Method: POST
 *   Body: { email: string }
 *   Params: none
 * 
 * Endpoint: POST /api/auth/accept-invitation
 *   Method: POST
 *   Body: { token: string, user: object }
 *   Params: none
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