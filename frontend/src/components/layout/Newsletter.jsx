import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    if (email.trim()) {
      alert(`Subscribed with email: ${email}`);
      setEmail('');
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <h2 className="newsletter-heading">Stay Updated</h2>
        <p className="newsletter-subheading">
          Get the latest updates on new assistive technology and educational resources
        </p>
        <div className="newsletter-form">
          <input
            type="email"
            className="newsletter-input"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          <button
            className="newsletter-button"
            onClick={handleSubmit}
            aria-label="Subscribe to newsletter"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;