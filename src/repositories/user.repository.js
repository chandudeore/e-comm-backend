// src/repositories/user.repository.js
const { pool } = require("../config/db");

// src/repositories/user.repository.js
const SAFE_USER_COLUMNS = "id, first_name, last_name, email, role, status, created_at, updated_at";

async function findByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT ${SAFE_USER_COLUMNS}, password FROM users WHERE email = ? LIMIT 1`,
    [email.toLowerCase().trim()]
  );
  return rows[0] || null;
}
async function createUser({ first_name, last_name, email, password }) {
  const [result] = await pool.execute(
    `INSERT INTO users (first_name, last_name, email, password)
     VALUES (?, ?, ?, ?)`,
    [first_name.trim(), last_name.trim(), email.toLowerCase().trim(), password]
  );

  const [rows] = await pool.execute(
    `SELECT ${SAFE_USER_COLUMNS} FROM users WHERE id = ?`,
    [result.insertId]
  );
  return rows[0];
}

module.exports = { findByEmail, createUser };