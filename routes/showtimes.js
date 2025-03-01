const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const showtimeController = require('../controllers/showtimeController');

// Get all showtimes or filter by movie and date
router.get('/', auth, showtimeController.getShowtimes);

// Get specific showtime by ID
router.get('/:id', auth, showtimeController.getShowtimeById);

module.exports = router; 