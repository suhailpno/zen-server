const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// All booking routes should be protected
router.use(auth);

// Create a new booking
router.post('/', bookingController.createBooking);

// Get user's bookings
router.get('/my-bookings', bookingController.getMyBookings);

// Validate promo code
router.post('/validate-promo', bookingController.validatePromo);

// Refund a booking
router.post('/:id/refund', bookingController.refundBooking);

module.exports = router; 