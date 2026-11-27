// src/controllers/cart.controller.js
const cartService = require("../services/cart.service");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  return sendSuccess(res, { message: "Cart fetched", data: cart });
});

const addItem = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(req.user.id, req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Item added to cart",
    data: cart,
  });
});

const removeItem = asyncHandler(async (req, res) => {
  await cartService.deleteCartItem(req.user.id, Number(req.params.id));
  return sendSuccess(res, { message: "Item removed from cart" });
});

module.exports = { getCart, addItem, removeItem };