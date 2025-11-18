// Provides business logic and data access helpers for bar menu recipes.
const { buildListQueryOptions, buildPaginationOptions } = require('../utils/queryBuilder');

module.exports = ({ models }) => {
  const { Recipe, Category } = models;

  // Normalizes boolean-like inputs coming from query parameters.
  const parseBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value !== 'string') return null;
    const lowered = value.toLowerCase();
    if (lowered === 'true') return true;
    if (lowered === 'false') return false;
    return null;
  };

  // Lists recipes with filtering, searching, sorting, and pagination support.
  const listRecipes = async (query = {}) => {
    // Step 1: Derive pagination settings from the incoming query string.
    const { pagination, options: paginationOptions } = buildPaginationOptions(query);

    // Step 2: Build a dynamic where/order clause using shared query utilities.
    const listOptions = buildListQueryOptions(query, {
      filterFields: {
        category_id: { field: 'category_id', transform: (val) => {
          const parsed = Number(val);
          return Number.isInteger(parsed) ? parsed : null;
        } },
        glass_type: { field: 'glass_type' },
        is_alcoholic: { field: 'is_alcoholic', transform: parseBoolean },
      },
      searchFields: ['name', 'description', 'ingredients', 'instructions', 'garnish', 'glass_type'],
      sortFields: {
        name: 'name',
        created_at: 'created_at',
        updated_at: 'updated_at',
        prep_time: 'prep_time_minutes',
        abv: 'abv',
      },
      defaultSort: { field: 'created_at', direction: 'DESC' },
    });

    // Step 3: Fetch recipe rows alongside their categories with count for pagination.
    const result = await Recipe.findAndCountAll({
      ...listOptions,
      ...paginationOptions,
      include: [{ model: Category, attributes: ['id', 'name'] }],
    });

    // Step 4: Return both the raw query result and the computed pagination meta input.
    return { result, pagination };
  };

  // Retrieves a single recipe with its category relation hydrated.
  const getRecipeById = (id) => Recipe.findOne({
    where: { id },
    include: [{ model: Category, attributes: ['id', 'name'] }],
  });

  // Persists a brand-new recipe row using the provided payload values.
  const createRecipe = (payload) => Recipe.create(payload);

  // Updates an existing recipe when it exists; returns null when not found.
  const updateRecipe = async (id, payload) => {
    // Step 1: Load the target recipe by primary key.
    const recipe = await Recipe.findByPk(id);
    if (!recipe) return null;

    // Step 2: Apply incoming changes and persist them.
    await recipe.update(payload);
    return recipe;
  };

  // Removes a recipe and returns a boolean indicating deletion success.
  const deleteRecipe = async (id) => {
    // Step 1: Locate the recipe row to ensure it exists before deletion.
    const recipe = await Recipe.findByPk(id);
    if (!recipe) return false;

    // Step 2: Destroy the record now that it has been confirmed.
    await recipe.destroy();
    return true;
  };

  return {
    listRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
  };
};
