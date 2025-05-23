const { Voucher } = require("../models/voucher");
const { Order } = require("../models/order");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const vouchers = await Voucher.find().populate("orderId");
  if (!vouchers) {
    return res.status(500).json({ success: false });
  }
  res.send(vouchers);
});
router.get("/:id", async (req, res) => {
  const voucher = await Voucher.findById(req.params.id).populate("orderId");
  if (!voucher) {
    return res.status(500).json({ success: false });
  }
  res.send(voucher);
});
router.post("/", async (req, res) => {
  const voucher = new Voucher({
    amount: req.body.amount,
    orderId: req.body.orderId,
  });
  try {
    const savedVoucher = await voucher.save();
    res.status(201).json(savedVoucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.put("/:id", async (req, res) => {
  const voucher = await Voucher.findByIdAndUpdate(
    req.params.id,
    {
      amount: req.body.amount,
      orderId: req.body.orderId,
    },
    { new: true }
  );
  if (!voucher) {
    return res.status(500).json({ success: false });
  }
  res.send(voucher);
});
router.delete("/:id", async (req, res) => {
  const voucher = await Voucher.findByIdAndRemove(req.params.id);
  if (!voucher) {
    return res.status(500).json({ success: false });
  }
  res.send(voucher);
});

module.exports = router;
