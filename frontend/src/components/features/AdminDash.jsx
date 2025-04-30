

  import React, { useState, useEffect, useRef } from 'react';
  import { Star, Trash2, X, Plus, Info } from 'lucide-react';
  import { motion, AnimatePresence } from 'framer-motion';
  import './AdminDash.css';
  
  const AdminDash = () => {
    const [activeTab, setActiveTab] = useState('feedback');
    const [feedbackList, setFeedbackList] = useState([
      { id: 1, rating: 4, feedback: 'Great experience, but could use more features.', date: '2025-04-28' },
      { id: 2, rating: 5, feedback: 'Absolutely love it! Very intuitive.', date: '2025-04-27' },
      { id: 3, rating: 3, feedback: 'It’s okay, but the UI needs improvement.', date: '2025-04-26' },
      { id: 4, rating: 2, feedback: 'Not very user-friendly.', date: '2025-04-25' },
    ]);
    const [technologies, setTechnologies] = useState([]);
    const [filterRating, setFilterRating] = useState(null);
    const [toasts, setToasts] = useState([]);
    const [isAddTechModalOpen, setIsAddTechModalOpen] = useState(false);
    const [newTech, setNewTech] = useState({
      name: '',
      rating: '',
      reviews: '',
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
      image: null,
      featureComparison: {
        security: '',
        integration: '',
        support: '',
        userManagement: '',
        api: '',
        webhooks: '',
        community: '',
      },
    });
    const [techError, setTechError] = useState('');
    const modalRef = useRef(null);
  
    // Simulate fetching technologies from an API
    useEffect(() => {
      const fetchTechnologies = async () => {
        const mockData = [
          {
            id: 1,
            name: 'Technology 1',
            rating: 4.5,
            reviews: 2458,
            keyFeatures: 'Feature 1\nFeature 2',
            systemRequirements: 'Windows 10, 8GB RAM',
            category: 'visual',
            description: 'A powerful tool for visual assistance.',
            cost: 'free',
            evaluation: 'Highly rated for accessibility.',
            version: '1.2.3',
            platform: 'Windows, macOS',
            developer: 'TechCorp',
            inputs: 'Keyboard, Mouse',
            image: 'images/tech/etc/tech-1-1698771234567.jpg',
            featureComparison: {
              security: 'High',
              integration: 'Seamless with Zoom',
              support: '24/7',
              userManagement: 'Advanced',
              api: 'RESTful',
              webhooks: 'Supported',
              community: 'Yes',
            },
          },
          {
            id: 2,
            name: 'Technology 2',
            rating: 4.8,
            reviews: 1923,
            keyFeatures: 'Feature A\nFeature B',
            systemRequirements: 'macOS 12, 16GB RAM',
            category: 'auditory',
            description: 'Enhances auditory experiences.',
            cost: '$1-$50',
            evaluation: 'Good for hearing-impaired users.',
            version: '2.0.1',
            platform: 'macOS, Linux',
            developer: 'SoundTech',
            inputs: 'Voice, Keyboard',
            image: 'images/tech/etc/tech-2-1698771234568.jpg',
            featureComparison: {
              security: 'Medium',
              integration: 'Limited',
              support: 'Email Only',
              userManagement: 'Basic',
              api: 'GraphQL',
              webhooks: 'Not Supported',
              community: 'No',
            },
          },
        ];
        setTechnologies(mockData);
      };
      fetchTechnologies();
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
  
    const handleDeleteTech = (id) => {
      setTechnologies(technologies.filter((tech) => tech.id !== id));
      addToast('Technology deleted successfully!');
    };
  
    const handleAddTech = (e) => {
      e.preventDefault();
      const {
        name,
        rating,
        reviews,
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
        image,
        featureComparison,
      } = newTech;
  
      // Validation
      if (
        !name.trim() ||
        !rating ||
        !reviews ||
        !keyFeatures.trim() ||
        !systemRequirements.trim() ||
        !category ||
        !description.trim() ||
        !cost ||
        !evaluation.trim() ||
        !version.trim() ||
        !platform.trim() ||
        !developer.trim() ||
        !inputs.trim() ||
        !featureComparison.security ||
        !featureComparison.integration ||
        !featureComparison.support ||
        !featureComparison.userManagement ||
        !featureComparison.api ||
        !featureComparison.webhooks ||
        !featureComparison.community
      ) {
        setTechError('Please fill in all required fields.');
        return;
      }
  
      const parsedRating = parseFloat(rating);
      const parsedReviews = parseInt(reviews);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        setTechError('Rating must be between 1 and 5.');
        return;
      }
      if (isNaN(parsedReviews) || parsedReviews < 0) {
        setTechError('Reviews must be a positive number.');
        return;
      }
      if (image && !['image/jpeg', 'image/png'].includes(image.type)) {
        setTechError('Please upload a JPEG or PNG image.');
        return;
      }
  
      // Simulate image storage
      const imagePath = image
        ? `images/tech/etc/tech-${technologies.length + 1}-${Date.now()}.jpg`
        : null;
  
      const newTechEntry = {
        id: technologies.length + 1,
        name: name.trim(),
        rating: parsedRating,
        reviews: parsedReviews,
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
        image: imagePath,
        featureComparison: {
          security: featureComparison.security.trim(),
          integration: featureComparison.integration.trim(),
          support: featureComparison.support.trim(),
          userManagement: featureComparison.userManagement.trim(),
          api: featureComparison.api.trim(),
          webhooks: featureComparison.webhooks.trim(),
          community: featureComparison.community,
        },
      };
      setTechnologies([...technologies, newTechEntry]);
      setIsAddTechModalOpen(false);
      setNewTech({
        name: '',
        rating: '',
        reviews: '',
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
        image: null,
        featureComparison: {
          security: '',
          integration: '',
          support: '',
          userManagement: '',
          api: '',
          webhooks: '',
          community: '',
        },
      });
      setTechError('');
      addToast('Technology added successfully!');
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
                        <th scope="col">Rating</th>
                        <th scope="col">Reviews</th>
                        <th scope="col">Category</th>
                        <th scope="col">Features</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {technologies.map((tech) => (
                          <motion.tr
                            key={tech.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td>{tech.name}</td>
                            <td>
                              {tech.rating} <Star className="star-icon" />
                            </td>
                            <td>{tech.reviews}</td>
                            <td>{tech.category.charAt(0).toUpperCase() + tech.category.slice(1)}</td>
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
                                    <li><strong>Security:</strong> {tech.featureComparison.security}</li>
                                    <li><strong>Integration:</strong> {tech.featureComparison.integration}</li>
                                    <li><strong>Support:</strong> {tech.featureComparison.support}</li>
                                    <li><strong>User Management:</strong> {tech.featureComparison.userManagement}</li>
                                    <li><strong>API:</strong> {tech.featureComparison.api}</li>
                                    <li><strong>Webhooks:</strong> {tech.featureComparison.webhooks}</li>
                                    <li><strong>Community:</strong> {tech.featureComparison.community}</li>
                                  </ul>
                                </div>
                              </div>
                            </td>
                            <td>
                              <button
                                onClick={() => handleDeleteTech(tech.id)}
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
                          <label htmlFor="tech-rating" className="form-label">
                            Rating (1-5) *
                          </label>
                          <input
                            id="tech-rating"
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            value={newTech.rating}
                            onChange={(e) =>
                              setNewTech({ ...newTech, rating: e.target.value })
                            }
                            className="form-input"
                            aria-label="Technology rating"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="tech-reviews" className="form-label">
                            Reviews *
                          </label>
                          <input
                            id="tech-reviews"
                            type="number"
                            min="0"
                            value={newTech.reviews}
                            onChange={(e) =>
                              setNewTech({ ...newTech, reviews: e.target.value })
                            }
                            className="form-input"
                            aria-label="Number of reviews"
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
                            <option value="$1-$50">$1-$50</option>
                            <option value="$51-$200">$51-$200</option>
                            <option value="$200+">$200+</option>
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
  
                      {/* Feature Comparison */}
                      <div className="form-section">
                        <h4 className="form-section-title">Feature Comparison</h4>
                        <div className="form-group">
                          <label htmlFor="tech-security" className="form-label">
                            Security *
                          </label>
                          <input
                            id="tech-security"
                            type="text"
                            value={newTech.featureComparison.security}
                            onChange={(e) =>
                              setNewTech({
                                ...newTech,
                                featureComparison: {
                                  ...newTech.featureComparison,
                                  security: e.target.value,
                                },
                              })
                            }
                            className="form-input"
                            aria-label="Security level"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="tech-integration" className="form-label">
                            Integration *
                          </label>
                          <input
                            id="tech-integration"
                            type="text"
                            value={newTech.featureComparison.integration}
                            onChange={(e) =>
                              setNewTech({
                                ...newTech,
                                featureComparison: {
                                  ...newTech.featureComparison,
                                  integration: e.target.value,
                                },
                              })
                            }
                            className="form-input"
                            aria-label="Integration capability"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="tech-support" className="form-label">
                            Support *
                          </label>
                          <input
                            id="tech-support"
                            type="text"
                            value={newTech.featureComparison.support}
                            onChange={(e) =>
                              setNewTech({
                                ...newTech,
                                featureComparison: {
                                  ...newTech.featureComparison,
                                  support: e.target.value,
                                },
                              })
                            }
                            className="form-input"
                            aria-label="Support availability"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="tech-user-management" className="form-label">
                            User Management *
                          </label>
                          <input
                            id="tech-user-management"
                            type="text"
                            value={newTech.featureComparison.userManagement}
                            onChange={(e) =>
                              setNewTech({
                                ...newTech,
                                featureComparison: {
                                  ...newTech.featureComparison,
                                  userManagement: e.target.value,
                                },
                              })
                            }
                            className="form-input"
                            aria-label="User management features"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="tech-api" className="form-label">
                            API *
                          </label>
                          <input
                            id="tech-api"
                            type="text"
                            value={newTech.featureComparison.api}
                            onChange={(e) =>
                              setNewTech({
                                ...newTech,
                                featureComparison: {
                                  ...newTech.featureComparison,
                                  api: e.target.value,
                                },
                              })
                            }
                            className="form-input"
                            aria-label="API support"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="tech-webhooks" className="form-label">
                            Webhooks *
                          </label>
                          <input
                            id="tech-webhooks"
                            type="text"
                            value={newTech.featureComparison.webhooks}
                            onChange={(e) =>
                              setNewTech({
                                ...newTech,
                                featureComparison: {
                                  ...newTech.featureComparison,
                                  webhooks: e.target.value,
                                },
                              })
                            }
                            className="form-input"
                            aria-label="Webhooks support"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="tech-community" className="form-label">
                            Community *
                          </label>
                          <select
                            id="tech-community"
                            value={newTech.featureComparison.community}
                            onChange={(e) =>
                              setNewTech({
                                ...newTech,
                                featureComparison: {
                                  ...newTech.featureComparison,
                                  community: e.target.value,
                                },
                              })
                            }
                            className="form-input"
                            aria-label="Community support"
                            required
                          >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                      </div>
  
                      {/* Image Upload */}
                      <div className="form-section">
                        <h4 className="form-section-title">Image</h4>
                        <div className="form-group">
                          <label htmlFor="tech-image" className="form-label">
                            Upload Image (JPEG/PNG)
                          </label>
                          <input
                            id="tech-image"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={(e) =>
                              setNewTech({ ...newTech, image: e.target.files[0] })
                            }
                            className="form-input"
                            aria-label="Upload technology image"
                          />
                        </div>
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
        </div>
      </section>
    );
  };
  
  export default AdminDash;