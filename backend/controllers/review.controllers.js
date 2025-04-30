const Review = require('../models/review.models');
const mongoose = require('mongoose');

const createReview = async (req, res) => {
  const { technologyId, rating, comment } = req.body;
  const userId = req.user.userId;

  try {
    const review = new Review({
      technologyId,
      userId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('technologyId', 'name description')
      .lean();
    const populatedReviews = await Promise.all(
      reviews.map(async (review) => {
        const user = await mongoose.model('User').findOne({ _id: review.userId }, 'email').lean();
        return {
          ...review,
          userId: user ? { _id: review.userId, email: user.email } : null,
        };
      })
    );
    res.status(200).json(populatedReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('technologyId', 'name description')
      .lean();
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    const user = await mongoose.model('User').findOne({ _id: review.userId }, 'email').lean();
    res.status(200).json({
      ...review,
      userId: user ? { _id: review.userId, email: user.email } : null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.userId !== req.user.userId) { // Compare as strings
      return res.status(403).json({ message: 'Access denied' });
    }
    Object.assign(review, req.body);
    await review.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (review.userId !== req.user.userId) { // Compare as strings
      return res.status(403).json({ message: 'Access denied' });
    }
    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getAllReviews, getReviewById, updateReview, deleteReview };