import React, { useState, useEffect, useRef } from 'react';
import { Star, Trash2, X, Plus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './AdminDash.css';

// Determine the API URL based on the environment
const API_URL = import.meta.env.NODE_ENV === 'production'
  ? import.meta.env.VITE_API_PROD_BACKEND_URL
  : import.meta.env.VITE_API_DEV_BACKEND_URL;

const AdminDash = () => {
  const [activeTab, setActiveTab] = useState('feedback');
  const [feedbackList, setFeedbackList] = useState([
    { id: 1, rating: 4, feedback: 'Great experience, but could use more features.', date: '2025-04-28' },
    { id: 2, rating: 5, feedback: 'Absolutely love it! Very intuitive.', date: '2025-04-27' },
    { id: 3, rating: 3, feedback: 'It’s okay, but the UI needs improvement.', date: '2025-04-26' },
    { id: 4, rating: 2, feedback: 'Not very user-friendly.', date: '2025-04-25' },
  ]);
  const [technologies, setTechnologies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filterRating, setFilterRating] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isAddTechModalOpen, setIsAddTechModalOpen] = useState(false);
  const [newTech, setNewTech] = useState({
    name: '',
    keyFeatures: '',
    systemRequirements: '',
    category: '',
    description: '',
    cost: '',
    evaluation: '',
    version: '',
    platform: '',
    developer: '',
    inputs: '',
    coreVitals: {
      customerSupport: '',
      valueForMoney: '',
      featuresRating: '',
      easeOfUse: '',
    },
    featureComparison: {
      security: false,
      integration: false,
      support: false,
      userManagement: false,
      api: false,
      webhooks: false,
      community: false,
    },
  });
  const [techError, setTechError] = useState('');
  const modalRef = useRef(null);

  // Replace with your JWT token
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzU1N2U4Yi0wMmYzLTQyYmQtYTkwNi1jZmU2NDk5NzdkMGYiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDU5OTEzNTcsImV4cCI6MTc0NjA3Nzc1N30.EFnagJsRqlnab0znRF1b6E6UladFwjubZCCKIm0Vtxo';

  // Fetch technologies from API
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch(`${API_URL}/api/technologies`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch technologies');
        }
        const data = await response.json();
        setTechnologies(data);
      } catch (error) {
        addToast(`Error fetching technologies: ${error.message}`);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/reviews`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        addToast(`Error fetching reviews: ${error.message}`);
      }
    };

    fetchTechnologies();
    fetchReviews();
  }, []);

  // Focus management for the modal
  useEffect(() => {
    if (isAddTechModalOpen) {
      modalRef.current?.focus();
    }
  }, [isAddTechModalOpen]);

  const totalFeedback = feedbackList.length;
  const averageRating = feedbackList.length
    ? (feedbackList.reduce((sum, item) => sum + item.rating, 0) / feedbackList.length).toFixed(1)
    : 0;

  const filteredFeedback = filterRating
    ? feedbackList.filter((item) => item.rating === filterRating)
    : feedbackList;

  const handleDeleteFeedback = (id) => {
    setFeedbackList(feedbackList.filter((item) => item.id !== id));
    addToast('Feedback deleted successfully!');
  };

  const handleDeleteTech = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/technologies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete technology');
      }
      setTechnologies(technologies.filter((tech) => tech._id !== id));
      addToast('Technology deleted successfully!');
    } catch (error) {
      addToast(`Error deleting technology: ${error.message}`);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
      setReviews(reviews.filter((review) => review._id !== id));
      addToast('Review deleted successfully!');
    } catch (error) {
      addToast(`Error deleting review: ${error.message}`);
    }
  };

  const handleAddTech = async (e) => {
    e.preventDefault();
    const {
      name,
      keyFeatures,
      systemRequirements,
      category,
      description,
      cost,
      evaluation,
      version,
      platform,
      developer,
      inputs,
      coreVitals,
      featureComparison,
    } = newTech;

    // Validation
    if (
      !name.trim() ||
      !keyFeatures.trim() ||
      !systemRequirements.trim() ||
      !category ||
      !description.trim() ||
      !cost ||
      !evaluation.trim() ||
      !version.trim() ||
      !platform.trim() ||
      !developer.trim() ||
      !inputs.trim()
    ) {
      setTechError('Please fill in all required fields.');
      return;
    }

    const parsedCoreVitals = {
      customerSupport: parseFloat(coreVitals.customerSupport) || 0,
      valueForMoney: parseFloat(coreVitals.valueForMoney) || 0,
      featuresRating: parseFloat(coreVitals.featuresRating) || 0,
      easeOfUse: parseFloat(coreVitals.easeOfUse) || 0,
    };
    if (Object.values(parsedCoreVitals).some(val => val < 0 || val > 5)) {
      setTechError('Core vitals must be between 0 and 5.');
      return;
    }

    const techData = {
      name: name.trim(),
      keyFeatures: keyFeatures.trim(),
      systemRequirements: systemRequirements.trim(),
      category,
      description: description.trim(),
      cost,
      evaluation: evaluation.trim(),
      version: version.trim(),
      platform: platform.trim(),
      developer: developer.trim(),
      inputs: inputs.trim(),
      coreVitals: parsedCoreVitals,
      featureComparison: {
        security: featureComparison.security === 'true',
        integration: featureComparison.integration === 'true',
        support: featureComparison.support === 'true',
        userManagement: featureComparison.userManagement === 'true',
        api: featureComparison.api === 'true',
        webhooks: featureComparison.webhooks === 'true',
        community: featureComparison.community === 'true',
      },
    };

    try {
      const response = await fetch(`${API_URL}/api/technologies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(techData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add technology');
      }
      const newTechEntry = await response.json();
      setTechnologies([...technologies, newTechEntry]);
      setIsAddTechModalOpen(false);
      setNewTech({
        name: '',
        keyFeatures: '',
        systemRequirements: '',
        category: '',
        description: '',
        cost: '',
        evaluation: '',
        version: '',
        platform: '',
        developer: '',
        inputs: '',
        coreVitals: {
          customerSupport: '',
          valueForMoney: '',
          featuresRating: '',
          easeOfUse: '',
        },
        featureComparison: {
          security: false,
          integration: false,
          support: false,
          userManagement: false,
          api: false,
          webhooks: false,
          community: false,
        },
      });
      setTechError('');
      addToast('Technology added successfully!');
    } catch (error) {
      setTechError(error.message);
    }
  };

  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  const clearFilter = () => {
    setFilterRating(null);
  };

  const toastVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <section className="admin-dash-section">
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

      <div className="admin-dash-container">
        {/* Tabs */}
        <div className="tabs-section">
          <button
            className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
            aria-label="View feedback section"
          >
            Feedback
          </button>
          <button
            className={`tab-button ${activeTab === 'technologies' ? 'active' : ''}`}
            onClick={() => setActiveTab('technologies')}
            aria-label="View technologies section"
          >
            Technologies
          </button>
          <button
            className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
            aria-label="View reviews section"
          >
            Reviews
          </button>
        </div>

        {/* Feedback Section */}
        {activeTab === 'feedback' && (
          <>
            {/* Summary Card */}
            <motion.div
              className="summary-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="summary-title">Feedback Summary</h3>
              <div className="summary-details">
                <p>
                  <strong>Total Feedback:</strong> {totalFeedback}
                </p>
                <p>
                  <strong>Average Rating:</strong> {averageRating}{' '}
                  <Star className="star-icon" />
                </p>
              </div>
            </motion.div>

            {/* Filter Section */}
            <div className="filter-section">
              <label htmlFor="rating-filter" className="filter-label">
                Filter by Rating:
              </label>
              <div className="filter-controls">
                <select
                  id="rating-filter"
                  value={filterRating || ''}
                  onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                  className="filter-select"
                  aria-label="Filter feedback by rating"
                >
                  <option value="">All Ratings</option>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value} Star{value !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                {filterRating && (
                  <button
                    onClick={clearFilter}
                    className="clear-filter-button"
                    aria-label="Clear rating filter"
                  >
                    <X className="clear-icon" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Feedback Table */}
            <div className="table-section">
              <h2 className="table-title">Feedback Entries</h2>
              <div className="table-wrapper">
                <table className="feedback-table">
                  <thead>
                    <tr>
                      <th scope="col">Rating</th>
                      <th scope="col">Feedback</th>
                      <th scope="col">Date</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredFeedback.map((item) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td>
                            <div className="rating-stars">
                              {[...Array(5)].map((_, index) => (
                                <Star
                                  key={index}
                                  className={`star-icon ${
                                    index < item.rating ? 'selected' : 'unselected'
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td>{item.feedback}</td>
                          <td>{item.date}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteFeedback(item.id)}
                              className="delete-button"
                              aria-label={`Delete feedback ${item.id}`}
                            >
                              <Trash2 className="delete-icon" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Technologies Section */}
        {activeTab === 'technologies' && (
          <>
            {/* Add Technology Button */}
            <div className="add-tech-section">
              <button
                onClick={() => setIsAddTechModalOpen(true)}
                className="add-tech-button"
                aria-label="Add new technology"
              >
                <Plus className="add-icon" /> Add Technology
              </button>
            </div>

            {/* Technologies Table */}
            <div className="table-section">
              <h2 className="table-title">Technologies</h2>
              <div className="table-wrapper">
                <table className="tech-table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Category</th>
                      <th scope="col">Features</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {technologies.map((tech) => (
                        <motion.tr
                          key={tech._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <td>{tech.name}</td>
                          <td>{tech.category ? tech.category.charAt(0).toUpperCase() + tech.category.slice(1) : 'N/A'}</td>
                          <td>
                            <div className="features-cell">
                              <button
                                className="features-info-button"
                                aria-label={`View features for ${tech.name}`}
                              >
                                <Info className="info-icon" />
                              </button>
                              <div className="features-tooltip">
                                <ul>
                                  <li><strong>Security:</strong> {tech.featureComparison?.security ? 'Yes' : 'No'}</li>
                                  <li><strong>Integration:</strong> {tech.featureComparison?.integration ? 'Yes' : 'No'}</li>
                                  <li><strong>Support:</strong> {tech.featureComparison?.support ? 'Yes' : 'No'}</li>
                                  <li><strong>User Management:</strong> {tech.featureComparison?.userManagement ? 'Yes' : 'No'}</li>
                                  <li><strong>API:</strong> {tech.featureComparison?.api ? 'Yes' : 'No'}</li>
                                  <li><strong>Webhooks:</strong> {tech.featureComparison?.webhooks ? 'Yes' : 'No'}</li>
                                  <li><strong>Community:</strong> {tech.featureComparison?.community ? 'Yes' : 'No'}</li>
                                </ul>
                              </div>
                            </div>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDeleteTech(tech._id)}
                              className="delete-button"
                              aria-label={`Delete technology ${tech.name}`}
                            >
                              <Trash2 className="delete-icon" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Technology Modal */}
            {isAddTechModalOpen && (
              <div className="modal-overlay">
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
                  <h3 id="modal-title" className="modal-title">
                    Add New Technology
                  </h3>
                  <form onSubmit={handleAddTech}>
                    {/* General Information */}
                    <div className="form-section">
                      <h4 className="form-section-title">General Information</h4>
                      <div className="form-group">
                        <label htmlFor="tech-name" className="form-label">
                          Name *
                        </label>
                        <input
                          id="tech-name"
                          type="text"
                          value={newTech.name}
                          onChange={(e) =>
                            setNewTech({ ...newTech, name: e.target.value })
                          }
                          className="form-input"
                          aria-label="Technology name"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-category" className="form-label">
                          Category *
                        </label>
                        <select
                          id="tech-category"
                          value={newTech.category}
                          onChange={(e) =>
                            setNewTech({ ...newTech, category: e.target.value })
                          }
                          className="form-input"
                          aria-label="Technology category"
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="visual">Visual</option>
                          <option value="auditory">Auditory</option>
                          <option value="physical">Physical</option>
                          <option value="cognitive">Cognitive</option>
                          <option value="ledger">Ledger</option>
                          <option value="quantum">Quantum</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-cost" className="form-label">
                          Cost *
                        </label>
                        <select
                          id="tech-cost"
                          value={newTech.cost}
                          onChange={(e) =>
                            setNewTech({ ...newTech, cost: e.target.value })
                          }
                          className="form-input"
                          aria-label="Technology cost"
                          required
                        >
                          <option value="">Select Cost</option>
                          <option value="free">Free</option>
                          <option value="paid">Paid</option>
                          <option value="subscription">Subscription</option>
                        </select>
                      </div>
                    </div>

                    {/* Technical Details */}
                    <div className="form-section">
                      <h4 className="form-section-title">Technical Details</h4>
                      <div className="form-group">
                        <label htmlFor="tech-version" className="form-label">
                          Version *
                        </label>
                        <input
                          id="tech-version"
                          type="text"
                          value={newTech.version}
                          onChange={(e) =>
                            setNewTech({ ...newTech, version: e.target.value })
                          }
                          className="form-input"
                          aria-label="Technology version"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-platform" className="form-label">
                          Platform *
                        </label>
                        <input
                          id="tech-platform"
                          type="text"
                          value={newTech.platform}
                          onChange={(e) =>
                            setNewTech({ ...newTech, platform: e.target.value })
                          }
                          className="form-input"
                          aria-label="Supported platforms"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-developer" className="form-label">
                          Developer *
                        </label>
                        <input
                          id="tech-developer"
                          type="text"
                          value={newTech.developer}
                          onChange={(e) =>
                            setNewTech({ ...newTech, developer: e.target.value })
                          }
                          className="form-input"
                          aria-label="Technology developer"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-system-requirements" className="form-label">
                          System Requirements *
                        </label>
                        <textarea
                          id="tech-system-requirements"
                          value={newTech.systemRequirements}
                          onChange={(e) =>
                            setNewTech({ ...newTech, systemRequirements: e.target.value })
                          }
                          className="form-textarea"
                          aria-label="System requirements"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-inputs" className="form-label">
                          Inputs *
                        </label>
                        <textarea
                          id="tech-inputs"
                          value={newTech.inputs}
                          onChange={(e) =>
                            setNewTech({ ...newTech, inputs: e.target.value })
                          }
                          className="form-textarea"
                          aria-label="Input methods"
                          required
                        />
                      </div>
                    </div>

                    {/* Description and Evaluation */}
                    <div className="form-section">
                      <h4 className="form-section-title">Description and Evaluation</h4>
                      <div className="form-group">
                        <label htmlFor="tech-description" className="form-label">
                          Description *
                        </label>
                        <textarea
                          id="tech-description"
                          value={newTech.description}
                          onChange={(e) =>
                            setNewTech({ ...newTech, description: e.target.value })
                          }
                          className="form-textarea"
                          aria-label="Technology description"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-evaluation" className="form-label">
                          Evaluation *
                        </label>
                        <textarea
                          id="tech-evaluation"
                          value={newTech.evaluation}
                          onChange={(e) =>
                            setNewTech({ ...newTech, evaluation: e.target.value })
                          }
                          className="form-textarea"
                          aria-label="Technology evaluation"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-key-features" className="form-label">
                          Key Features *
                        </label>
                        <textarea
                          id="tech-key-features"
                          value={newTech.keyFeatures}
                          onChange={(e) =>
                            setNewTech({ ...newTech, keyFeatures: e.target.value })
                          }
                          className="form-textarea"
                          aria-label="Key features"
                          required
                        />
                      </div>
                    </div>

                    {/* Core Vitals */}
                    <div className="form-section">
                      <h4 className="form-section-title">Core Vitals</h4>
                      <div className="form-group">
                        <label htmlFor="tech-customer-support" className="form-label">
                          Customer Support (0-5)
                        </label>
                        <input
                          id="tech-customer-support"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={newTech.coreVitals.customerSupport}
                          onChange={(e) =>
                            setNewTech({
                              ...newTech,
                              coreVitals: { ...newTech.coreVitals, customerSupport: e.target.value },
                            })
                          }
                          className="form-input"
                          aria-label="Customer support rating"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-value-for-money" className="form-label">
                          Value for Money (0-5)
                        </label>
                        <input
                          id="tech-value-for-money"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={newTech.coreVitals.valueForMoney}
                          onChange={(e) =>
                            setNewTech({
                              ...newTech,
                              coreVitals: { ...newTech.coreVitals, valueForMoney: e.target.value },
                            })
                          }
                          className="form-input"
                          aria-label="Value for money rating"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-features-rating" className="form-label">
                          Features Rating (0-5)
                        </label>
                        <input
                          id="tech-features-rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={newTech.coreVitals.featuresRating}
                          onChange={(e) =>
                            setNewTech({
                              ...newTech,
                              coreVitals: { ...newTech.coreVitals, featuresRating: e.target.value },
                            })
                          }
                          className="form-input"
                          aria-label="Features rating"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="tech-ease-of-use" className="form-label">
                          Ease of Use (0-5)
                        </label>
                        <input
                          id="tech-ease-of-use"
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={newTech.coreVitals.easeOfUse}
                          onChange={(e) =>
                            setNewTech({
                              ...newTech,
                              coreVitals: { ...newTech.coreVitals, easeOfUse: e.target.value },
                            })
                          }
                          className="form-input"
                          aria-label="Ease of use rating"
                        />
                      </div>
                    </div>

                    {/* Feature Comparison */}
                    <div className="form-section">
                      <h4 className="form-section-title">Feature Comparison</h4>
                      {['security', 'integration', 'support', 'userManagement', 'api', 'webhooks', 'community'].map((feature) => (
                        <div className="form-group" key={feature}>
                          <label htmlFor={`tech-${feature}`} className="form-label">
                            {feature.charAt(0).toUpperCase() + feature.slice(1)} *
                          </label>
                          <select
                            id={`tech-${feature}`}
                            value={newTech.featureComparison[feature]}
                            onChange={(e) =>
                              setNewTech({
                                ...newTech,
                                featureComparison: {
                                  ...newTech.featureComparison,
                                  [feature]: e.target.value,
                                },
                              })
                            }
                            className="form-input"
                            aria-label={`${feature} support`}
                            required
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </select>
                        </div>
                      ))}
                    </div>

                    {techError && (
                      <p className="error-message" aria-live="assertive">
                        {techError}
                      </p>
                    )}
                    <div className="modal-actions">
                      <button
                        type="button"
                        onClick={() => setIsAddTechModalOpen(false)}
                        className="cancel-button"
                        aria-label="Cancel"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="submit-button"
                        aria-label="Add technology"
                      >
                        Add Technology
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </>
        )}

        {/* Reviews Section */}
        {activeTab === 'reviews' && (
          <div className="table-section">
            <h2 className="table-title">Reviews</h2>
            <div className="table-wrapper">
              <table className="review-table">
                <thead>
                  <tr>
                    <th scope="col">Technology</th>
                    <th scope="col">User</th>
                    <th scope="col">Rating</th>
                    <th scope="col">Comment</th>
                    <th scope="col">Tags</th>
                    <th scope="col">Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {reviews.map((review) => (
                      <motion.tr
                        key={review._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <td>{review.technologyId?.name || 'N/A'}</td>
                        <td>{review.userId?.email || 'N/A'}</td>
                        <td>
                          <div className="rating-stars">
                            {[...Array(5)].map((_, index) => (
                              <Star
                                key={index}
                                className={`star-icon ${
                                  index < review.rating ? 'selected' : 'unselected'
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td>{review.comment}</td>
                        <td>{review.tags?.join(', ') || 'None'}</td>
                        <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="delete-button"
                            aria-label={`Delete review ${review._id}`}
                          >
                            <Trash2 className="delete-icon" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDash;