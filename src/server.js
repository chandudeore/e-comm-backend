// src/server.js
const app = require("./app");
const config = require("./config/env");
const { pool, checkDbConnection } = require("./config/db");

let server;

async function start() {
  try {
    await checkDbConnection();
    console.log(`Connected to MySQL (${config.db.database} @ ${config.db.host}:${config.db.port})`);

    server = app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}/api/v1`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`\nReceived ${signal}. Closing HTTP server and DB pool...`);
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await pool.end();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

start();