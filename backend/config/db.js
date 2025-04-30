const mongoose = require('mongoose');
const redisClient = require('../redis');

const connectDB = async () => {
  try {
    // Log the MongoDB URI for debugging (mask the password)
    const uri = process.env.MONGO_URI;
    const maskedUri = uri.replace(/:\/\/[^:]+:[^@]+@/, '://[REDACTED]:[REDACTED]@');
    console.log('Connecting to MongoDB with URI:', maskedUri);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');

    // Redis is already connected via redis.js
    await redisClient.ping(); // Ensure Redis is connected
    console.log('Redis ping successful');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;