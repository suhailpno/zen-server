require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

const initialMovies = [
  {
    title: "The Dark Knight",
    imdbId: "tt0468569",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    duration: "2h 32min",
    language: "English",
    releaseDate: new Date("2008-07-18"),
    genre: ["Action", "Crime", "Drama"],
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    rating: {
      imdb: 9.0,
      metacritic: 84
    },
    poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
    status: "now_showing",
    price: {
      standard: 10,
      premium: 15
    }
  },
  {
    title: "Inception",
    imdbId: "tt1375666",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    duration: "2h 28min",
    language: "English",
    releaseDate: new Date("2010-07-16"),
    genre: ["Action", "Adventure", "Sci-Fi"],
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    rating: {
      imdb: 8.8,
      metacritic: 87
    },
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    status: "now_showing",
    price: {
      standard: 10,
      premium: 15
    }
  }
];

const seedMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Insert new movies
    const result = await Movie.insertMany(initialMovies);
    console.log(`Added ${result.length} movies`);

    mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error seeding movies:', error);
    process.exit(1);
  }
};

seedMovies(); 