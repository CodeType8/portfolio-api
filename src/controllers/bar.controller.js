const { ok, fail, paginatedOk } = require('../utils/response');

// Coordinates HTTP flows for bar recipe management.
module.exports = (deps) => {
  const barService = require('../services/bar.service')(deps);

  // Safely converts incoming string values into integers when possible.
  const toInteger = (value) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
  };

  // Provides a normalized integer or undefined for payload composition.
  const normalizeInteger = (value) => {
    const parsed = toInteger(value);
    return parsed === null ? undefined : parsed;
  };

  // Safely converts incoming string values into booleans when possible.
  const toBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value !== 'string') return null;
    const lowered = value.toLowerCase();
    if (lowered === 'true') return true;
    if (lowered === 'false') return false;
    return null;
  };

  // Provides a normalized boolean or undefined for payload composition.
  const normalizeBoolean = (value) => {
    const parsed = toBoolean(value);
    return parsed === null ? undefined : parsed;
  };

  // Returns a paginated list of recipes with filter, search, and sort support.
  const listRecipes = async (req, res) => {
    try {
      // Step 1: Delegate to the service which handles query utility composition.
      const { result, pagination } = await barService.listRecipes(req.query);

      // Step 2: Send paginated response with computed meta data.
      return paginatedOk(res, result, pagination, 'Recipes retrieved');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Loads a single recipe by id.
  const getRecipeById = async (req, res) => {
    try {
      // Step 1: Normalize the recipe identifier from the route parameter.
      const recipeId = toInteger(req.params.recipe_id);
      if (!recipeId) return fail(res, 'Invalid recipe id', 400);

      // Step 2: Retrieve the recipe including its base.
      const recipe = await barService.getRecipeById(recipeId);
      if (!recipe) return fail(res, 'Recipe not found', 404);
      return ok(res, recipe);
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Creates a new recipe entry.
  const createRecipe = async (req, res) => {
    try {
      // Step 1: Build a normalized payload from the incoming body values.
      const payload = {
        base_id: normalizeInteger(req.body.base_id),
        name: req.body.name,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        glass_type: req.body.glass_type,
        garnish: req.body.garnish,
        is_alcoholic: normalizeBoolean(req.body.is_alcoholic),
        prep_time_minutes: normalizeInteger(req.body.prep_time_minutes),
        abv: req.body.abv,
      };

      // Step 1a: Validate required fields before touching the database.
      if (!payload.name || typeof payload.name !== 'string') {
        return fail(res, 'Recipe name is required', 400);
      }
      if (payload.base_id === undefined) {
        return fail(res, 'Base id is required', 400);
      }

      // Step 2: Create and return the recipe using the service layer.
      const recipe = await barService.createRecipe(payload);
      return ok(res, recipe, 'Recipe created');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Updates an existing recipe entry.
  const updateRecipe = async (req, res) => {
    try {
      // Step 1: Normalize ids and incoming data for update.
      const recipeId = toInteger(req.params.recipe_id);
      if (!recipeId) return fail(res, 'Invalid recipe id', 400);

      const payload = {
        base_id: normalizeInteger(req.body.base_id),
        name: req.body.name,
        description: req.body.description,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        glass_type: req.body.glass_type,
        garnish: req.body.garnish,
        is_alcoholic: normalizeBoolean(req.body.is_alcoholic),
        prep_time_minutes: normalizeInteger(req.body.prep_time_minutes),
        abv: req.body.abv,
      };

      // Step 2: Persist the updated recipe via the service.
      const recipe = await barService.updateRecipe(recipeId, payload);
      if (!recipe) return fail(res, 'Recipe not found', 404);
      return ok(res, recipe, 'Recipe updated');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Deletes a recipe record.
  const deleteRecipe = async (req, res) => {
    try {
      // Step 1: Validate the recipe id parameter.
      const recipeId = toInteger(req.params.recipe_id);
      if (!recipeId) return fail(res, 'Invalid recipe id', 400);

      // Step 2: Attempt removal and reflect success status.
      const deleted = await barService.deleteRecipe(recipeId);
      if (!deleted) return fail(res, 'Recipe not found', 404);
      return ok(res, {}, 'Recipe deleted');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  return {
    listRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
};
