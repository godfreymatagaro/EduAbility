import React, { useState } from 'react';
import { ChevronLeft, Star, X, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Reviews from './Reviews'; // Reusing Reviews.jsx
import './TechComparison.css';

const TechComparison = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTechs, setSelectedTechs] = useState([
    { id: 1, name: 'Technology 1', rating: 4.5, price: '$10-$50', reviews: 2458 },
    { id: 2, name: 'Technology 2', rating: 4.8, price: '$20-$60', reviews: 1923 },
    { id: 3, name: 'Technology 3', rating: 4.3, price: '$15-$45', reviews: 1675 },
  ]);

  const techCriteria = [
    { criterion: 'Ease of Use', ratings: [4.5, 4.8, 4.3] },
    { criterion: 'Features', ratings: [4.8, 4.5, 4.7] },
    { criterion: 'Value for Money', ratings: [4.2, 4.6, 4.1] },
    { criterion: 'Customer Support', ratings: [4.6, 4.7, 4.5] },
  ];

  const featureComparison = [
    { feature: 'Security', available: [true, true, false] },
    { feature: 'Integration', available: [true, false, true] },
    { feature: 'Support', available: [true, true, true] },
    { feature: 'User Management', available: [false, true, true] },
    { feature: 'API', available: [true, false, false] },
    { feature: 'Webhooks', available: [false, true, false] },
    { feature: 'Community', available: [true, true, true] },
  ];

  const availableTechs = [
    { id: 4, name: 'Technology 4', rating: 4.7, reviews: 1023 },
    { id: 5, name: 'Technology 5', rating: 4.2, reviews: 876 },
    { id: 6, name: 'Technology 6', rating: 4.9, reviews: 1345 },
  ];

  const handleAddTech = (tech) => {
    setSelectedTechs([...selectedTechs, tech]);
    setIsModalOpen(false);
    setSearchQuery('');
  };

  const handleRemoveTech = (id) => {
    setSelectedTechs(selectedTechs.filter((tech) => tech.id !== id));
  };

  // Framer Motion variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <section className="tech-comparison-section">
      <div className="tech-comparison-container">
        {/* Header */}
        <motion.div
          className="comparison-header"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h1>Technology Comparison</h1>
          <p>Compare features, pricing, and ratings across different technologies</p>
          <a href="/technologies" className="back-link">
            <ChevronLeft className="back-icon" />
            Back to Technologies
          </a>
        </motion.div>

        {/* Selected Technologies */}
        <motion.div
          className="selected-techs"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2>Selected Technologies</h2>
          <div className="tech-list">
            {selectedTechs.map((tech) => (
              <div key={tech.id} className="tech-item">
                <span>{tech.name}</span>
                <button
                  className="remove-tech"
                  onClick={() => handleRemoveTech(tech.id)}
                >
                  <X className="remove-icon" />
                </button>
              </div>
            ))}
            <button
              className="add-more-button"
              onClick={() => setIsModalOpen(true)}
            >
              Add More +
            </button>
          </div>
        </motion.div>

        {/* Summary Section */}
        <motion.div
          className="summary-section"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          {selectedTechs.map((tech, index) => (
            <motion.div
              key={tech.id}
              className="summary-card"
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
            >
              <h3>{tech.name}</h3>
              <div className="summary-details">
                <p>
                  <strong>Average Rating:</strong> {tech.rating} <Star className="star-icon" />
                </p>
                <p>
                  <strong>Price Range:</strong> {tech.price}
                </p>
                <p>
                  <strong>Total Reviews:</strong> {tech.reviews}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Comparison Table */}
        <motion.div
          className="detailed-comparison"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2>Detailed Comparison</h2>
          <div className="table-wrapper">
            <table className="comparison-table detailed-table">
              <thead>
                <tr>
                  <th>Criteria</th>
                  {selectedTechs.map((tech) => (
                    <th key={tech.id}>{tech.name}</th>
                  ))}
                  <th>Average</th>
                </tr>
              </thead>
              <tbody>
                {techCriteria.map((criteria, index) => (
                  <tr key={index}>
                    <td>{criteria.criterion}</td>
                    {criteria.ratings.map((rating, i) => (
                      <td key={i}>
                        {rating} <Star className="star-icon" />
                      </td>
                    ))}
                    <td>
                      {(
                        criteria.ratings.reduce((a, b) => a + b, 0) /
                        criteria.ratings.length
                      ).toFixed(1)}{' '}
                      <Star className="star-icon" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Feature Comparison Table */}
        <motion.div
          className="feature-comparison"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2>Feature Comparison</h2>
          <div className="table-wrapper">
            <table className="comparison-table feature-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  {selectedTechs.map((tech) => (
                    <th key={tech.id}>{tech.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((feature, index) => (
                  <tr key={index}>
                    <td>{feature.feature}</td>
                    {feature.available.map((avail, i) => (
                      <td key={i}>
                        <span className={`dot ${avail ? 'available' : 'unavailable'}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* User Reviews Section */}
        <motion.div
          className="reviews-section"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2>User Reviews</h2>
          <Reviews techs={selectedTechs} />
        </motion.div>

        {/* Add Technology Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Add Technology</h3>
              <div className="search-bar">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="tech-options">
                {availableTechs
                  .filter((tech) =>
                    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((tech) => (
                    <motion.div
                      key={tech.id}
                      className={`tech-option ${
                        selectedTechs.some((t) => t.id === tech.id) ? 'selected' : ''
                      }`}
                      variants={cardVariants}
                      initial="rest"
                      whileHover="hover"
                    >
                      <div className="tech-info">
                        <h4>{tech.name}</h4>
                        <p>
                          {tech.rating} <Star className="star-icon" /> •{' '}
                          {tech.reviews} reviews
                        </p>
                      </div>
                      <button
                        className="add-tech-button"
                        onClick={() => handleAddTech(tech)}
                        disabled={selectedTechs.some((t) => t.id === tech.id)}
                      >
                        Add
                      </button>
                    </motion.div>
                  ))}
              </div>
              <div className="modal-footer">
                <p>Selected: {selectedTechs.length} technologies</p>
                <div className="modal-actions">
                  <button
                    className="cancel-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="add-selected-button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Add Selected
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechComparison;