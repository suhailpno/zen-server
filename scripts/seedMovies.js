require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

const defaultMovies = [
  {
    title: "Inception",
    imdbId: "tt1375666",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a C.E.O.",
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
    trailer: "https://www.youtube.com/embed/YoHD9XEInc0",
    status: "now_showing",
    price: {
      standard: 12,
      premium: 18
    }
  },
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
    trailer: "https://www.youtube.com/embed/EXeTwQWrcwY",
    status: "now_showing",
    price: {
      standard: 12,
      premium: 18
    }
  },
  {
    title: "Interstellar",
    imdbId: "tt0816692",
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    duration: "2h 49min",
    language: "English",
    releaseDate: new Date("2014-11-07"),
    genre: ["Adventure", "Drama", "Sci-Fi"],
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    rating: {
      imdb: 8.6,
      metacritic: 74
    },
    poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    trailer: "https://www.youtube.com/embed/zSWdZVtXT7E",
    status: "now_showing",
    price: {
      standard: 12,
      premium: 18
    }
  },
  {
    title: "The Matrix",
    imdbId: "tt0133093",
    description: "A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.",
    duration: "2h 16min",
    language: "English",
    releaseDate: new Date("1999-03-31"),
    genre: ["Action", "Sci-Fi"],
    director: "Lana Wachowski",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    rating: { imdb: 8.7 },
    poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    status: "now_showing",
    price: { standard: 12, premium: 18 }
  },
  {
    title: "Pulp Fiction",
    imdbId: "tt0110912",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    duration: "2h 34min",
    language: "English",
    releaseDate: new Date("1994-10-14"),
    genre: ["Crime", "Drama"],
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    rating: { imdb: 8.9 },
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    status: "now_showing",
    price: { standard: 12, premium: 18 }
  },
  {
    title: "Goodfellas",
    imdbId: "tt0099685",
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.",
    duration: "2h 25min",
    language: "English",
    releaseDate: new Date("1990-09-19"),
    genre: ["Biography", "Crime", "Drama"],
    director: "Martin Scorsese",
    cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci"],
    rating: { imdb: 8.7 },
    poster: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    status: "now_showing",
    price: { standard: 12, premium: 18 }
  },
  {
    title: "The Shawshank Redemption",
    imdbId: "tt0111161",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    duration: "2h 22min",
    language: "English",
    releaseDate: new Date("1994-10-14"),
    genre: ["Drama"],
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    rating: { imdb: 9.3 },
    poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    status: "now_showing",
    price: { standard: 12, premium: 18 }
  },
  {
    title: "Fight Club",
    imdbId: "tt0137523",
    description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    duration: "2h 19min",
    language: "English",
    releaseDate: new Date("1999-10-15"),
    genre: ["Drama"],
    director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
    rating: { imdb: 8.8 },
    poster: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    status: "now_showing",
    price: { standard: 12, premium: 18 }
  }
];

const seedMovies = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Insert default movies
    const result = await Movie.insertMany(defaultMovies);
    console.log(`Added ${result.length} movies`);

    mongoose.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error seeding movies:', error);
    process.exit(1);
  }
};

seedMovies(); 