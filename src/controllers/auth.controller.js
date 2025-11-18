const { ok, fail } = require('../utils/response');

module.exports = (deps) => {
  const authService = require('../services/auth.service')(deps);
  const inviteService = require('../services/invite.service')(deps);
  const userService = require('../services/user.service')(deps);

  return {
    // =============== Basic Auth ================
    login: async (req, res) => {
      try {
        const { email, password, autoLogin } = req.body;
        const out = await authService.login({ email, password, autoLogin });
        if (!out) return fail(res, 'Invalid credentials', 401);


        // If you use httpOnly cookie
        if (req.config?.useCookieToken) {
          res.cookie('token', out.token, { httpOnly: true, sameSite: 'lax', secure: req.secure });
          return ok(res, { user: out.user });
        }
        return ok(res, out);
      } catch (e) {
        return fail(res, e.message, 400);
      }
    },

    logout: async (req, res) => {
      try {
        if (req.config?.useCookieToken) {
          res.clearCookie('token');
        }
        return ok(res, authService.logoutPayload());
      } catch (e) {
        return fail(res, e.message, 400);
      }
    },

    me: async (req, res) => {
      try {
        const data = await authService.me(req.user.id, req.user.autoLogin);
        if (!data) return fail(res, 'Not found', 404);
        return ok(res, data);
      } catch (e) {
        return fail(res, e.message, 400);
      }
    },


    // ================ Password =================
    //forgot password request
    forgotPassword: async (req, res) => {
      try {
        const { email } = req.body;
        const row = await authService.forgotPassword(email);
        return ok(res, { id: row.id }, 'Password reset token sent to email');
      } catch (e) {
        return fail(res, e.message, 400);
      }
    },

    // password reset token check
    checkResetPasswordToken: async (req, res) => {
      try {
        const out = await authService.checkResetPasswordToken(req.params.token);
        return ok(res, out, 'Token checking complete');
      } catch (e) {
        return fail(res, e.message, 400);
      }
    },

    // update password
    changePassword: async (req, res) => {
      try {
        const { token, password } = req.body;
        const row = await authService.changePassword({ token, password });
        return ok(res, { id: row.id }, 'Your password has been changed');
      } catch (e) {
        return fail(res, e.message, 400);
      }
    },


    // =============== invitation ================
    // Check invitation
    checkInvitation: async (req, res) => {
      try {
        const out = await inviteService.checkInvitation(req.params.token);
        return ok(res, out, 'Token checking complete');
      } catch (e) {
        return fail(res, e.message, 400);
      }
    },

    // Invite brand_admin / branch_manager
    inviteMember: async (req, res) => {
      try {
        const id = Number(req.user.id);
        const { email } = req.body;

        // Authorization check
        const user = await userService.findUserById(id);
        if (!user) return fail(res, 'Not authorized personnel', 404);

        const row = await inviteService.inviteMember({ email }, req.user.id);

        return ok(res, { id: row.id }, 'Invitation sent');
      } catch (e) {
        return fail(res, e.message, 400);
      }
    },

    // Accept member invite
    acceptMemberInvite: async (req, res) => {
      try {
        const { token, user } = req.body;
        const out = await inviteService.acceptMemberInvite({ token, userPayload: user });
        return ok(res, out, 'Account created');
      } catch (e) {
        return fail(res, e.message, 400);
      }
    },
  }
}