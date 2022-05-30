const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");

router.get("", async (req, res) => {
  const cart = await Cart.find().lean().exec();
  return res.send(cart);
});
router.post("", async (req, res) => {
  const cart = await Cart.create(req.body);
  // console.log(req.body);

  return res.send(cart);
});
router.delete("/:id", async (req, res) => {
  //console.log("In the delete", req.params);
  const cart = await Cart.deleteOne({ id: req.params.id });
  return res.send("Welcome to the delete");
});

module.exports = router;
