// frontend/src/components/Reviews/Reviews.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@utils/api';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/reviews');
        setReviews(response.data.slice(0, 3)); // Limit to 3 recent reviews
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

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
  };

  return (
    <section className="reviews-section" aria-label="Recent Technology Reviews">
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
          style={{ padding: '0 1rem' }} // Inline padding to control internal spacing
        >
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                className="review-card"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="review-header">
                  <div
                    className="review-avatar"
                    aria-hidden="true"
                    style={{ background: 'linear-gradient(135deg, #6b21a8, #9333ea)' }} // Matching Figma purple gradient
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