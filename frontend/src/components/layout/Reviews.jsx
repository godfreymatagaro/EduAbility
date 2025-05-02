// frontend/src/components/Reviews/Reviews.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@utils/api';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const REVIEWS_PER_SET = 3; // Number of reviews to display at once

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/reviews');
        setReviews(response.data); // Fetch all reviews
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();

    // Set up auto-scrolling interval
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + REVIEWS_PER_SET >= reviews.length ? 0 : prevIndex + REVIEWS_PER_SET
      );
    }, 5000); // Change set every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [reviews.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
    exit: { y: -50, opacity: 0, transition: { duration: 0.3 } },
  };

  const currentReviews = reviews.slice(currentIndex, currentIndex + REVIEWS_PER_SET);

  return (
    <section className="reviews-section" aria-label="Recent Technology Reviews" role="region">
      <h2 className="reviews-title">Recent Technology Reviews</h2>
      {error && <p className="error-message" role="alert">{error}</p>}
      {loading ? (
        <p className="loading-message" role="alert">Loading reviews with grit...</p>
      ) : (
        <motion.div
          className="reviews-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ padding: '0 1rem' }}
        >
          <AnimatePresence>
            {currentReviews.map((review) => (
              <motion.div
                key={review._id}
                className="review-card"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="review-header">
                  <div
                    className="review-avatar"
                    aria-hidden="true"
                    style={{ background: 'linear-gradient(135deg, #6b21a8, #9333ea)' }}
                  />
                  <div>
                    <h3 className="review-author">
                      {review.userId?.email?.split('@')[0] || 'Anonymous'}
                    </h3>
                    <p className="review-role">Special Education Teacher</p>
                  </div>
                </div>
                <div className="review-content">
                  <p className="review-text">
                    "{review.comment}" <span className="review-rating">{'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)} {review.rating}/5</span>
                  </p>
                  <p className="review-impact">
                    This platform has transformed how I evaluate and implement assistive technology in my classroom!
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

export default Reviews;