// src/middlewares/authenticate.js
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const AppError = require("../utils/AppError");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Authorization token was not provided or was not valid", 401));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // { id, email, role }
    return next();
  } catch (err) {
    return next(new AppError("Invalid or expired authorization token", 401));
  }
};