const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  size: {
    type: Number,
    default: "",
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  color: {
    type: String,
    default: "",
  },
  discount: {
    type: Number,
    default: 0,
  },
});

// productSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });
// productSchema.set("toJSON", {
//   virtuals: true,
// });

exports.Product = mongoose.model("Product", productSchema);
