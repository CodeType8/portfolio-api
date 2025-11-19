const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

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
