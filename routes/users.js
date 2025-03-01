const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/:id/stats', auth, userController.getUserStats);

module.exports = router; 