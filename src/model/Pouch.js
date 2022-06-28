const mongoose = require("mongoose");

const { Schema } = mongoose;

const pouchSchema = new Schema(
  {
    name: { type: String },
    consignment: { type: [String] },
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = mongoose.model("Pouch", pouchSchema);
