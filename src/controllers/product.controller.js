// src/controllers/product.controller.js
const productService = require("../services/product.service");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");

const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Product created",
    data: product,
  });
});

const list = asyncHandler(async (req, res) => {
  const { items, meta } = await productService.listProducts(req.query);
  return sendSuccess(res, {
    message: "Products fetched",
    data: items,
    meta,
  });
});

const getById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(Number(req.params.id));
  return sendSuccess(res, {
    message: "Product fetched",
    data: product,
  });
});

module.exports = { create, list, getById };