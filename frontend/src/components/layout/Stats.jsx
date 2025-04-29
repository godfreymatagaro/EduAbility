import React from 'react';
import './Stats.css';

const Stats = () => {
  return (
    <section className="stats-section">
      <div className="stats-content">
        <div className="stats-item">
          <h3>500+</h3>
          <p>Technologies Evaluated</p>
        </div>
        <div className="stats-item">
          <h3>10K+</h3>
          <p>Educator Reviews</p>
        </div>
        <div className="stats-item">
          <h3>200+</h3>
          <p>Partner Schools</p>
        </div>
        <div className="stats-item">
          <h3>50K+</h3>
          <p>Students Impacted</p>
        </div>
      </div>
    </section>
  );
};

export default Stats;