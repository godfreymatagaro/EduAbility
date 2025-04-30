const Review = require('../models/review.models');
const Technology = require('../models/technology.models');
const redisClient = require('../redis');

const getReviewsByTech = async (req, res) => {
  const { techId } = req.params;
  const cacheKey = `reviews:tech:${techId}`;

  try {
    // Check Redis cache
    const cachedReviews = await redisClient.get(cacheKey);
    if (cachedReviews) {
      return res.status(200).json(JSON.parse(cachedReviews));
    }

    // Fetch from MongoDB
    const reviews = await Review.find({ technologyId: techId })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });

    // Cache the result
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(reviews));
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createReview = async (req, res) => {
  const { rating, feedback, tags, technologyId } = req.body;
  const userId = req.user.userId;

  try {
    const review = new Review({
      rating,
      feedback,
      tags,
      technologyId,
      userId,
    });

    await review.save();

    // Update technology rating and reviews count
    const reviews = await Review.find({ technologyId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const tech = await Technology.findOne({ techId: technologyId });
    tech.rating = avgRating;
    tech.reviewsCount = reviews.length;
    await tech.save();

    // Invalidate cache
    await redisClient.del(`reviews:tech:${technologyId}`);
    await redisClient.del(`tech:summary:${technologyId}`);

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findOne({ reviewId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (req.user.role !== 'admin' && review.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Review.deleteOne({ reviewId });

    // Update technology rating and reviews count
    const reviews = await Review.find({ technologyId: review.technologyId });
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    const tech = await Technology.findOne({ techId: review.technologyId });
    tech.rating = avgRating;
    tech.reviewsCount = reviews.length;
    await tech.save();

    // Invalidate cache
    await redisClient.del(`reviews:tech:${review.technologyId}`);
    await redisClient.del(`tech:summary:${review.technologyId}`);

    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReviewsByTech, createReview, deleteReview };