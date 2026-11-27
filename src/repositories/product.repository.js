// src/repositories/product.repository.js
const { pool } = require("../config/db");
const { buildDynamicQuery } = require("../utils/queryBuilder");

async function createProduct(data) {
  const ratingRate = data.rating?.rate ?? data.rating_rate ?? 0;
  const ratingCount = data.rating?.count ?? data.rating_count ?? 0;

  const [result] = await pool.execute(
    `INSERT INTO products (title, price, description, category, image, stock, rating_rate, rating_count)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.price,
      data.description,
      data.category,
      data.image,
      data.stock ?? 10,
      ratingRate,
      ratingCount,
    ]
  );

  return findById(result.insertId);
}

async function findAllDynamic(query) {
  const { whereClause, orderClause, params, pagination } = buildDynamicQuery(query, {
    allowedFilters: { category: "category" },
    allowedSorts: ["id", "price", "title", "rating_rate", "created_at"],
    defaultSort: "id",
    defaultOrder: "DESC",
    searchableColumns: ["title", "description", "category"],
    defaultLimit: 6,
  });

  const [[{ total }]] = await pool.execute(
    `SELECT COUNT(*) AS total FROM products ${whereClause}`,
    params
  );

  const [rows] = await pool.execute(
    `SELECT id, title, price, description, category, image, stock, rating_rate, rating_count, created_at
     FROM products
     ${whereClause}
     ${orderClause}
     LIMIT ? OFFSET ?`,
    [...params, pagination.limit, pagination.offset]
  );

  return {
    items: rows,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit) || 1,
    },
  };
}

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT id, title, price, description, category, image, stock, rating_rate, rating_count, created_at
     FROM products WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

module.exports = { createProduct, findAllDynamic, findById };