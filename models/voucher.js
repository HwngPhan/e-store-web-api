const mongoose = require("mongoose");

const voucherSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: 0,
  },
});

exports.Voucher = mongoose.model("Voucher", voucherSchema);
