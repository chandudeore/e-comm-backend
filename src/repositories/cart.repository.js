// src/repositories/cart.repository.js
const { pool } = require("../config/db");

async function getUserCart(userId) {
  const [rows] = await pool.execute(
    `SELECT
       ci.id AS cart_item_id,
       ci.quantity,
       p.id AS product_id,
       p.title,
       p.price,
       p.image,
       p.category,
       (ci.quantity * p.price) AS subtotal
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = ?
     ORDER BY ci.created_at DESC`,
    [userId]
  );

  const totalAmount = rows.reduce((sum, item) => sum + Number(item.subtotal), 0);
  return { items: rows, totalAmount };
}

async function upsertCartItem(userId, productId, quantity = 1) {
  await pool.execute(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [userId, productId, quantity]
  );
  return getUserCart(userId);
}

async function removeCartItem(userId, cartItemId) {
  const [result] = await pool.execute(
    `DELETE FROM cart_items WHERE id = ? AND user_id = ?`,
    [cartItemId, userId]
  );
  return result.affectedRows > 0;
}

module.exports = { getUserCart, upsertCartItem, removeCartItem };