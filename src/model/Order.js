const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    consignment: { type: String, index: 1 },
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Order", orderSchema);
