const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

console.log('Env:', {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI ? 'MongoDB URI is set' : 'MongoDB URI is not set',
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  NODE_ENV: process.env.NODE_ENV
});

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://tamid-blog-frontend.onrender.com',
    'https://tamid-blog-1-z3wm.onrender.com',
    'https://tamid-blog-2.onrender.com'  // Add your new frontend domain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS before other middleware
app.use(cors(corsOptions));

// Add CORS headers middleware as a backup
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://tamid-blog-frontend.onrender.com',
    'https://tamid-blog-1-z3wm.onrender.com',
    'https://tamid-blog-2.onrender.com'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

app.use(express.json());

// API routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// MongoDB connection with retry logic and max retries
const MAX_RETRIES = 5;
let retryCount = 0;

const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true
    });
    console.log('Connected to MongoDB');
    retryCount = 0; // Reset retry count on successful connection
  } catch (err) {
    console.error('MongoDB connection error:', err);
    retryCount++;

    if (retryCount >= MAX_RETRIES) {
      console.error('Max retries reached. Exiting process...');
      process.exit(1);
    }

    console.log(`Retrying connection in 5 seconds... (Attempt ${retryCount}/${MAX_RETRIES})`);
    setTimeout(connectWithRetry, 5000);
  }
};

// Start server with graceful shutdown
const PORT = process.env.PORT || 5001; // Match the port in Dockerfile
const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

// Graceful shutdown handling
const gracefulShutdown = async () => {
  console.log('Received shutdown signal. Closing connections...');

  server.close(async () => {
    console.log('HTTP server closed');
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

module.exports = app;
