const mongoose = require('mongoose')

const { Schema } = mongoose

const test2Schema = new Schema(
  {
    name: String,
    count: Number,
    testcount: Number
  },
  { timestamps: { createdAt: 'createdAt' } },
)

module.exports = mongoose.model('Test2', test2Schema)