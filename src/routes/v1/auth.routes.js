// src/routes/v1/auth.routes.js
const router = require("express").Router();
const authController = require("../../controllers/auth.controller");
const validate = require("../../middlewares/validate");

const validateRegister = (req) => {
  const errors = [];
  if (!req.body.first_name) errors.push("first_name is required");
  if (!req.body.last_name) errors.push("last_name is required");
  if (!req.body.email) errors.push("email is required");
  if (!req.body.password || req.body.password.length < 6) {
    errors.push("password must be at least 6 characters");
  }
  return errors;
};

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password]
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Aarav
 *               last_name:
 *                 type: string
 *                 example: Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aarav@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: Secret@123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: User registered successfully }
 *                 data:
 *                   type: object
 *                   properties:
 *                     user: { $ref: "#/components/schemas/User" }
 *                     token: { type: string, example: eyJhbGciOiJIUzI1NiIs... }
 *       409:
 *         description: Email already exists
 *       422:
 *         description: Validation failed
 */
router.post("/register", validate(validateRegister), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: aarav@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Secret@123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", authController.login);

module.exports = router;