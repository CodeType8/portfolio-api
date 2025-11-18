const { Op } = require('sequelize');

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

const normalizeOrder = (order) => {
  if (typeof order !== 'string') return 'ASC';
  return order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
};

const resolveSortField = (sortBy, sortFields = {}) => {
  if (!sortBy) return null;
  const entries = Array.isArray(sortFields)
    ? sortFields.map((field) => [field, field])
    : Object.entries(sortFields);

  const lowered = sortBy.toLowerCase();
  for (const [key, field] of entries) {
    if (key.toLowerCase() === lowered) {
      return field;
    }
  }
  return null;
};

const buildOrderClause = (sortBy, sortOrder, sortFields = {}, defaultSort) => {
  const field = resolveSortField(sortBy, sortFields);
  const orderDirection = normalizeOrder(sortOrder);

  if (field) {
    return [[field, orderDirection]];
  }

  if (defaultSort?.field) {
    return [[defaultSort.field, normalizeOrder(defaultSort.direction)]];
  }

  return null;
};

const buildFilters = (query, filterFields = {}) => {
  const filters = {};
  Object.entries(filterFields).forEach(([param, config]) => {
    const value = query?.[param];
    if (value === undefined || value === null || value === '') return;

    const resolved = typeof config === 'string' ? { field: config } : config;
    const field = resolved.field || param;
    const transform = resolved.transform;
    const parsed = transform ? transform(value) : value;

    if (parsed === undefined || parsed === null) return;
    if (typeof parsed === 'number' && Number.isNaN(parsed)) return;

    filters[field] = parsed;
  });
  return filters;
};

const buildSearchClause = (term, searchFields = []) => {
  if (!term || !term.trim() || !searchFields.length) return null;

  const likeTerm = `%${term.trim()}%`;
  return {
    [Op.or]: searchFields.map((field) => ({
      [field]: { [Op.iLike]: likeTerm }
    }))
  };
};

const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
};

const mergeWhereClauses = (baseWhere = {}, additionalWhere = {}) => {
  const merged = { ...baseWhere };
  if (!additionalWhere) return merged;

  for (const key of Reflect.ownKeys(additionalWhere)) {
    const value = additionalWhere[key];
    if (key === Op.and || key === Op.or) {
      const existing = merged[key];
      merged[key] = existing
        ? [...ensureArray(existing), ...ensureArray(value)]
        : ensureArray(value);
    } else {
      merged[key] = value;
    }
  }

  return merged;
};

const buildListQueryOptions = (query = {}, config = {}) => {
  const {
    baseWhere = {},
    filterFields = {},
    searchFields = [],
    sortFields = {},
    defaultSort
  } = config;

  const filters = buildFilters(query, filterFields);
  const searchTerm = query.search ?? query.q ?? null;
  const searchClause = buildSearchClause(searchTerm, searchFields);

  const order = buildOrderClause(query.sort_by ?? query.sortBy, query.sort_order ?? query.sortOrder ?? query.order, sortFields, defaultSort);

  let where = mergeWhereClauses(baseWhere, filters);
  if (searchClause) {
    where = mergeWhereClauses(where, { [Op.and]: [searchClause] });
  }

  const options = {};
  const hasWhereContent = Object.keys(where).length || Object.getOwnPropertySymbols(where).length;
  if (hasWhereContent) options.where = where;
  if (order) options.order = order;

  return options;
};

const toInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : null;
};

const toPositiveInteger = (value) => {
  const parsed = toInteger(value);
  if (parsed === null || parsed <= 0) return null;
  return parsed;
};

const resolvePageSize = (query = {}, defaultPageSize = DEFAULT_PAGE_SIZE, maxPageSize = MAX_PAGE_SIZE) => {
  const candidates = [
    query.page_size,
    query.pageSize,
    query.per_page,
    query.perPage,
    query.limit,
    query.page_limit,
  ];

  for (const candidate of candidates) {
    const parsed = toPositiveInteger(candidate);
    if (parsed !== null) {
      return Math.min(parsed, maxPageSize);
    }
  }

  return Math.min(defaultPageSize, maxPageSize);
};

const buildPaginationOptions = (query = {}, config = {}) => {
  const {
    defaultPage = DEFAULT_PAGE,
    defaultPageSize = DEFAULT_PAGE_SIZE,
    maxPageSize = MAX_PAGE_SIZE,
  } = config;

  const resolvedPage = toPositiveInteger(query.page) ?? toPositiveInteger(query.pageNumber) ?? defaultPage;
  const page = resolvedPage > 0 ? resolvedPage : defaultPage;
  const pageSize = resolvePageSize(query, defaultPageSize, maxPageSize);
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  return {
    pagination: { page, pageSize },
    options: { limit, offset },
  };
};

const buildPaginationMeta = ({ page, pageSize }, totalItems) => {
  const safePage = page > 0 ? page : DEFAULT_PAGE;
  const safePageSize = pageSize > 0 ? pageSize : DEFAULT_PAGE_SIZE;
  const total = Number.isInteger(totalItems) && totalItems >= 0 ? totalItems : 0;
  const totalPages = safePageSize === 0 ? 0 : Math.ceil(total / safePageSize);

  return {
    page: safePage,
    pageSize: safePageSize,
    totalItems: total,
    totalPages,
    hasPreviousPage: safePage > 1 && totalPages > 0,
    hasNextPage: safePage < totalPages,
  };
};

module.exports = {
  buildListQueryOptions,
  buildSearchClause,
  mergeWhereClauses,
  toInteger,
  buildPaginationOptions,
  buildPaginationMeta,
};
