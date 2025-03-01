const axios = require('axios');
require('dotenv').config();

const OMDB_API_URL = process.env.OMDB_API_URL;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

const omdbService = {
  searchMovies: async (query) => {
    try {
      console.log('Searching OMDB with URL:', OMDB_API_URL);
      console.log('Using API key:', OMDB_API_KEY);
      
      const response = await axios.get(OMDB_API_URL, {
        params: {
          s: query,
          apikey: OMDB_API_KEY,
          type: 'movie'
        }
      });

      console.log('OMDB Response:', response.data);

      if (response.data.Response === 'False') {
        console.log('OMDB Error:', response.data.Error);
        return [];
      }

      return response.data.Search || [];
    } catch (error) {
      console.error('OMDB search error:', error.response?.data || error.message);
      throw error;
    }
  },

  getMovieDetails: async (imdbId) => {
    try {
      const response = await axios.get(OMDB_API_URL, {
        params: {
          i: imdbId,
          apikey: OMDB_API_KEY,
          plot: 'full'
        }
      });

      if (response.data.Response === 'False') {
        throw new Error(response.data.Error);
      }

      return response.data;
    } catch (error) {
      console.error('OMDB details error:', error.response?.data || error.message);
      throw error;
    }
  },

  convertToMovieModel: (omdbMovie) => {
    try {
      return {
        title: omdbMovie.Title,
        imdbId: omdbMovie.imdbID,
        description: omdbMovie.Plot || '',
        duration: omdbMovie.Runtime || 'N/A',
        language: omdbMovie.Language || 'N/A',
        releaseDate: omdbMovie.Released ? new Date(omdbMovie.Released) : new Date(),
        genre: omdbMovie.Genre ? omdbMovie.Genre.split(', ') : [],
        director: omdbMovie.Director || 'N/A',
        cast: omdbMovie.Actors ? omdbMovie.Actors.split(', ') : [],
        rating: {
          imdb: omdbMovie.imdbRating ? parseFloat(omdbMovie.imdbRating) : 0
        },
        poster: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : '/fallback-movie-poster.jpg',
        status: 'now_showing',
        price: {
          standard: 10,
          premium: 15
        }
      };
    } catch (error) {
      console.error('Error converting OMDB movie:', error);
      throw error;
    }
  }
};

module.exports = omdbService; 