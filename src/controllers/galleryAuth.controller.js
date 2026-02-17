const { ok, fail } = require('../utils/response');

module.exports = (deps) => {
  const galleryAuthService = require('../services/galleryAuth.service')(deps);

  return {
    /**
     * Handle gallery password login and return JWT tokens for subsequent API authentication.
     */
    login: async (req, res) => {
      try {
        // Step 1: Pull request payload values from body.
        const { password, autoLogin } = req.body;

        // Step 2: Validate password and issue tokens.
        const out = await galleryAuthService.login({ password, autoLogin });

        // Step 3: Optionally set cookie token if global cookie-mode is enabled.
        if (req.config?.useCookieToken) {
          res.cookie('token', out.token.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: req.secure,
          });
          return ok(res, { payload: out.payload });
        }

        return ok(res, out);
      } catch (e) {
        const statusCode = e.message === 'Invalid gallery password' ? 401 : 400;
        return fail(res, e.message, statusCode);
      }
    },

    /**
     * Verify gallery authentication state and return refreshed tokens for periodic status checks.
     */
    status: async (req, res) => {
      try {
        // Step 1: Use decoded token payload from gallery auth middleware.
        const out = await galleryAuthService.status(req.user);
        return ok(res, out);
      } catch (e) {
        return fail(res, e.message, 400);
      }
    },
  };
};
