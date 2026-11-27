// src/services/product.service.js
const productRepo = require("../repositories/product.repository");
const AppError = require("../utils/AppError");

async function createProduct(payload) {
  return productRepo.createProduct(payload);
}

async function listProducts(query) {
  return productRepo.findAllDynamic(query);
}

async function getProductById(id) {
  const product = await productRepo.findById(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return product;
}

module.exports = { createProduct, listProducts, getProductById };