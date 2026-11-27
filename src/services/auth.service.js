// src/services/auth.service.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const userRepo = require("../repositories/user.repository");
const AppError = require("../utils/AppError");

// src/services/auth.service.js
function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}
async function register({ first_name, last_name, email, password }) {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw new AppError("Please try another email", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userRepo.createUser({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });
  const token = signToken(user);

  return { user, token };
}

async function login({ email, password }) {
  const userWithHash = await userRepo.findByEmail(email);
  if (!userWithHash || !userWithHash.status) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, userWithHash.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const { password: _, ...user } = userWithHash;
  const token = signToken(user);

  return { user, token };
}

module.exports = { register, login };