import React, { useState, useEffect, useRef } from 'react';
import { Star, Trash2, X, Plus } from 'lucide-react';
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
  const [newTech, setNewTech] = useState({ name: '', rating: '', reviews: '' });
  const [techError, setTechError] = useState('');
  const modalRef = useRef(null);

  // Simulate fetching technologies from an API
  useEffect(() => {
    const fetchTechnologies = async () => {
      // Mock API response
      const mockData = [
        { id: 1, name: 'Technology 1', rating: 4.5, reviews: 2458 },
        { id: 2, name: 'Technology 2', rating: 4.8, reviews: 1923 },
        { id: 3, name: 'Technology 3', rating: 4.3, reviews: 1675 },
      ];
      setTechnologies(mockData);

      // Real API integration example:
      /*
      try {
        const response = await fetch('https://api.example.com/technologies');
        const data = await response.json();
        setTechnologies(data);
      } catch (error) {
        console.error('Error fetching technologies:', error);
        addToast('Failed to fetch technologies.');
      }
      */
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

    // Real API integration example:
    /*
    try {
      await fetch(`https://api.example.com/technologies/${id}`, { method: 'DELETE' });
      setTechnologies(technologies.filter((tech) => tech.id !== id));
      addToast('Technology deleted successfully!');
    } catch (error) {
      console.error('Error deleting technology:', error);
      addToast('Failed to delete technology.');
    }
    */
  };

  const handleAddTech = (e) => {
    e.preventDefault();
    const { name, rating, reviews } = newTech;
    if (!name.trim() || !rating || !reviews) {
      setTechError('Please fill in all fields.');
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

    const newTechEntry = {
      id: technologies.length + 1,
      name: name.trim(),
      rating: parsedRating,
      reviews: parsedReviews,
    };
    setTechnologies([...technologies, newTechEntry]);
    setIsAddTechModalOpen(false);
    setNewTech({ name: '', rating: '', reviews: '' });
    setTechError('');
    addToast('Technology added successfully!');

    // Real API integration example:
    /*
    try {
      const response = await fetch('https://api.example.com/technologies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTechEntry),
      });
      const data = await response.json();
      setTechnologies([...technologies, data]);
      setIsAddTechModalOpen(false);
      setNewTech({ name: '', rating: '', reviews: '' });
      setTechError('');
      addToast('Technology added successfully!');
    } catch (error) {
      console.error('Error adding technology:', error);
      addToast('Failed to add technology.');
    }
    */
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
                    <div className="form-group">
                      <label htmlFor="tech-name" className="form-label">
                        Name
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
                        Rating (1-5)
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
                        Reviews
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