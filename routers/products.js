const { Category } = require("../models/category");
const { Product } = require("../models/products");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get(`/`, async (req, res) => {
  // console.log("Get all products");
  // const productList = await Product.find().select("name image -_id");
  let filter = {};
  if (req.query.categories) {
    filter.category = { $in: req.query.categories.split(",") };
  }

  if (req.query.name) {
    filter.name = { $regex: req.query.name, $options: "i" }; // case-insensitive search
  }
  if (req.query.brand) {
    filter.brand = { $regex: req.query.brand, $options: "i" }; // case-insensitive search
  }

  const productList = await Product.find(filter).populate("category");
  if (!productList) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(productList);
});
router.get(`/:id`, async (req, res) => {
  // console.log("Get all products");
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    res.status(500).json({
      success: false,
    });
  }
  res.send(product);
});
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid category");
  }

  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    brand: req.body.brand,
    price: req.body.price,
    size: req.body.size,
    color: req.body.color,
    discount: req.body.discount,
    category: req.body.category,
    countInStock: req.body.countInStock,
  });

  product = await product.save();
  if (!product) {
    return res.status(500).send("The product cannot be created");
  }
  res.send(product);
  // product
  //   .save()
  //   .then((createdProduct) => {
  //     res.status(201).send(createdProduct);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       error: err,
  //       success: false,
  //     });
  //   });
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid product id");
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid category");
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      brand: req.body.brand,
      price: req.body.price,
      size: req.body.size,
      color: req.body.color,
      discount: req.body.discount,
      category: req.body.category,
      countInStock: req.body.countInStock,
    },
    { new: true }
  );
  if (!product) {
    return res.status(500).send("The product cannot be updated");
  }
  res.send(product);
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

router.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;
