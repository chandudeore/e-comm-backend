// src/utils/queryBuilder.js
/**
 * Builds dynamic SQL clauses safely using a field whitelist.
 * Supported query params:
 *   ?page=1&limit=6&sortBy=price&order=asc&category=electronics&minPrice=10&maxPrice=500&search=phone
 */
function buildDynamicQuery(query, options = {}) {
  const {
    allowedFilters = {}, // e.g. { category: 'category' }
    allowedSorts = ["id", "created_at"],
    defaultSort = "id",
    defaultOrder = "DESC",
    searchableColumns = [],
    defaultLimit = 6,
    maxLimit = 100,
  } = options;

  const conditions = [];
  const params = [];

  // 1. Dynamic exact filters
  for (const [queryKey, columnName] of Object.entries(allowedFilters)) {
    const val = query[queryKey];
    if (val !== undefined && val !== "" && val !== "all" && val !== "0") {
      conditions.push(`${columnName} = ?`);
      params.push(val);
    }
  }

  // 2. Dynamic numeric range filters (e.g., minPrice / maxPrice)
  if (query.minPrice !== undefined && query.minPrice !== "" && !Number.isNaN(Number(query.minPrice))) {
    conditions.push("price >= ?");
    params.push(Number(query.minPrice));
  }
  if (query.maxPrice !== undefined && query.maxPrice !== "" && !Number.isNaN(Number(query.maxPrice))) {
    conditions.push("price <= ?");
    params.push(Number(query.maxPrice));
  }

  // 3. Dynamic keyword search across allowed columns
  if (query.search && typeof query.search === "string" && query.search.trim() && searchableColumns.length > 0) {
    const term = `%${query.search.trim()}%`;
    const searchClauses = searchableColumns.map((col) => `${col} LIKE ?`);
    conditions.push(`(${searchClauses.join(" OR ")})`);
    params.push(...searchableColumns.map(() => term));
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // 4. Dynamic sorting (whitelisted column + direction)
  const sortField = allowedSorts.includes(query.sortBy) ? query.sortBy : defaultSort;
  const sortDir = String(query.order || defaultOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";
  const orderClause = `ORDER BY ${sortField} ${sortDir}`;

  // 5. Dynamic pagination
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const offset = (page - 1) * limit;

  return {
    whereClause,
    orderClause,
    params,
    pagination: { page, limit, offset },
  };
}

module.exports = { buildDynamicQuery };