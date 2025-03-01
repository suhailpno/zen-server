const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imdbId: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  genre: [{
    type: String,
    required: true
  }],
  director: {
    type: String,
    required: true
  },
  cast: [{
    type: String
  }],
  rating: {
    imdb: {
      type: Number,
      min: 0,
      max: 10
    },
    metacritic: Number
  },
  poster: {
    type: String,
    required: true
  },
  trailer: String,
  status: {
    type: String,
    enum: ['now_showing', 'coming_soon'],
    default: 'now_showing'
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
  }
}, {
  timestamps: true
});

// Add text indexes for search
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema); 