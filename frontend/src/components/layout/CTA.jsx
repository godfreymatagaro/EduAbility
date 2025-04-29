import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import './CTA.css';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>Ready to Transform Your Educational Technology?</h2>
        <p>Join thousands of educators who are making data-driven decisions for inclusive education.</p>
        <div className="cta-buttons">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/technologies')}
            ariaLabel="Browse Technologies"
          >
            Browse Technologies
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/feedback')}
            ariaLabel="Contact Us"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;