const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

/**
 * Game API Usage
 *
 * GET /api/games
 *   - Purpose: List game servers/configurations with optional filtering and pagination.
 *   - Query: { status?: 'draft'|'open'|'closed', search?: string, page?: number, limit?: number }
 *   - Auth: Not required.
 *
 * GET /api/games/:game_id
 *   - Purpose: Fetch a single game record by id.
 *   - Path params: { game_id: number }
 *   - Auth: Not required.
 *
 * POST /api/games
 *   - Purpose: Create a new game server entry.
 *   - Body: { name: string, img_src?: string, port?: number, status?: 'draft'|'open'|'closed', description?: string }
 *   - Auth: Required.
 *
 * PUT /api/games/:game_id
 *   - Purpose: Update game metadata, including port and status.
 *   - Path params: { game_id: number }
 *   - Body: Same shape as POST with optional fields.
 *   - Auth: Required.
 *
 * DELETE /api/games/:game_id
 *   - Purpose: Remove a game record.
 *   - Path params: { game_id: number }
 *   - Auth: Required.
 */

module.exports = (deps) => {
  const ctrl = require('../controllers/game.controller')(deps);

  // Game listing endpoint with filtering and pagination.
  router.get('/', ctrl.listGames);
  // Game detail endpoint.
  router.get('/:game_id', ctrl.getGameById);

  // Authenticated creation of games.
  router.post('/', requireAuth, ctrl.createGame);
  // Authenticated updates for games.
  router.put('/:game_id', requireAuth, ctrl.updateGame);
  // Authenticated deletion of games.
  router.delete('/:game_id', requireAuth, ctrl.deleteGame);

  return router;
};
