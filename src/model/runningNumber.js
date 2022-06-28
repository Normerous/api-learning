const mongoose = require('mongoose')
const paginate = require('mongoose-paginate')

const { Schema } = mongoose

const runningNumberSchema = new Schema(
  {
    outputId: String,
    reference: Number,
    type: {
      type: String,
      enum: ['pssConsignment', 'bookingNumber', 'kerryConsignment', 'personalBookingNumber', 'pouchNumber', 'pouchNumber2'],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isFirstTimeOfMonth: Boolean,
  },
  { timestamps: { createdAt: 'createdAt' } },
)

runningNumberSchema.plugin(paginate)

module.exports = mongoose.model('RunningNumber', runningNumberSchema)