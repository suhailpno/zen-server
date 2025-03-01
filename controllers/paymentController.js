const stripe = require('stripe')('dummy_stripe_key');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dummy payment intent
    const paymentIntent = {
      id: 'pi_' + Math.random().toString(36).substr(2, 9),
      amount: amount,
      currency: 'usd',
      status: 'succeeded',
      client_secret: 'dummy_secret_' + Date.now()
    };

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntent 
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment processing failed', error: error.message });
  }
};

exports.processPaypalPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    // Simulate PayPal payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dummy PayPal payment result
    const paymentResult = {
      id: 'pp_' + Math.random().toString(36).substr(2, 9),
      status: 'COMPLETED',
      amount: {
        value: amount,
        currency_code: 'USD'
      }
    };

    res.json(paymentResult);
  } catch (error) {
    res.status(500).json({ message: 'PayPal payment failed', error: error.message });
  }
};

const paymentController = {
  processPayment: async (req, res) => {
    try {
      const { bookingId, paymentMethod, paymentDetails } = req.body;

      // Validate booking exists
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Create payment record
      const payment = new Payment({
        booking: bookingId,
        user: req.user.id,
        amount: booking.totalAmount,
        method: paymentMethod,
        details: paymentDetails,
        status: 'completed'
      });

      await payment.save();

      // Update booking payment status
      booking.payment = {
        method: paymentMethod,
        details: paymentDetails,
        status: 'completed'
      };
      booking.status = 'confirmed';
      await booking.save();

      res.status(201).json({
        success: true,
        payment,
        booking
      });
    } catch (error) {
      console.error('Payment processing error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing payment'
      });
    }
  },

  getPaymentStatus: async (req, res) => {
    try {
      const payment = await Payment.findById(req.params.id)
        .populate('booking')
        .populate('user', 'name email');

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: 'Payment not found'
        });
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching payment status'
      });
    }
  }
};

module.exports = paymentController; 