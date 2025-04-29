import React, { useState, useRef, useEffect } from 'react';
import { Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FeedbackForm.css';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ratingRefs = useRef([]);
  const feedbackRef = useRef(null);
  const submitButtonRef = useRef(null);

  const handleRating = (value) => {
    setRating(value);
    setError('');
    ratingRefs.current[value - 1]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Please provide your feedback.');
      feedbackRef.current?.focus();
      return;
    }
    if (rating === 0) {
      setError('Please select a rating.');
      ratingRefs.current[0]?.focus();
      return;
    }
    // Simulate form submission
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setFeedback('');
      setError('');
      ratingRefs.current[0]?.focus();
    }, 3000);
  };

  useEffect(() => {
    ratingRefs.current[0]?.focus();
  }, []);

  const messageVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <section className="feedback-section">
      <AnimatePresence>
        {submitted && (
          <motion.div
            className="submission-message"
            variants={messageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
            aria-live="polite"
          >
            Thank you for your feedback! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      <div className="feedback-form-container">
        <h2 className="feedback-form-title">Help Us Improve</h2>
        <form onSubmit={handleSubmit}>
          {/* Rating Section */}
          <div className="rating-section">
            <label htmlFor="rating" className="rating-label">
              How would you rate your experience
            </label>
            <div className="rating-stars" role="radiogroup" id="rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  ref={(el) => (ratingRefs.current[value - 1] = el)}
                  onClick={() => handleRating(value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleRating(value);
                      e.preventDefault();
                    }
                  }}
                  aria-label={`Rate ${value} out of 5 stars`}
                  aria-checked={rating === value}
                  role="radio"
                  className={`rating-star ${rating === value ? 'selected' : ''}`}
                  tabIndex={0}
                >
                  <Star
                    className={`star-icon ${
                      value <= rating ? 'selected' : 'unselected'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Textarea */}
          <div className="feedback-section">
            <label htmlFor="feedback" className="feedback-label">
              Your feedback
            </label>
            <textarea
              id="feedback"
              ref={feedbackRef}
              value={feedback}
              onChange={(e) => {
                setFeedback(e.target.value);
                setError('');
              }}
              placeholder="Share your thoughts with us..."
              className="feedback-textarea"
              aria-label="Your feedback"
              aria-describedby="error-message"
              required
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  id="error-message"
                  className="error-message"
                  aria-live="assertive"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            ref={submitButtonRef}
            className="submit-button"
            aria-label="Send feedback"
          >
            Send Feedback
          </button>
        </form>
      </div>
    </section>
  );
};

export default FeedbackForm;