require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

async function clearMovies() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Movie.deleteMany({});
    console.log('Movies collection cleared');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error clearing movies:', error);
  }
}

clearMovies(); 