// Provides business logic and data persistence helpers for games.
const { buildListQueryOptions, buildPaginationOptions } = require('../utils/queryBuilder');

module.exports = ({ models }) => {
  const { Game } = models;

  // Lists games with filtering, search, and pagination support.
  const listGames = async (query = {}) => {
    // Step 1: Parse pagination details from the query string.
    const { pagination, options: paginationOptions } = buildPaginationOptions(query);

    // Step 2: Compose where/order clauses leveraging shared utilities.
    const listOptions = buildListQueryOptions(query, {
      filterFields: {
        status: {
          field: 'status',
          transform: (value) => {
            const allowed = ['draft', 'open', 'closed'];
            const normalized = typeof value === 'string' ? value.toLowerCase() : value;
            return allowed.includes(normalized) ? normalized : null;
          },
        },
        port: {
          field: 'port',
          transform: (value) => {
            const parsed = Number(value);
            return Number.isInteger(parsed) ? parsed : null;
          },
        },
      },
      searchFields: ['name', 'description'],
      sortFields: {
        name: 'name',
        created_at: 'created_at',
        updated_at: 'updated_at',
        port: 'port',
        status: 'status',
      },
      defaultSort: { field: 'created_at', direction: 'DESC' },
    });

    // Step 3: Fetch rows with count for pagination meta generation.
    const result = await Game.findAndCountAll({
      ...listOptions,
      ...paginationOptions,
    });

    // Step 4: Return results and pagination inputs to the controller layer.
    return { result, pagination };
  };

  // Fetches a single game by id.
  const getGameById = (id) => Game.findByPk(id);

  // Creates a new game row.
  const createGame = (payload) => Game.create(payload);

  // Updates an existing game when found; returns null otherwise.
  const updateGame = async (id, payload) => {
    // Step 1: Look up the game by primary key.
    const game = await Game.findByPk(id);
    if (!game) return null;

    // Step 2: Apply updates and persist.
    await game.update(payload);
    return game;
  };

  // Deletes a game record and signals success status.
  const deleteGame = async (id) => {
    // Step 1: Ensure the target game exists before deleting.
    const game = await Game.findByPk(id);
    if (!game) return false;

    // Step 2: Remove the game record from the database.
    await game.destroy();
    return true;
  };

  return {
    listGames,
    getGameById,
    createGame,
    updateGame,
    deleteGame,
  };
};
