const Movie = require('../models/Movie');
const omdbService = require('../services/omdbService');

const movieController = {
  searchOMDB: async (req, res) => {
    try {
      const { query } = req.query;
      const movies = await omdbService.searchMovies(query);
      res.json(movies);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error searching movies',
        error: error.message
      });
    }
  },

  importFromOMDB: async (req, res) => {
    try {
      const { imdbId } = req.body;
      
      // Check if movie already exists
      const existingMovie = await Movie.findOne({ imdbId });
      if (existingMovie) {
        return res.status(400).json({
          success: false,
          message: 'Movie already exists'
        });
      }

      // Get movie details from OMDB
      const omdbMovie = await omdbService.getMovieDetails(imdbId);
      
      // Convert to our model format
      const movieData = omdbService.convertToMovieModel(omdbMovie);
      
      // Save to database
      const movie = new Movie(movieData);
      await movie.save();

      res.status(201).json({
        success: true,
        movie
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error importing movie',
        error: error.message
      });
    }
  },

  searchMovies: async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query || query.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search query must be at least 2 characters long'
        });
      }

      console.log('Searching for:', query);

      // First search local database
      let movies = await Movie.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      }).limit(10);

      console.log('Local database results:', movies.length);

      // If no local results, search OMDB
      if (movies.length === 0) {
        console.log('No local results, searching OMDB...');
        const omdbMovies = await omdbService.searchMovies(query);
        console.log('OMDB results:', omdbMovies.length);

        if (omdbMovies && omdbMovies.length > 0) {
          // Convert OMDB movies to our format and save to database
          const moviePromises = omdbMovies.map(async (omdbMovie) => {
            try {
              console.log('Processing OMDB movie:', omdbMovie.Title);
              
              // Check if movie already exists
              let movie = await Movie.findOne({ imdbId: omdbMovie.imdbID });
              
              if (!movie) {
                console.log('Fetching full details for:', omdbMovie.Title);
                const fullDetails = await omdbService.getMovieDetails(omdbMovie.imdbID);
                const movieData = omdbService.convertToMovieModel(fullDetails);
                
                // Save to database
                movie = new Movie(movieData);
                await movie.save();
                console.log('Saved new movie:', movie.title);
              } else {
                console.log('Movie already exists:', movie.title);
              }
              
              return movie;
            } catch (error) {
              console.error('Error processing movie:', omdbMovie.imdbID, error);
              return null;
            }
          });

          const processedMovies = await Promise.all(moviePromises);
          movies = processedMovies.filter(movie => movie !== null);
          console.log('Successfully processed movies:', movies.length);
        }
      }

      console.log('Final results count:', movies.length);
      res.json(movies);
    } catch (error) {
      console.error('Movie search error:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching movies',
        error: error.message
      });
    }
  },

  getMovieDetails: async (req, res) => {
    try {
      const { imdbId } = req.params;
      let movie = await Movie.findOne({ imdbId }).populate('showtimes');

      if (!movie) {
        const response = await axios.get(
          `${process.env.OMDB_API_URL}?i=${imdbId}&apikey=${process.env.OMDB_API_KEY}`
        );

        movie = await Movie.create({
          title: response.data.Title,
          imdbId: response.data.imdbID,
          poster: response.data.Poster,
          plot: response.data.Plot,
          genre: response.data.Genre.split(', '),
          runtime: response.data.Runtime,
          released: new Date(response.data.Released),
          rating: parseFloat(response.data.imdbRating)
        });
      }

      res.json(movie);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching movie details', error: error.message });
    }
  },

  getMovies: async (req, res) => {
    try {
      let movies = await Movie.find({ status: 'now_showing' });

      // If no movies in database, fetch from OMDB
      if (!movies.length) {
        const popularMovies = [
          'tt0111161', // The Shawshank Redemption
          'tt0068646', // The Godfather
          'tt0468569', // The Dark Knight
          'tt0071562', // The Godfather: Part II
          'tt0050083', // 12 Angry Men
          'tt0108052', // Schindler's List
          'tt0167260', // The Lord of the Rings: The Return of the King
          'tt0110912'  // Pulp Fiction
        ];

        for (const imdbId of popularMovies) {
          try {
            const omdbMovie = await omdbService.getMovieDetails(imdbId);
            const movieData = omdbService.convertToMovieModel(omdbMovie);
            await Movie.findOneAndUpdate(
              { imdbId: movieData.imdbId },
              movieData,
              { upsert: true, new: true }
            );
          } catch (error) {
            console.error(`Error fetching movie ${imdbId}:`, error);
          }
        }

        // Fetch updated movies list
        movies = await Movie.find({ status: 'now_showing' });
      }

      console.log(`Found ${movies.length} movies`);
      res.json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching movies'
      });
    }
  },

  getAllMovies: async (req, res) => {
    try {
      const movies = await Movie.find()
        .sort({ releaseDate: -1 })
        .select('-__v');

      console.log(`Found ${movies.length} movies`); // Debug log

      if (!movies || movies.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No movies found'
        });
      }

      res.json(movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching movies'
      });
    }
  },

  getMovieById: async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id)
        .select('-__v');

      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      res.json(movie);
    } catch (error) {
      console.error('Error fetching movie:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching movie details'
      });
    }
  },

  importMovie: async (req, res) => {
    try {
      const { imdbId } = req.body;
      
      // Check if movie already exists
      let movie = await Movie.findOne({ imdbId });
      if (movie) {
        return res.json(movie);
      }

      // Fetch and save new movie
      const omdbMovie = await omdbService.getMovieDetails(imdbId);
      const movieData = omdbService.convertToMovieModel(omdbMovie);
      movie = new Movie(movieData);
      await movie.save();

      res.status(201).json(movie);
    } catch (error) {
      console.error('Error importing movie:', error);
      res.status(500).json({
        success: false,
        message: 'Error importing movie'
      });
    }
  },

  createMovie: async (req, res) => {
    try {
      const movie = new Movie(req.body);
      await movie.save();
      res.status(201).json({
        success: true,
        movie
      });
    } catch (error) {
      console.error('Error creating movie:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating movie'
      });
    }
  },

  updateMovie: async (req, res) => {
    try {
      const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      res.json({
        success: true,
        movie
      });
    } catch (error) {
      console.error('Error updating movie:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating movie'
      });
    }
  },

  deleteMovie: async (req, res) => {
    try {
      const movie = await Movie.findByIdAndDelete(req.params.id);

      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      res.json({
        success: true,
        message: 'Movie deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting movie:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting movie'
      });
    }
  }
};

module.exports = movieController; 