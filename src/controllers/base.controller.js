const { ok, fail, paginatedOk } = require('../utils/response');

// Coordinates HTTP flows for base taxonomy management.
module.exports = (deps) => {
  const baseService = require('../services/base.service')(deps);

  // Converts incoming values into safe integers when possible.
  const toInteger = (value) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : null;
  };

  // Provides a base listing with pagination, search, and sort support.
  const listBases = async (req, res) => {
    try {
      // Step 1: Delegate query parsing and data retrieval to the service layer.
      const { result, pagination } = await baseService.listBases(req.query);

      // Step 2: Return paginated response with computed metadata.
      return paginatedOk(res, result, pagination, 'Bases retrieved');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Fetches a single base by id.
  const getBaseById = async (req, res) => {
    try {
      // Step 1: Normalize the route parameter and validate.
      const baseId = toInteger(req.params.base_id);
      if (!baseId) return fail(res, 'Invalid base id', 400);

      // Step 2: Retrieve the base record.
      const base = await baseService.getBaseById(baseId);
      if (!base) return fail(res, 'Base not found', 404);

      return ok(res, base);
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Creates a new base.
  const createBase = async (req, res) => {
    try {
      // Step 1: Build payload from request body.
      const payload = {
        name: req.body.name,
        description: req.body.description,
      };

      // Step 2: Validate required fields.
      if (!payload.name || typeof payload.name !== 'string') {
        return fail(res, 'Base name is required', 400);
      }

      // Step 3: Persist the base using the service layer.
      const base = await baseService.createBase(payload);
      return ok(res, base, 'Base created');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Updates an existing base.
  const updateBase = async (req, res) => {
    try {
      // Step 1: Parse and validate the target id.
      const baseId = toInteger(req.params.base_id);
      if (!baseId) return fail(res, 'Invalid base id', 400);

      // Step 2: Construct an update payload from request body.
      const payload = {
        name: req.body.name,
        description: req.body.description,
      };

      // Step 3: Enforce name validity when provided.
      if (payload.name !== undefined && (typeof payload.name !== 'string' || !payload.name)) {
        return fail(res, 'Base name must be a non-empty string', 400);
      }

      // Step 4: Persist changes via the service layer.
      const base = await baseService.updateBase(baseId, payload);
      if (!base) return fail(res, 'Base not found', 404);

      return ok(res, base, 'Base updated');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  // Removes a base.
  const deleteBase = async (req, res) => {
    try {
      // Step 1: Validate id parameter.
      const baseId = toInteger(req.params.base_id);
      if (!baseId) return fail(res, 'Invalid base id', 400);

      // Step 2: Execute deletion and signal result.
      const deleted = await baseService.deleteBase(baseId);
      if (!deleted) return fail(res, 'Base not found', 404);

      return ok(res, {}, 'Base deleted');
    } catch (error) {
      return fail(res, error.message, 400);
    }
  };

  return {
    listBases,
    getBaseById,
    createBase,
    updateBase,
    deleteBase,
  };
};
