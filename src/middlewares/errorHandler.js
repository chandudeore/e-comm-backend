// src/middlewares/errorHandler.js
const config = require("../config/env");

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details || null;

  // Map common MySQL error codes cleanly
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "Duplicate record already exists";
  } else if (err.code === "ER_NO_REFERENCED_ROW_2") {
    statusCode = 400;
    message = "Referenced record does not exist";
  } else if (err.code === "ER_BAD_FIELD_ERROR") {
    statusCode = 400;
    message = "Invalid query field";
  }

  if (config.nodeEnv !== "production") {
    console.error("[ERROR]", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(config.nodeEnv !== "production" && { stack: err.stack }),
  });
};