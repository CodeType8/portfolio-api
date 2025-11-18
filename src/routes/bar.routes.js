const router = require('express').Router();
const requireAuth = require('../middlewares/auth');

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
