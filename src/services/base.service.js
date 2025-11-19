// Provides business logic and database access for bar bases.
const { buildListQueryOptions, buildPaginationOptions } = require('../utils/queryBuilder');

module.exports = ({ models }) => {
  const { Base } = models;

  // Retrieves a paginated list of bases with search and sort support.
  const listBases = async (query = {}) => {
    // Step 1: Resolve pagination values from the incoming query params.
    const { pagination, options: paginationOptions } = buildPaginationOptions(query);

    // Step 2: Build where/order clauses using the shared list query builder.
    const listOptions = buildListQueryOptions(query, {
      searchFields: ['name', 'description'],
      sortFields: {
        name: 'name',
        created_at: 'created_at',
        updated_at: 'updated_at',
      },
      defaultSort: { field: 'created_at', direction: 'DESC' },
    });

    // Step 3: Fetch rows and counts for pagination metadata.
    const result = await Base.findAndCountAll({
      ...listOptions,
      ...paginationOptions,
    });

    // Step 4: Return both result rows and pagination meta input.
    return { result, pagination };
  };

  // Loads a single base entry by id.
  const getBaseById = (id) => Base.findByPk(id);

  // Persists a new base row.
  const createBase = (payload) => Base.create(payload);

  // Updates an existing base when present; otherwise returns null.
  const updateBase = async (id, payload) => {
    // Step 1: Locate the base record by primary key.
    const base = await Base.findByPk(id);
    if (!base) return null;

    // Step 2: Apply incoming changes and persist.
    await base.update(payload);
    return base;
  };

  // Removes a base and returns deletion status.
  const deleteBase = async (id) => {
    // Step 1: Confirm the record exists before attempting deletion.
    const base = await Base.findByPk(id);
    if (!base) return false;

    // Step 2: Destroy the row once verified.
    await base.destroy();
    return true;
  };

  return {
    listBases,
    getBaseById,
    createBase,
    updateBase,
    deleteBase,
  };
};
