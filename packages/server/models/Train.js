const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: [true, 'Please provide a train number'],
    unique: true,
    trim: true
  },
  trainName: {
    type: String,
    required: [true, 'Please provide a train name'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Please provide source station'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Please provide destination station'],
    trim: true
  },
  departureTime: {
    type: String,
    required: [true, 'Please provide departure time']
  },
  arrivalTime: {
    type: String,
    required: [true, 'Please provide arrival time']
  },
  classes: [{
    type: {
      type: String,
      enum: ['sleeper', '3ac', '2ac', '1ac', 'general'],
      required: true
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0
    },
    totalSeats: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  days: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Train', trainSchema);
