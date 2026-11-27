// src/middlewares/authorize.js
const AppError = require("../utils/AppError");

module.exports = (...allowedRoles) => (req, res, next) => {
  const normalizedAllowed = allowedRoles.map((r) => String(r).trim().toLowerCase());
  const userRole = req.user?.role ? String(req.user.role).trim().toLowerCase() : "";

  if (!req.user || !normalizedAllowed.includes(userRole)) {
    return next(new AppError("You do not have permission to perform this action", 403));
  }
  return next();
};