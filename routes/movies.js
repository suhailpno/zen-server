const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const movieController = require('../controllers/movieController');

// Public routes
router.get('/search', movieController.searchMovies);
router.get('/', movieController.getAllMovies);
router.get('/test', async (req, res) => {
  try {
    const count = await Movie.countDocuments();
    res.json({
      success: true,
      message: 'Movies route is working',
      movieCount: count
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// OMDB routes
router.post('/import', movieController.importMovie);

// Movie details route
router.get('/:id', movieController.getMovieById);

// Protected routes (require authentication)
router.post('/', auth, movieController.createMovie);
router.put('/:id', auth, movieController.updateMovie);
router.delete('/:id', auth, movieController.deleteMovie);

module.exports = router; 