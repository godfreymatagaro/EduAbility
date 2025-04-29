import React from 'react';
import './Reviews.css';

const Reviews = () => {
  return (
    <section className="reviews-section">
      <div className="reviews-content">
        <h2>Recent Technology Reviews</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <div className="review-header">
              <img src="/path/to/avatar1.png" alt="Sarah Johnson" className="review-avatar" />
              <div>
                <h4>Sarah Johnson</h4>
                <p className="review-role">Special Ed Teacher</p>
                <div className="review-stars">★★★★★</div>
              </div>
            </div>
            <p className="review-text">
              “The assistive technology transforms how we evaluate and implement solutions in the classroom.”
            </p>
          </div>
          <div className="review-card">
            <div className="review-header">
              <img src="/path/to/avatar2.png" alt="Michael Chen" className="review-avatar" />
              <div>
                <h4>Michael Chen</h4>
                <p className="review-role">Technology Coordinator</p>
                <div className="review-stars">★★★★★</div>
              </div>
            </div>
            <p className="review-text">
              “Comprehensive evaluation tools that make decision-making easier for our district.”
            </p>
          </div>
          <div className="review-card">
            <div className="review-header">
              <img src="/path/to/avatar3.png" alt="Emma Rodriguez" className="review-avatar" />
              <div>
                <h4>Emma Rodriguez</h4>
                <p className="review-role">School Principal</p>
                <div className="review-stars">★★★★★</div>
              </div>
            </div>
            <p className="review-text">
              “EduAbility has helped us create a more inclusive learning environment for our students.”
            </p>
          </div>
        </div>
        <div className="reviews-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </section>
  );
};

export default Reviews;