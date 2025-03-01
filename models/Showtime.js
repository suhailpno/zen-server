const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  seatsAvailable: {
    type: Number,
    required: true,
    default: 100
  },
  price: {
    standard: {
      type: Number,
      required: true
    },
    premium: {
      type: Number,
      required: true
    }
  },
  seatLayout: {
    standard: [{
      row: String,
      number: Number,
      isBooked: {
        type: Boolean,
        default: false
      }
    }],
    premium: [{
      row: String,
      number: Number,
      isBooked: {
        type: Boolean,
        default: false
      }
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Showtime', showtimeSchema); 