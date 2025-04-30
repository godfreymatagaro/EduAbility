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

// Skip loading .env file for now
// dotenv.config();

// Hardcode environment variables
process.env.MONGO_URI = 'mongodb+srv://godyracks:2nVVtC60SwhDhDHB@cluster01.pt7zzoi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster01';
process.env.REDIS_URL = 'redis://127.0.0.1:6379';
process.env.JWT_SECRET = '8I4P4GMHl8/vFubeqLupgbtO9/8i16GJZp5PzSBJjIY=';
process.env.RESEND_API_KEY = 're_BEco3M4D_Bnhuw3d7WcdZAz9rfK2k289y';
process.env.FROM_EMAIL = 'info@rackssoftwares.co.ke';
process.env.PORT = '3000';
process.env.UPLOAD_DIR = './uploads';

// Log hardcoded environment variables for debugging
console.log('Hardcoded Environment Variables:');
console.log('MONGO_URI:', process.env.MONGO_URI.replace(/:\/\/[^:]+:[^@]+@/, '://[REDACTED]:[REDACTED]@'));
console.log('REDIS_URL:', process.env.REDIS_URL);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Set' : 'Not set');
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
console.log('PORT:', process.env.PORT);
console.log('UPLOAD_DIR:', process.env.UPLOAD_DIR);

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/technologies', techRoutes);
app.use('/api/search', searchRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});