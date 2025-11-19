const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

/**
 * Wire bar/recipe endpoints with clear usage guidance for consumers.
 * Notes: all recipe endpoints live under /api/bar and may accept query
 * options for pagination (page, limit), searching (q), and sorting (sort).
 */
module.exports = (deps) => {
  // Load the bar controller responsible for CRUD and discovery operations.
  const ctrl = require('../controllers/bar.controller')(deps);

  /**
   * GET /api/bar/recipes
   * - Purpose: Fetch paginated recipes with optional search, filter, and sort.
   * - Auth: Public.
   * - Query: q (text search), base_id, is_alcoholic, page, limit, sort (-created_at).
   * - Response: { rows: Recipe[], count } with associated Base eager loaded.
   */
  router.get('/recipes', ctrl.listRecipes);

  /**
   * GET /api/bar/recipes/:recipe_id
   * - Purpose: Retrieve a single recipe including ingredients and directions.
   * - Auth: Public.
   * - Params: { recipe_id }
   */
  router.get('/recipes/:recipe_id', ctrl.getRecipeById);

  /**
   * POST /api/bar/recipes
   * - Purpose: Create a new cocktail / mocktail recipe tied to a base spirit.
   * - Auth: Protected; requires bearer token/session.
   * - Body: { base_id, name, description?, ingredients, instructions, glass_type?, garnish?, is_alcoholic?, abv? }
   * - Response: Newly created recipe row with timestamps.
   */
  router.post('/recipes', requireAuth, ctrl.createRecipe);

  /**
   * PUT /api/bar/recipes/:recipe_id
   * - Purpose: Update recipe metadata, ingredient list, or instructions.
   * - Auth: Protected.
   * - Params: { recipe_id }
   * - Body: Partial recipe payload to modify any mutable field.
   */
  router.put('/recipes/:recipe_id', requireAuth, ctrl.updateRecipe);

  /**
   * DELETE /api/bar/recipes/:recipe_id
   * - Purpose: Permanently remove a recipe and related menu associations.
   * - Auth: Protected.
   * - Params: { recipe_id }
   */
  router.delete('/recipes/:recipe_id', requireAuth, ctrl.deleteRecipe);

  return router;
};
