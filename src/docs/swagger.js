// src/docs/swagger.js
const path = require("path");
const fs = require("fs");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("../config/env");
const components = require("./components");

const routeFiles = [
  "src/routes/index.js",
  "src/routes/v1/index.js",
  "src/routes/v1/auth.routes.js",
  "src/routes/v1/product.routes.js",
  "src/routes/v1/cart.routes.js",
]
  .map((p) => path.resolve(process.cwd(), p))
  .filter((p) => fs.existsSync(p));

console.log("Found route files for Swagger:", routeFiles);

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "E-Commerce API (Node.js + Express + MySQL)",
      version: "1.0.0",
      description:
        "Versioned REST API documentation for authentication, dynamic product filtering/sorting/pagination, and user cart management.",
    },
    servers: [
      {
        url: `http://localhost:${config.port}/api/v1`,
        description: "Local v1 API Server",
      },
    ],
    tags: [
      { name: "Health", description: "Service & MySQL pool health checks" },
      { name: "Auth", description: "User registration and login" },
      { name: "Products", description: "Dynamic product catalog endpoints" },
      { name: "Cart", description: "Authenticated shopping cart operations" },
    ],
    components,
    // Temporary fallback test to verify Swagger UI renders endpoints when paths exist
    paths: {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          responses: {
            200: { description: "OK" },
          },
        },
      },
    },
  },
  apis: routeFiles,
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions: {
    explorer: true,
    customSiteTitle: "API Docs — v1",
    swaggerOptions: { persistAuthorization: true },
  },
};