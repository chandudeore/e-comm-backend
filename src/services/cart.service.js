// src/services/cart.service.js
const cartRepo = require("../repositories/cart.repository");
const productRepo = require("../repositories/product.repository");
const AppError = require("../utils/AppError");

async function getCart(userId) {
  return cartRepo.getUserCart(userId);
}

async function addToCart(userId, { product_id, quantity = 1 }) {
  const product = await productRepo.findById(product_id);
  if (!product) {
    throw new AppError("Cannot add non-existent product to cart", 404);
  }
  return cartRepo.upsertCartItem(userId, product_id, quantity);
}

async function deleteCartItem(userId, cartItemId) {
  const deleted = await cartRepo.removeCartItem(userId, cartItemId);
  if (!deleted) {
    throw new AppError("Cart item not found", 404);
  }
}

module.exports = { getCart, addToCart, deleteCartItem };