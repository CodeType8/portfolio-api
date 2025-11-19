const { ok, fail, paginatedOk } = require('../utils/response');

// Manages HTTP endpoints for game resources.
module.exports = (deps) => {
  const gameService = require('../services/game.service')(deps);

  // Converts input values to integers when possible.
  const toInteger = (value) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
  };

  // Validates and normalizes an incoming status string.
  const normalizeStatus = (status) => {
    if (typeof status !== 'string') return null;
    const normalized = status.toLowerCase();
    const allowed = ['draft', 'open', 'closed'];
    return allowed.includes(normalized) ? normalized : null;
  };

  // Lists games with filter, search, and pagination.
  const listGames = async (req, res) => {
    try {
      // Step 1: Delegate query handling and data retrieval to service layer.
      const { result, pagination } = await gameService.listGames(req.query);

      // Step 2: Send paginated payload with meta.
      return paginatedOk(res, result, pagination, 'Games retrieved');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Retrieves a single game by id.
  const getGameById = async (req, res) => {
    try {
      // Step 1: Normalize path param.
      const gameId = toInteger(req.params.game_id);
      if (!gameId) return fail(res, 'Invalid game id', 400);

      // Step 2: Fetch game record.
      const game = await gameService.getGameById(gameId);
      if (!game) return fail(res, 'Game not found', 404);

      return ok(res, game);
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Creates a new game entry.
  const createGame = async (req, res) => {
    try {
      // Step 1: Build payload from request body.
      const payload = {
        name: req.body.name,
        img_src: req.body.img_src,
        port: toInteger(req.body.port),
        status: normalizeStatus(req.body.status) ?? undefined,
        description: req.body.description,
      };

      // Step 2: Validate required and formatted fields.
      if (!payload.name || typeof payload.name !== 'string') {
        return fail(res, 'Game name is required', 400);
      }
      if (req.body.port !== undefined && payload.port === null) {
        return fail(res, 'Port must be an integer', 400);
      }
      if (req.body.status !== undefined && payload.status === null) {
        return fail(res, 'Status must be one of draft, open, or closed', 400);
      }

      // Step 3: Persist the new game via the service layer.
      const game = await gameService.createGame(payload);
      return ok(res, game, 'Game created');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Updates an existing game entry.
  const updateGame = async (req, res) => {
    try {
      // Step 1: Normalize the game id parameter.
      const gameId = toInteger(req.params.game_id);
      if (!gameId) return fail(res, 'Invalid game id', 400);

      // Step 2: Compose payload from request body values.
      const payload = {
        name: req.body.name,
        img_src: req.body.img_src,
        port: req.body.port === undefined ? undefined : toInteger(req.body.port),
        status: req.body.status === undefined ? undefined : normalizeStatus(req.body.status),
        description: req.body.description,
      };

      // Step 3: Validate incoming data where necessary.
      if (payload.name !== undefined && (typeof payload.name !== 'string' || !payload.name)) {
        return fail(res, 'Game name must be a non-empty string', 400);
      }
      if (payload.port === null) {
        return fail(res, 'Port must be an integer', 400);
      }
      if (payload.status === null) {
        return fail(res, 'Status must be one of draft, open, or closed', 400);
      }

      // Step 4: Persist updates using the service layer.
      const game = await gameService.updateGame(gameId, payload);
      if (!game) return fail(res, 'Game not found', 404);

      return ok(res, game, 'Game updated');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Deletes a game entry.
  const deleteGame = async (req, res) => {
    try {
      // Step 1: Validate identifier parameter.
      const gameId = toInteger(req.params.game_id);
      if (!gameId) return fail(res, 'Invalid game id', 400);

      // Step 2: Delegate removal to service layer.
      const deleted = await gameService.deleteGame(gameId);
      if (!deleted) return fail(res, 'Game not found', 404);

      return ok(res, {}, 'Game deleted');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  return {
    listGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
  };
};
