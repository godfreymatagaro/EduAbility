import React from 'react';
import { Search, Star, SlidersHorizontal } from 'lucide-react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import './AD.css';

const AD = () => {
  const navigate = useNavigate();

  return (
    <section className="ad-section">
      <div className="ad-content">
        <h2>Discover Assistive Technologies</h2>
        <div className="ad-cards">
          <div className="ad-card">
            <Search className="ad-icon" />
            <h3>Easy Search</h3>
            <p>Find the perfect tools with our powerful search features</p>
          </div>
          <div className="ad-card">
            <Star className="ad-icon" />
            <h3>Verified Reviews</h3>
            <p>Real feedback from educators and specialists</p>
          </div>
          <div className="ad-card">
            <SlidersHorizontal className="ad-icon" />
            <h3>Compare Tools</h3>
            <p>Side-by-side comparison of features and pricing</p>
          </div>
        </div>
        <Button
          variant="compare"
          size="lg"
          onClick={() => navigate('/technologies')}
          ariaLabel="Explore Technologies"
        >
          Explore Technologies
        </Button>
      </div>
    </section>
  );
};

export default AD;