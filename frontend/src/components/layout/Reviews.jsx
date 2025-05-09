import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Linkedin, Github } from 'lucide-react';
import api from '@utils/api';
import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true); // Toggle via app theme context
  const REVIEWS_PER_SET = 3; // Number of reviews to display at once

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/reviews');
        console.log('Reviews API response:', response.data); // Debug API response
        setReviews(response.data); // Fetch all reviews
      } catch (err) {
        setError('Failed to load reviews. Please try again.');
        console.error('Reviews fetch error:', err);
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
    <section className={`reviews-section ${darkMode ? 'dark' : ''}`} aria-label="Recent Technology Reviews" role="region">
      <h2 className="reviews-title">Recent Technology Reviews</h2>
      {error && <p className="error-message" role="alert">{error}</p>}
      {loading ? (
        <p className="loading-message" role="alert">Loading reviews...</p>
      ) : (
        <motion.div
          className="reviews-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ padding: '0 1rem' }}
        >
          <AnimatePresence>
            {currentReviews.map((review) => {
              // Debug socialLinks
              console.log(`Review ${review._id} socialLinks:`, review.userId?.socialLinks);
              const hasSocialLinks = review.userId?.socialLinks && (
                review.userId.socialLinks.twitter ||
                review.userId.socialLinks.linkedin ||
                review.userId.socialLinks.github
              );

              return (
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
                  </div>
                  {hasSocialLinks ? (
                    <div className="social-links">
                      {review.userId.socialLinks.twitter && (
                        <a
                          href={review.userId.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          aria-label="Twitter profile"
                        >
                          <Twitter size={20} />
                        </a>
                      )}
                      {review.userId.socialLinks.linkedin && (
                        <a
                          href={review.userId.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          aria-label="LinkedIn profile"
                        >
                          <Linkedin size={20} />
                        </a>
                      )}
                      {review.userId.socialLinks.github && (
                        <a
                          href={review.userId.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-icon"
                          aria-label="GitHub profile"
                        >
                          <Github size={20} />
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="no-social-links">No social links available</p>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
};

export default Reviews;