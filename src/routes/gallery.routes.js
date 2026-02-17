const router = require('express').Router();
const requireGalleryAuth = require('../middlewares/galleryAuth');

module.exports = (deps) => {
  // Initialize gallery auth controller with shared app dependencies.
  const ctrl = require('../controllers/galleryAuth.controller')(deps);

  /**
   * POST /api/gallery/login
   * - Purpose: Authenticate with gallery password and issue JWT tokens.
   * - Auth: Public.
   * - Body: { password, autoLogin?: boolean }
   */
  router.post('/login', ctrl.login);

  /**
   * GET /api/gallery/status
   * - Purpose: Verify gallery authentication and return refreshed JWT tokens.
   * - Auth: Requires gallery-scoped bearer token.
   */
  router.get('/status', requireGalleryAuth, ctrl.status);

  return router;
};
