require('dotenv').config();
const mongoose = require('mongoose');
const omdbService = require('../services/omdbService');
const Movie = require('../models/Movie');

const popularMovies = [
  'tt0468569', // The Dark Knight
  'tt0137523', // Fight Club
  'tt0109830', // Forrest Gump
  'tt0133093', // The Matrix
  'tt0110912'  // Pulp Fiction
];

const importMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const imdbId of popularMovies) {
      try {
        // Check if movie already exists
        const exists = await Movie.findOne({ imdbId });
        if (exists) {
          console.log(`Movie ${imdbId} already exists`);
          continue;
        }

        // Get and save movie
        const omdbMovie = await omdbService.getMovieDetails(imdbId);
        const movieData = omdbService.convertToMovieModel(omdbMovie);
        const movie = new Movie(movieData);
        await movie.save();
        console.log(`Imported: ${movie.title}`);
      } catch (error) {
        console.error(`Error importing movie ${imdbId}:`, error.message);
      }
    }

    console.log('Import completed');
    mongoose.disconnect();
  } catch (error) {
    console.error('Import script error:', error);
    process.exit(1);
  }
};

importMovies(); 