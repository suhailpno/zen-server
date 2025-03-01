const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// Process payment
router.post('/process', auth, paymentController.processPayment);

// Get payment status
router.get('/status/:id', auth, paymentController.getPaymentStatus);

module.exports = router; 