import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import Button from '../common/Button';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-column">
          <h4>About Us</h4>
          <p>
            Making assistive technology accessible to all educators and learners.
          </p>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/technologies">Technologies</a></li>
            <li><a href="/compare">Compare</a></li>
            <li><a href="/resources">Resources</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            
            <li><a href="/feedback">Contact Us</a></li>
            
          </ul>
        </div>
        <div className="footer-column">
          <h4>Connect</h4>
          <div className="footer-socials">
            <a href="https://facebook.com" aria-label="Facebook">
              <Facebook className="social-icon" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter">
              <Twitter className="social-icon" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram">
              <Instagram className="social-icon" />
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 EduAbility. All rights reserved. </p>
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/about')}
          ariaLabel="Learn More"
        >
          Learn More
        </Button>
      </div>
    </footer>
  );
};

export default Footer;