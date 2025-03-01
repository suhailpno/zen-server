const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

const bookingController = {
  createBooking: async (req, res) => {
    try {
      console.log('User from auth middleware:', req.user); // Debug log
      console.log('Request body:', req.body); // Debug log

      const {
        movieId,
        showtime,
        seats,
        totalAmount,
        paymentMethod,
        paymentDetails
      } = req.body;

      // Validate required fields
      if (!movieId || !showtime || !seats || !totalAmount || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Missing required booking information'
        });
      }

      // Validate movie exists
      const movie = await Movie.findById(movieId);
      if (!movie) {
        return res.status(404).json({
          success: false,
          message: 'Movie not found'
        });
      }

      // Create booking
      const booking = new Booking({
        user: req.user._id, // This should now be correctly set
        movie: movieId,
        showtime: new Date(showtime),
        seats,
        totalAmount,
        payment: {
          method: paymentMethod,
          details: paymentDetails,
          status: 'completed'
        },
        status: 'confirmed',
        bookingReference: Math.random().toString(36).substr(2, 9).toUpperCase()
      });

      await booking.save();
      await booking.populate('movie', 'title poster');

      res.status(201).json({
        success: true,
        booking
      });

    } catch (error) {
      console.error('Booking creation error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error creating booking'
      });
    }
  },

  getMyBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user._id })
        .populate('movie', 'title poster')
        .sort('-createdAt');

      res.json({
        success: true,
        bookings
      });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching bookings'
      });
    }
  },

  validatePromo: async (req, res) => {
    try {
      const { code } = req.body;
      
      const promoCodes = {
        'MOVIE10': 10,
        'MOVIE20': 20,
        'FIRST50': 50
      };

      if (promoCodes[code]) {
        res.json({
          success: true,
          discount: promoCodes[code]
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid promo code'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error validating promo code'
      });
    }
  },

  refundBooking: async (req, res) => {
    try {
      const booking = await Booking.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check if show time is more than 2 hours away
      const showTime = new Date(booking.showtime);
      const now = new Date();
      const hoursUntilShow = (showTime - now) / (1000 * 60 * 60);

      if (hoursUntilShow <= 2) {
        return res.status(400).json({
          success: false,
          message: 'Refunds are only available up to 2 hours before show time'
        });
      }

      // Process refund
      booking.status = 'refunded';
      booking.payment.status = 'refunded';
      await booking.save();

      res.json({
        success: true,
        message: 'Refund processed successfully'
      });

    } catch (error) {
      console.error('Refund error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing refund'
      });
    }
  }
};

module.exports = bookingController; 