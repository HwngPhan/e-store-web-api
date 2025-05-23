const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  customerName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  province: {
    type: String,
    required: true,
  },
  commune: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  totalPrice: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});

// orderSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// orderSchema.set("toJSON", {
//   virtuals: true,
// });

exports.Order = mongoose.model("Order", orderSchema);
