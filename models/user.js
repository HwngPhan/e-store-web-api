const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  zip: {
    type: String,
    default: "",
  },
  province: {
    type: String,
    default: "",
  },
  district: {
    type: String,
    default: "",
  },
  commune: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  housing_type: {
    type: String,
    default: "",
  },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
