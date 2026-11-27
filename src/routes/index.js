// src/routes/index.js
const router = require("express").Router();
const { checkDbConnection } = require("../config/db");
const { swaggerSpec, swaggerUi, swaggerUiOptions } = require("../docs/swagger");

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Check API and MySQL connection pool health
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Database unavailable
 */
router.get("/health", async (req, res) => {
  try {
    await checkDbConnection();
    res.status(200).json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(503).json({
      status: "degraded",
      database: "disconnected",
    });
  }
});

// Swagger UI & raw OpenAPI JSON
router.get("/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Versioned API routes
router.use("/v1", require("./v1"));

// Example stub for future v2
router.use("/v2", (req, res) => {
  res.status(501).json({
    success: false,
    message: "API v2 is under development; use /api/v1",
  });
});

module.exports = router;