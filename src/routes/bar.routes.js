const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

/**
 * Bar Recipe API Usage
 *
 * GET /api/bar/recipes
 *   - Purpose: List recipes with optional filters (base_id, is_alcoholic) and pagination.
 *   - Query: { base_id?: number, is_alcoholic?: boolean, search?: string, page?: number, limit?: number }
 *   - Auth: Not required.
 *
 * GET /api/bar/recipes/:recipe_id
 *   - Purpose: Retrieve a single recipe by id.
 *   - Path params: { recipe_id: number }
 *   - Auth: Not required.
 *
 * POST /api/bar/recipes
 *   - Purpose: Create a new recipe tied to an existing base.
 *   - Body: { base_id: number, name: string, description?: string, ingredients?: string, instructions?: string, glass_type?: string, garnish?: string, is_alcoholic?: boolean, abv?: number }
 *   - Auth: Required; only authenticated users can create recipes.
 *
 * PUT /api/bar/recipes/:recipe_id
 *   - Purpose: Update a recipe's metadata or composition.
 *   - Path params: { recipe_id: number }
 *   - Body: Same shape as POST but all fields optional.
 *   - Auth: Required.
 *
 * DELETE /api/bar/recipes/:recipe_id
 *   - Purpose: Permanently delete a recipe.
 *   - Path params: { recipe_id: number }
 *   - Auth: Required.
 */

module.exports = (deps) => {
  const ctrl = require('../controllers/bar.controller')(deps);

  // Recipe listing with query-powered search/filter/sort.
  router.get('/recipes', ctrl.listRecipes);
  // Recipe detail endpoint.
  router.get('/recipes/:recipe_id', ctrl.getRecipeById);

  // Authenticated creation of new recipes.
  router.post('/recipes', requireAuth, ctrl.createRecipe);
  // Authenticated update of existing recipes.
  router.put('/recipes/:recipe_id', requireAuth, ctrl.updateRecipe);
  // Authenticated deletion of recipes.
  router.delete('/recipes/:recipe_id', requireAuth, ctrl.deleteRecipe);

  return router;
};
