const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

/**
 * Base API Usage
 *
 * GET /api/bases
 *   - Purpose: List all base spirits with optional pagination or search.
 *   - Query: { search?: string, page?: number, limit?: number }
 *   - Auth: Not required.
 *
 * GET /api/bases/:base_id
 *   - Purpose: Fetch a single base by id.
 *   - Path params: { base_id: number }
 *   - Auth: Not required.
 *
 * POST /api/bases
 *   - Purpose: Create a new base spirit entry.
 *   - Body: { name: string, description?: string }
 *   - Auth: Required.
 *
 * PUT /api/bases/:base_id
 *   - Purpose: Update the name/description of a base.
 *   - Path params: { base_id: number }
 *   - Body: { name?: string, description?: string }
 *   - Auth: Required.
 *
 * DELETE /api/bases/:base_id
 *   - Purpose: Delete a base; related recipes should be handled in controllers/services.
 *   - Path params: { base_id: number }
 *   - Auth: Required.
 */

module.exports = (deps) => {
  const ctrl = require('../controllers/base.controller')(deps);

  // Base listing endpoint with search and pagination.
  router.get('/', ctrl.listBases);
  // Base detail endpoint.
  router.get('/:base_id', ctrl.getBaseById);

  // Authenticated creation of new bases.
  router.post('/', requireAuth, ctrl.createBase);
  // Authenticated update of existing bases.
  router.put('/:base_id', requireAuth, ctrl.updateBase);
  // Authenticated deletion of bases.
  router.delete('/:base_id', requireAuth, ctrl.deleteBase);

  return router;
};
