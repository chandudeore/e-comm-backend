// src/routes/v1/cart.routes.js
const router = require("express").Router();
const cartController = require("../../controllers/cart.controller");
const authenticate = require("../../middlewares/authenticate");

router.use(authenticate);

/**
 * @openapi
 * /cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get current user's cart
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: Cart fetched }
 *                 data: { $ref: "#/components/schemas/CartSummary" }
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 */
router.get("/", cartController.getCart);

/**
 * @openapi
 * /cart:
 *   post:
 *     tags: [Cart]
 *     summary: Add a product or increment its quantity in cart
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id]
 *             properties:
 *               product_id: { type: integer, example: 1 }
 *               quantity: { type: integer, minimum: 1, default: 1, example: 2 }
 *     responses:
 *       201:
 *         description: Item added to cart
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 */
router.post("/", cartController.addItem);

/**
 * @openapi
 * /cart/{id}:
 *   delete:
 *     tags: [Cart]
 *     summary: Remove an item from the current user's cart
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart item ID (`cart_item_id`)
 *         schema: { type: integer, example: 12 }
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         $ref: "#/components/responses/UnauthorizedError"
 *       404:
 *         $ref: "#/components/responses/NotFoundError"
 */
router.delete("/:id", cartController.removeItem);

module.exports = router;