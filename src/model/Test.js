const mongoose = require('mongoose')

const { Schema } = mongoose

const testSchema = new Schema(
  {
    name: String,
    count: Number,
    maxUser: Number,
    userList: Array
  },
  { timestamps: { createdAt: 'createdAt' } },
)

module.exports = mongoose.model('Test', testSchema)