const { buildPaginationMeta } = require('./queryBuilder');

exports.ok = (res, data = {}, message = 'OK') => res.json({ success: true, message, data });
exports.fail = (res, message = 'Failed', code = 400) => res.status(code).json({ success: false, message });

exports.paginatedOk = (res, result = {}, pagination = { page: 1, pageSize: 25 }, message = 'OK', extra = {}) => {
  const rows = Array.isArray(result.rows) ? result.rows : [];
  const total = Number.isInteger(result.count) ? result.count : 0;
  const meta = buildPaginationMeta(pagination, total);
  return exports.ok(res, { ...extra, items: rows, pagination: meta }, message);
};
