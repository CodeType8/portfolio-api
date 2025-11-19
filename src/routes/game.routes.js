const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

/**
 * Define game server CRUD endpoints with explicit client usage instructions.
 */
module.exports = (deps) => {
  // Load controller that encapsulates game persistence logic.
  const ctrl = require('../controllers/game.controller')(deps);

  /**
   * GET /api/games
   * - Purpose: List game servers with optional status/name filters.
   * - Auth: Public.
   * - Query: q (search by name), status (draft|open|closed), page, limit.
   */
  router.get('/', ctrl.listGames);

  /**
   * GET /api/games/:game_id
   * - Purpose: Retrieve metadata for a specific game server entry.
   * - Auth: Public.
   * - Params: { game_id }
   */
  router.get('/:game_id', ctrl.getGameById);

  /**
   * POST /api/games
   * - Purpose: Register a new hosted game configuration.
   * - Auth: Protected.
   * - Body: { name, img_src?, port?, status?, description? }
   */
  router.post('/', requireAuth, ctrl.createGame);

  /**
   * PUT /api/games/:game_id
   * - Purpose: Update server ports, images, or status lifecycle states.
   * - Auth: Protected.
   * - Params: { game_id }
   * - Body: Partial game payload.
   */
  router.put('/:game_id', requireAuth, ctrl.updateGame);

  /**
   * DELETE /api/games/:game_id
   * - Purpose: Remove a game server entry from listings.
   * - Auth: Protected.
   * - Params: { game_id }
   */
  router.delete('/:game_id', requireAuth, ctrl.deleteGame);

  return router;
};
