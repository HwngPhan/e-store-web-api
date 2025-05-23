const { OrderItem } = require("../models/order-item");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const orderItems = await OrderItem.find()
    .populate("product", "name")
    .populate("orderId", "userId");
  if (!orderItems) {
    return res.status(500).json({ success: false });
  }
  res.send(orderItems);
});

router.get("/:id", async (req, res) => {
  const orderItem = await OrderItem.findById(req.params.id)
    .populate("product", "name")
    .populate("orderId", "userId");
  if (!orderItem) {
    return res.status(500).json({ success: false });
  }
  res.send(orderItem);
});

router.put("/:id", async (req, res) => {
  const orderItem = await OrderItem.findByIdAndUpdate(
    req.params.id,
    {
      quantity: req.body.quantity,
      product: req.body.product,
      orderId: req.body.orderId,
    },
    { new: true }
  );
  if (!orderItem) {
    return res.status(500).json({ success: false });
  }
  res.send(orderItem);
});
router.delete("/:id", async (req, res) => {
  const orderItem = await OrderItem.findByIdAndRemove(req.params.id);
  if (!orderItem) {
    return res.status(500).json({ success: false });
  }
  res.send(orderItem);
});

module.exports = router;
