const movies = [
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    duration: "2h 28min",
    language: "English",
    releaseDate: new Date("2010-07-16"),
    genre: ["Action", "Adventure", "Sci-Fi"],
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    rating: {
      imdb: 8.8
    },
    poster: "https://example.com/inception-poster.jpg",
    price: {
      standard: 10,
      premium: 15
    }
  }
  // Add more sample movies as needed
];

module.exports = movies; 