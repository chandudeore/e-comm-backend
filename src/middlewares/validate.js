// src/middlewares/validate.js
const AppError = require("../utils/AppError");

// Pass a schema function (body, req) => string[] of validation errors
const validate = (validatorFn) => (req, res, next) => {
  const errors = validatorFn(req);
  if (errors.length > 0) {
    return next(new AppError("Validation failed", 422, errors));
  }
  return next();
};

module.exports = validate;