require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: ['https://zen-clients.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes setup
const setupRoutes = () => {
  // Static files handling
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  app.use(express.static(publicDir));
  
  // Handle missing static files
  app.get(['/favicon.ico', '/logo192.png', '/logo512.png', '/manifest.json'], (req, res) => {
    res.status(204).send();
  });

  // API Routes
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/movies', require('./routes/movies'));
  app.use('/api/showtimes', require('./routes/showtimes'));
  app.use('/api/bookings', require('./routes/bookings'));
  app.use('/api/payments', require('./routes/payments'));

  // Error handling
  app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  });
};

// Server startup function
const startServer = async (port = PORT) => {
  try {
    // Connect to MongoDB with all options explicitly set
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority',
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log('Connected to MongoDB successfully');

    // Setup routes
    setupRoutes();

    // Start server
    const server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}`);
        server.close();
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Retry connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => startServer(port), 5000);
  }
};

// Start the server
startServer();

// Handle process termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during app termination:', err);
    process.exit(1);
  }
});

module.exports = app; // For testing purposes 
