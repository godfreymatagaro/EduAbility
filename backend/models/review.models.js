const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const reviewSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    required: true,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
    index: true, // Index for tag-based filtering
  },
  technologyId: {
    type: String,
    ref: 'Technology',
    required: true,
  },
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for efficient querying by technology and date
reviewSchema.index({ technologyId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);