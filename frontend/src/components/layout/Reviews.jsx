import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Reviews.css';

const Reviews = () => {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Special Ed Teacher",
      avatar: "https://i.pinimg.com/736x/71/5e/2b/715e2b633187ddc5d112d222eb61e78d.jpg",
      text: "The assistive technology transforms how we evaluate and implement solutions in the classroom.",
      stars: "★★★★★",
    },
    {
      name: "Michael Chen",
      role: "Technology Coordinator",
      avatar: "https://i.pinimg.com/474x/ca/cf/05/cacf056d3112f30f8bac8d390a1ecb10.jpg",
      text: "Comprehensive evaluation tools that make decision-making easier for our district.",
      stars: "★★★★★",
    },
    {
      name: "Emma Rodriguez",
      role: "School Principal",
      avatar: "https://i.pinimg.com/474x/c1/76/65/c17665ac17cb0f62ecf04084940cfef7.jpg",
      text: "EduAbility has helped us create a more inclusive learning environment for our students.",
      stars: "★★★★★",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const autoScrollInterval = useRef(null);
  const AUTO_SCROLL_DELAY = 5000; // 5 seconds

  // Auto-scroll logic
  useEffect(() => {
    autoScrollInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, AUTO_SCROLL_DELAY);

    return () => clearInterval(autoScrollInterval.current);
  }, [reviews.length]);

  // Pause auto-scroll on hover
  const handleMouseEnter = () => {
    clearInterval(autoScrollInterval.current);
  };

  const handleMouseLeave = () => {
    autoScrollInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, AUTO_SCROLL_DELAY);
  };

  // Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  return (
    <section className="reviews-section">
      <div className="reviews-content">
        <h2>Recent Technology Reviews</h2>
        <div
          className="reviews-carousel-wrapper"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label="Reviews carousel"
        >
          <button
            className="carousel-arrow left-arrow"
            onClick={handlePrev}
            aria-label="Previous review"
          >
            <ChevronLeft />
          </button>
          <div className="reviews-carousel">
            <div
              className="reviews-grid"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                transition: 'transform 0.5s ease-in-out',
              }}
            >
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="review-card"
                  role="group"
                  aria-label={`Review by ${review.name}`}
                >
                  <div className="review-header">
                    <img
                      src={review.avatar}
                      alt={`${review.name}'s avatar`}
                      className="review-avatar"
                    />
                    <div>
                      <h4>{review.name}</h4>
                      <p className="review-role">{review.role}</p>
                      <div className="review-stars">{review.stars}</div>
                    </div>
                  </div>
                  <p className="review-text">{`“${review.text}”`}</p>
                </div>
              ))}
            </div>
          </div>
          <button
            className="carousel-arrow right-arrow"
            onClick={handleNext}
            aria-label="Next review"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="reviews-dots">
          {reviews.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleDotClick(index)}
              aria-label={`Go to review ${index + 1}`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;