import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, Star, X, Search, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './TechComparison.css';

// Determine the API URL based on the environment
const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_PROD_BACKEND_URL
    : import.meta.env.VITE_API_DEV_BACKEND_URL;

const TechComparison = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [availableTechs, setAvailableTechs] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortCriterion, setSortCriterion] = useState('');
  const addMoreButtonRef = useRef(null);
  const modalRef = useRef(null);
  const firstFocusableElementRef = useRef(null);
  const lastFocusableElementRef = useRef(null);

  // Fetch technologies and initialize selectedTechs from localStorage (simulated Redis cache)
  useEffect(() => {
    const fetchTechnologies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/technologies`);
        if (!response.ok) {
          throw new Error(`Failed to fetch technologies: ${response.status} ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        const data = await response.json();
        const techs = Array.isArray(data) ? data : [];
        setTechnologies(techs);

        // Load selected technologies from localStorage (simulated Redis cache)
        const cachedTechs = JSON.parse(localStorage.getItem('comparisonTechs')) || [];
        setSelectedTechs(cachedTechs);

        // Update available technologies (exclude selected ones)
        const available = techs.filter((tech) => !cachedTechs.some(t => t._id === tech._id));
        setAvailableTechs(available);
      } catch (err) {
        console.error('Error fetching technologies:', err);
        setError(err.message);
        setTechnologies([]);
        setAvailableTechs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  // Fetch search results using /api/technology/search
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/technologies/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch search results: ${response.status} ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        const data = await response.json();
        const searchResults = Array.isArray(data) ? data : [];
        // Filter out already selected technologies
        const filteredResults = searchResults.filter(
          tech => !selectedTechs.some(t => t._id === tech._id)
        );
        setAvailableTechs(filteredResults);
      } catch (err) {
        setError(err.message);
        setAvailableTechs([]);
      } finally {
        setLoading(false);
      }
    } else {
      // Reset to all available techs if search query is empty
      const available = technologies.filter(
        tech => !selectedTechs.some(t => t._id === tech._id)
      );
      setAvailableTechs(available);
    }
  };

  // Criteria for comparison based on coreVitals
  const techCriteriaBase = [
    { criterion: 'Ease of Use', ratings: selectedTechs.map((tech) => tech.coreVitals?.easeOfUse || 0) },
    { criterion: 'Features', ratings: selectedTechs.map((tech) => tech.coreVitals?.featuresRating || 0) },
    { criterion: 'Value for Money', ratings: selectedTechs.map((tech) => tech.coreVitals?.valueForMoney || 0) },
    { criterion: 'Customer Support', ratings: selectedTechs.map((tech) => tech.coreVitals?.customerSupport || 0) },
  ];

  // Sort criteria if a sort option is selected
  const techCriteria = sortCriterion
    ? [...techCriteriaBase].sort((a, b) => {
        const avgA = a.ratings.every(r => r) ? a.ratings.reduce((sum, r) => sum + r, 0) / a.ratings.length : 0;
        const avgB = b.ratings.every(r => r) ? b.ratings.reduce((sum, r) => sum + r, 0) / b.ratings.length : 0;
        return avgB - avgA; // Sort descending by average
      })
    : techCriteriaBase;

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

  // Calculate Summary Metrics
  const averageRating = selectedTechs.length > 0
    ? (selectedTechs.reduce((sum, tech) => sum + (tech.coreVitals?.featuresRating || 0), 0) / selectedTechs.length).toFixed(1)
    : 'N/A';
  const priceRange = selectedTechs.length > 0
    ? selectedTechs.map(tech => tech.cost || '$0').sort((a, b) => parseFloat(a.replace('$', '')) - parseFloat(b.replace('$', ''))).join(' - ')
    : '$0';
  const totalReviews = selectedTechs.length > 0
    ? selectedTechs.reduce((sum, tech) => sum + (tech.reviews?.length || 0), 0)
    : 0;

  const categoryAverage = 4.0; // Assume category average for comparison (can be fetched from API if available)
  const ratingComparison = averageRating !== 'N/A'
    ? (((averageRating - categoryAverage) / categoryAverage) * 100).toFixed(0)
    : 0;

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
    const updatedTechs = [...selectedTechs, tech];
    setSelectedTechs(updatedTechs);
    localStorage.setItem('comparisonTechs', JSON.stringify(updatedTechs));
    setAvailableTechs(availableTechs.filter((t) => t._id !== tech._id));
    setIsModalOpen(false);
    setSearchQuery('');
    addToast('Technology added! 🎉');
  };

  const handleRemoveTech = (id) => {
    const removedTech = selectedTechs.find((tech) => tech._id === id);
    const updatedTechs = selectedTechs.filter((tech) => tech._id !== id);
    setSelectedTechs(updatedTechs);
    localStorage.setItem('comparisonTechs', JSON.stringify(updatedTechs));
    setAvailableTechs([...availableTechs, removedTech]);
    addToast('Technology removed!');
  };

  // Modal Focus Management
  useEffect(() => {
    if (isModalOpen) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      firstFocusableElementRef.current = firstElement;
      lastFocusableElementRef.current = lastElement;

      firstElement.focus();

      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      };

      modalRef.current.addEventListener('keydown', handleTabKey);
      return () => modalRef.current.removeEventListener('keydown', handleTabKey);
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

  // Framer Motion variants for modal
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  };

  const modalContentVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  // Framer Motion variants for other sections
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
    <section className="tech-comparison-section" aria-label="Technology Comparison Section">
      {/* Toast Notifications */}
      <div className="toast-container" role="region" aria-live="polite">
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
              aria-live="assertive"
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="tech-comparison-container">
        {/* Header */}
        <motion.div
          className="comparison-header"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h1 id="comparison-title">Technology Comparison</h1>
          <p>Compare features, pricing, and ratings across different technologies</p>
          <a href="/technologies" className="back-link" aria-label="Back to Technologies">
            <ChevronLeft className="back-icon" aria-hidden="true" />
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
          <h2 id="selected-techs-heading">Selected Technologies</h2>
          <div className="tech-list-card" aria-labelledby="selected-techs-heading">
            <div className="tech-list">
              {selectedTechs.length === 0 && <p>No technologies selected for comparison.</p>}
              {selectedTechs.map((tech) => (
                <motion.div
                  key={tech._id}
                  className="tech-item"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  tabIndex={0}
                  aria-label={`Selected technology: ${tech.name}`}
                  onKeyDown={(e) => e.key === 'Enter' && handleRemoveTech(tech._id)}
                >
                  <span>{tech.name}</span>
                  <button
                    className="remove-tech"
                    onClick={() => handleRemoveTech(tech._id)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRemoveTech(tech._id)}
                    aria-label={`Remove ${tech.name} from comparison`}
                  >
                    <X className="remove-icon" aria-hidden="true" />
                  </button>
                </motion.div>
              ))}
            </div>
            <button
              ref={addMoreButtonRef}
              className="add-more-button"
              onClick={() => setIsModalOpen(true)}
              onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
              tabIndex={0}
              aria-label="Add more technologies to compare"
            >
              Add More +
            </button>
          </div>
        </motion.div>

        {/* Summary Section */}
        {selectedTechs.length > 0 && (
          <motion.div
            className="summary-section"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            role="region"
            aria-live="polite"
            aria-label="Comparison Summary"
          >
            <div className="summary-card" tabIndex={0}>
              <div className="summary-details">
                <div className="summary-item">
                  <h3>Average Rating</h3>
                  <p>
                    {averageRating} <Star className="star-icon" aria-hidden="true" />
                  </p>
                  <span>{ratingComparison > 0 ? `${ratingComparison}% higher than category average` : 'N/A'}</span>
                </div>
                <div className="summary-item">
                  <h3>Price Range</h3>
                  <p>{priceRange}</p>
                  <span>Per user/month</span>
                </div>
                <div className="summary-item">
                  <h3>Total Reviews</h3>
                  <p>{totalReviews.toLocaleString()}</p>
                  <span>Across all platforms</span>
                </div>
              </div>
              <div className="progress-section">
                <p>You’ve compared {selectedTechs.length} out of 5 technologies!</p>
                <div className="progress-bar" role="progressbar" aria-valuenow={selectedTechs.length} aria-valuemin="0" aria-valuemax="5">
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
                      <div className="badge" tabIndex={0} aria-label="Explorer Badge">
                        <Award className="badge-icon" aria-hidden="true" />
                        <span>Explorer</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Comparison Table */}
        {selectedTechs.length > 0 && (
          <motion.div
            className="detailed-comparison"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <h2 id="detailed-comparison-heading">Detailed Comparison</h2>
            <div className="sort-controls">
              <label htmlFor="sort-criteria">Sort by:</label>
              <select
                id="sort-criteria"
                value={sortCriterion}
                onChange={(e) => setSortCriterion(e.target.value)}
                aria-label="Sort comparison criteria"
              >
                <option value="">None</option>
                {techCriteriaBase.map((criteria) => (
                  <option key={criteria.criterion} value={criteria.criterion}>
                    {criteria.criterion} (Highest)
                  </option>
                ))}
              </select>
            </div>
            <div className="table-wrapper">
              <table className="comparison-table detailed-table" aria-labelledby="detailed-comparison-heading">
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
                          {rating || 'N/A'} {rating ? <Star className="star-icon" aria-hidden="true" /> : null}
                        </td>
                      ))}
                      <td>
                        {criteria.ratings.every((r) => r)
                          ? (criteria.ratings.reduce((a, b) => a + b, 0) / criteria.ratings.length).toFixed(1)
                          : 'N/A'}{' '}
                        {criteria.ratings.every((r) => r) ? <Star className="star-icon" aria-hidden="true" /> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Feature Comparison Table */}
        {selectedTechs.length > 0 && (
          <motion.div
            className="feature-comparison"
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
          >
            <h2 id="feature-comparison-heading">Feature Comparison</h2>
            <div className="table-wrapper">
              <table className="comparison-table feature-table" aria-labelledby="feature-comparison-heading">
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
                          <span
                            className={`dot ${avail ? 'available' : 'unavailable'}`}
                            aria-label={avail ? `${feature.feature} available` : `${feature.feature} unavailable`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Add Technology Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              className="modal-overlay"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onKeyDown={handleModalKeyDown}
            >
              <motion.div
                className="modal-content"
                ref={modalRef}
                variants={modalContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                role="dialog"
                aria-labelledby="modal-title"
                tabIndex={-1}
              >
                <h3 id="modal-title">Add Technology</h3>
                <div className="search-bar">
                  <Search className="search-icon" aria-hidden="true" />
                  <input
                    type="text"
                    id="search-input"
                    placeholder="Search technologies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    aria-label="Search technologies to add"
                  />
                </div>
                <div className="tech-options" role="listbox" aria-label="Available Technologies">
                  {availableTechs.length === 0 && !loading && !error && (
                    <p>No available technologies to add.</p>
                  )}
                  {loading && <p>Loading...</p>}
                  {error && <p className="error-message">Error: {error}</p>}
                  {availableTechs.map((tech) => (
                    <motion.div
                      key={tech._id}
                      className={`tech-option ${
                        selectedTechs.some((t) => t._id === tech._id) ? 'selected' : ''
                      }`}
                      variants={cardVariants}
                      initial="rest"
                      whileHover="hover"
                      tabIndex={0}
                      role="option"
                      aria-selected={selectedTechs.some((t) => t._id === tech._id)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && !selectedTechs.some((t) => t._id === tech._id) && handleAddTech(tech)
                      }
                    >
                      <div className="tech-info">
                        <h4>{tech.name}</h4>
                        <p>
                          {tech.coreVitals?.featuresRating || 'N/A'} <Star className="star-icon" aria-hidden="true" /> •{' '}
                          {tech.category || 'N/A'}
                        </p>
                      </div>
                      <button
                        className="add-tech-button"
                        onClick={() => handleAddTech(tech)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTech(tech)}
                        disabled={selectedTechs.some((t) => t._id === tech._id)}
                        aria-label={`Add ${tech.name} to comparison`}
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
                      aria-label="Cancel adding technology"
                    >
                      Cancel
                    </button>
                    <button
                      className="add-selected-button"
                      onClick={() => setIsModalOpen(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(false)}
                      aria-label="Add selected technologies and close"
                    >
                      Add Selected
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TechComparison;