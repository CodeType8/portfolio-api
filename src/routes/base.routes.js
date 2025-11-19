const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

/**
 * Register base taxonomy endpoints with concise integration notes.
 */
module.exports = (deps) => {
  // Prepare the base controller for CRUD interactions.
  const ctrl = require('../controllers/base.controller')(deps);

  /**
   * GET /api/base
   * - Purpose: Retrieve a paginated list of spirit bases.
   * - Auth: Public.
   * - Query: q (search by name), page, limit, sort (e.g., name).
   */
  router.get('/', ctrl.listBases);

  /**
   * GET /api/base/:base_id
   * - Purpose: Fetch a specific base with its metadata.
   * - Auth: Public.
   * - Params: { base_id }
   */
  router.get('/:base_id', ctrl.getBaseById);

  /**
   * POST /api/base
   * - Purpose: Create a new base (e.g., Mezcal) for recipe classification.
   * - Auth: Protected.
   * - Body: { name, description? }
   */
  router.post('/', requireAuth, ctrl.createBase);

  /**
   * PUT /api/base/:base_id
   * - Purpose: Update the label or description of an existing base.
   * - Auth: Protected.
   * - Params: { base_id }
   * - Body: Partial base payload.
   */
  router.put('/:base_id', requireAuth, ctrl.updateBase);

  /**
   * DELETE /api/base/:base_id
   * - Purpose: Remove a base and cascade delete associated recipes.
   * - Auth: Protected.
   * - Params: { base_id }
   */
  router.delete('/:base_id', requireAuth, ctrl.deleteBase);

  return router;
};
