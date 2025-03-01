const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

console.log('Setting up auth routes');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth router is working' });
});

// Log middleware for debugging
router.use((req, res, next) => {
  console.log('Auth route accessed:', {
    method: req.method,
    path: req.path,
    body: req.body
  });
  next();
});

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Password reset routes
router.post('/forgot-password', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

router.get('/me', auth, authController.getMe);

module.exports = router; 