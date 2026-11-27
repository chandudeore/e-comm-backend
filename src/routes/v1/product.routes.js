// src/routes/v1/product.routes.js
const router = require("express").Router();
const productController = require("../../controllers/product.controller");
const authenticate = require("../../middlewares/authenticate");
const authorize = require("../../middlewares/authorize");

/**
 * @openapi
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: List products with dynamic filtering, search, sorting, and pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 6 }
 *       - in: query
 *         name: category
 *         schema: { type: string, example: electronics }
 *       - in: query
 *         name: search
 *         schema: { type: string, example: wireless }
 *         description: Matches against title, description, or category
 *       - in: query
 *         name: minPrice
 *         schema: { type: number, example: 10 }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number, example: 500 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [id, price, title, rating_rate, created_at], default: id }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [ASC, DESC], default: DESC }
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Products fetched }
 *                 data:
 *                   type: array
 *                   items: { $ref: "#/components/schemas/Product" }
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page: { type: integer, example: 1 }
 *                     limit: { type: integer, example: 6 }
 *                     total: { type: integer, example: 24 }
 *                     totalPages: { type: integer, example: 4 }
 */
router.get("/", productController.list);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a single product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Product fetched
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 */
router.get("/:id", productController.getById);

/**
 * @openapi
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product (Admin only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, price, description, category, image]
 *             properties:
 *               title: { type: string, example: Mechanical Keyboard }
 *               price: { type: number, example: 89.99 }
 *               description: { type: string, example: Hot-swappable 75% keyboard }
 *               category: { type: string, example: electronics }
 *               image: { type: string, example: https://example.com/keyboard.jpg }
 *               stock: { type: integer, example: 15 }
 *     responses:
 *       201:
 *         description: Product created
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       403:
 *         $ref: "#/components/responses/ForbiddenError"
 */
router.post("/", authenticate, authorize("admin"), productController.create);

module.exports = router;