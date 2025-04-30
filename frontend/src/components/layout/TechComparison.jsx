import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Star, X, Search, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Reviews from './Reviews';
import './TechComparison.css';

// Determine the API URL based on the environment
const API_URL = import.meta.env.NODE_ENV === 'production'
  ? import.meta.env.VITE_API_PROD_BACKEND_URL
  : import.meta.env.VITE_API_DEV_BACKEND_URL;

const TechComparison = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [availableTechs, setAvailableTechs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const addMoreButtonRef = useRef(null);
  const modalRef = useRef(null);

  // Hardcoded JWT token (you may need to update this)
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzU1N2U4Yi0wMmYzLTQyYmQtYTkwNi1jZmU2NDk5NzdkMGYiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDU5OTEzNTcsImV4cCI6MTc0NjA3Nzc1N30.EFnagJsRqlnab0znRF1b6E6UladFwjubZCCKIm0Vtxo';

  // Hardcoded initial selected tech IDs (replace with user selection in the future)
  const initialSelectedTechIds = [
    '6811b367f5b1a1d4988f30be',
    '6811b85c3d617c1450cbb912',
    // Add a third ID if available after testing
  ];

  // Fetch technologies on component mount
  useEffect(() => {
    const fetchTechnologies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/technologies`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch technologies: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched Technologies:', data); // Debug log

        // Ensure data is an array
        const techs = Array.isArray(data) ? data : [];
        setTechnologies(techs);

        // Set selected technologies based on initialSelectedTechIds
        const selected = techs.filter((tech) => initialSelectedTechIds.includes(tech._id));
        setSelectedTechs(selected);

        // Set available technologies (exclude selected ones)
        const available = techs.filter((tech) => !initialSelectedTechIds.includes(tech._id));
        setAvailableTechs(available);
      } catch (err) {
        console.error('Error fetching technologies:', err);
        setError(err.message);
        setTechnologies([]);
        setSelectedTechs([]);
        setAvailableTechs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  // Criteria for comparison based on coreVitals
  const techCriteria = [
    { criterion: 'Ease of Use', ratings: selectedTechs.map((tech) => tech.coreVitals?.easeOfUse || 0) },
    { criterion: 'Features', ratings: selectedTechs.map((tech) => tech.coreVitals?.featuresRating || 0) },
    { criterion: 'Value for Money', ratings: selectedTechs.map((tech) => tech.coreVitals?.valueForMoney || 0) },
    { criterion: 'Customer Support', ratings: selectedTechs.map((tech) => tech.coreVitals?.customerSupport || 0) },
  ];

  // Feature comparison based on featureComparison
  const featureComparison = [
    { feature: 'Security', available: selectedTechs.map((tech) => tech.featureComparison?.security || false) },
    { feature: 'Integration', available: selectedTechs.map((tech) => tech.featureComparison?.integration || false) },
    { feature: 'Support', available: selectedTechs.map((tech) => tech.featureComparison?.support || false) },
    { feature: 'User Management', available: selectedTechs.map((tech) => tech.featureComparison?.userManagement || false) },
    { feature: 'API', available: selectedTechs.map((tech) => tech.featureComparison?.api || false) },
    { feature: 'Webhooks', available: selectedTechs.map((tech) => tech.featureComparison?.webhooks || false) },
    { feature: 'Community', available: selectedTechs.map((tech) => tech.featureComparison?.community || false) },
  ];

  // Add Toast Notification
  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // Check for Badges
  useEffect(() => {
    if (selectedTechs.length >= 3 && !badges.includes('explorer')) {
      setBadges((prev) => [...prev, 'explorer']);
      addToast('You’ve earned the Explorer Badge! 🏆');
    }
  }, [selectedTechs, badges]);

  const handleAddTech = (tech) => {
    if (selectedTechs.length >= 5) {
      addToast('Maximum 5 technologies can be compared!');
      return;
    }
    setSelectedTechs([...selectedTechs, tech]);
    setAvailableTechs(availableTechs.filter((t) => t._id !== tech._id));
    setIsModalOpen(false);
    setSearchQuery('');
    addToast('Technology added! 🎉');
  };

  const handleRemoveTech = (id) => {
    const removedTech = selectedTechs.find((tech) => tech._id === id);
    setSelectedTechs(selectedTechs.filter((tech) => tech._id !== id));
    setAvailableTechs([...availableTechs, removedTech]);
    addToast('Technology removed!');
  };

  // Modal Focus Management
  useEffect(() => {
    if (isModalOpen) {
      modalRef.current?.focus();
    } else {
      addMoreButtonRef.current?.focus();
    }
  }, [isModalOpen]);

  // Keyboard Navigation for Modal Close
  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
    }
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

  const toastVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <section className="tech-comparison-section">
      {/* Toast Notifications */}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className="toast"
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="alert"
              aria-live="polite"
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="tech-comparison-container">
        {/* Progress Indicator */}
        <motion.div
          className="progress-section"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <p>
            You’ve compared {selectedTechs.length} out of 5 technologies!
          </p>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${(selectedTechs.length / 5) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          {badges.length > 0 && (
            <div className="badges">
              {badges.includes('explorer') && (
                <div className="badge" aria-label="Explorer Badge">
                  <Award className="badge-icon" />
                  <span>Explorer</span>
                </div>
              )}
            </div>
          )}
        </motion.div>

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
              <motion.div
                key={tech._id}
                className="tech-item"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span>{tech.name}</span>
                <button
                  className="remove-tech"
                  onClick={() => handleRemoveTech(tech._id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRemoveTech(tech._id)}
                  aria-label={`Remove ${tech.name}`}
                >
                  <X className="remove-icon" />
                </button>
              </motion.div>
            ))}
            <button
              ref={addMoreButtonRef}
              className="add-more-button"
              onClick={() => setIsModalOpen(true)}
              onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
              tabIndex={0}
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
          {selectedTechs.map((tech) => (
            <motion.div
              key={tech._id}
              className="summary-card"
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              tabIndex={0}
              aria-label={`Summary for ${tech.name}: Rating ${tech.coreVitals?.featuresRating || 'N/A'}, Cost ${tech.cost || 'N/A'}`}
            >
              <h3>{tech.name}</h3>
              <div className="summary-details">
                <p>
                  <strong>Rating:</strong> {tech.coreVitals?.featuresRating || 'N/A'} <Star className="star-icon" />
                </p>
                <p>
                  <strong>Cost:</strong> {tech.cost || 'N/A'}
                </p>
                <p>
                  <strong>Category:</strong> {tech.category || 'N/A'}
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
                  <th scope="col">Criteria</th>
                  {selectedTechs.map((tech) => (
                    <th key={tech._id} scope="col">{tech.name}</th>
                  ))}
                  <th scope="col">Average</th>
                </tr>
              </thead>
              <tbody>
                {techCriteria.map((criteria, index) => (
                  <tr key={index}>
                    <td>{criteria.criterion}</td>
                    {criteria.ratings.map((rating, i) => (
                      <td key={i}>
                        {rating || 'N/A'} {rating ? <Star className="star-icon" /> : null}
                      </td>
                    ))}
                    <td>
                      {criteria.ratings.every((r) => r)
                        ? (criteria.ratings.reduce((a, b) => a + b, 0) / criteria.ratings.length).toFixed(1)
                        : 'N/A'}{' '}
                      {criteria.ratings.every((r) => r) ? <Star className="star-icon" /> : null}
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
                  <th scope="col">Feature</th>
                  {selectedTechs.map((tech) => (
                    <th key={tech._id} scope="col">{tech.name}</th>
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
          <div className="modal-overlay" onKeyDown={handleModalKeyDown}>
            <motion.div
              className="modal-content"
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              role="dialog"
              aria-labelledby="modal-title"
              tabIndex={0}
            >
              <h3 id="modal-title">Add Technology</h3>
              <div className="search-bar">
                <Search className="search-icon" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search technologies"
                />
              </div>
              <div className="tech-options">
                {availableTechs
                  .filter((tech) =>
                    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((tech) => (
                    <motion.div
                      key={tech._id}
                      className={`tech-option ${
                        selectedTechs.some((t) => t._id === tech._id) ? 'selected' : ''
                      }`}
                      variants={cardVariants}
                      initial="rest"
                      whileHover="hover"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && !selectedTechs.some((t) => t._id === tech._id) && handleAddTech(tech)
                      }
                    >
                      <div className="tech-info">
                        <h4>{tech.name}</h4>
                        <p>
                          {tech.coreVitals?.featuresRating || 'N/A'} <Star className="star-icon" /> •{' '}
                          {tech.category || 'N/A'}
                        </p>
                      </div>
                      <button
                        className="add-tech-button"
                        onClick={() => handleAddTech(tech)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTech(tech)}
                        disabled={selectedTechs.some((t) => t._id === tech._id)}
                        aria-label={`Add ${tech.name}`}
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
                    onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(false)}
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    className="add-selected-button"
                    onClick={() => setIsModalOpen(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(false)}
                    aria-label="Add selected technologies"
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