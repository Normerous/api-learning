const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: { type: String, unique: true, required: true },
    hashPassword: { type: String, unique: true, required: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = model("User", userSchema);
