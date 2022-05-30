const express = require("express");
const Product = require("../models/product.model");

const router = express.Router();

router.post("", async (req, res) => {
  try {
    const prod = await Product.create(req.body);

    return res.send(prod);
  } catch (err) {
    return res.send({ message: "Error" });
  }
});

router.get("", async (req, res) => {
  try {
    //console.log(req.query);
    const size = 6,
      page = req.query.page || 1,
      price = req.query.price,
      cat = req.query.category || 0;

    if (cat == 0) {
      const prod = await Product.find()
        .skip((page - 1) * size)
        .limit(size)
        .sort({ price: price })
        .lean()
        .exec();
      return res.send(prod);
    } else {
      const prod = await Product.find({ category: cat })
        .skip((page - 1) * size)
        .limit(size)
        .sort({ price: price })
        .lean()
        .exec();
      return res.send(prod);
    }
  } catch (e) {
    return res.send({ error: "Something went wrong" });
  }
});
router.get("/:_id", async (req, res) => {
  //console.log(req.params);
  const prod = await Product.findById(req.params._id);
  return res.send(prod);
});

module.exports = router;
