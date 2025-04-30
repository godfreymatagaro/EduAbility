const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const reviewRoutes = require('./routes/review.routes');
const techRoutes = require('./routes/tech.routes');
const searchRoutes = require('./routes/search.routes');
const cors = require('cors');
const { createClient } = require('redis');

// Load environment variables in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Set default environment variables if not provided
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://eduability_admin:HuBp2i0qOID8QWI1@edu-db.kx3z8va.mongodb.net/?retryWrites=true&w=majority&appName=edu-db';
const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const JWT_SECRET = process.env.JWT_SECRET || '8I4P4GMHl8/vFubeqLupgbtO9/8i16GJZp5PzSBJjIY=';
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_BEco3M4D_Bnhuw3d7WcdZAz9rfK2k289y';
const FROM_EMAIL = process.env.FROM_EMAIL || 'info@rackssoftwares.co.ke';
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173', // Vite frontend (development)
  'https://edu-ability.vercel.app', // Production frontend
];

// Log environment variables for debugging
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGO_URI:', MONGO_URI.replace(/:\/\/[^:]+:[^@]+@/, '://[REDACTED]:[REDACTED]@'));
console.log('REDIS_URL:', REDIS_URL);
console.log('JWT_SECRET:', JWT_SECRET ? 'Set' : 'Not set');
console.log('RESEND_API_KEY:', RESEND_API_KEY ? 'Set' : 'Not set');
console.log('FROM_EMAIL:', FROM_EMAIL);
console.log('PORT:', PORT);
console.log('UPLOAD_DIR:', UPLOAD_DIR);

const app = express();

// CORS Middleware Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
    credentials: true, // Allow credentials (if needed for cookies or auth)
  })
);

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
// Comment out file uploads for serverless environment
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize Redis client
let redisClient;
(async () => {
  try {
    redisClient = createClient({
      url: REDIS_URL,
    });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisClient.on('connect', () => console.log('Redis Client Connected'));
    redisClient.on('ready', () => console.log('Redis Client Ready'));

    await redisClient.connect();
  } catch (err) {
    console.error('Failed to connect to Redis:', err);
  }
})();

// Make redisClient available to routes via app.locals
app.locals.redisClient = redisClient;

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/technologies', techRoutes);
app.use('/api/search', searchRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS policy: Origin not allowed' });
  }
  res.status(500).json({ message: 'Something went wrong!' });
});

// Export the app for Vercel
module.exports = app;

// For local development, you can still run the server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}