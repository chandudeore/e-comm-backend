// src/controllers/auth.controller.js
const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, {
    statusCode: 200,
    message: "Login successful",
    data: result,
  });
});

module.exports = { register, login };