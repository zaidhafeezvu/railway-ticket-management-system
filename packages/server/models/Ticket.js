const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Train',
    required: true
  },
  pnr: {
    type: String,
    required: true,
    unique: true
  },
  passengerName: {
    type: String,
    required: [true, 'Please provide passenger name'],
    trim: true
  },
  passengerAge: {
    type: Number,
    required: [true, 'Please provide passenger age'],
    min: 1,
    max: 120
  },
  passengerGender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  classType: {
    type: String,
    enum: ['sleeper', '3ac', '2ac', '1ac', 'general'],
    required: true
  },
  seatNumber: {
    type: String,
    required: true
  },
  bookingDate: {
    type: Date,
    required: true
  },
  journeyDate: {
    type: Date,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate PNR before saving
ticketSchema.pre('save', async function(next) {
  if (!this.pnr) {
    // Generate a more secure PNR using crypto
    const crypto = require('crypto');
    const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
    const timestamp = Date.now().toString(36).toUpperCase();
    this.pnr = 'PNR' + timestamp + randomPart;
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
