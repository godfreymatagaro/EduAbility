import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BarChart2, Users, Shield, History } from 'lucide-react';
import './SearchArea.css';

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_PROD_BACKEND_URL
    : import.meta.env.VITE_API_DEV_BACKEND_URL;

const SearchArea = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Load search history from localStorage on mount
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(storedHistory);
  }, []);

  // Fetch real-time search results from API
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setLiveResults([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/technologies/search?q=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch results: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setLiveResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setLiveResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchTerm]);

  // Handle search submission (e.g., Enter key)
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const updatedHistory = [searchTerm, ...searchHistory.filter((term) => term !== searchTerm)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setLiveResults([]);
    setIsModalOpen(false);
  };

  // Focus management for accessibility
  useEffect(() => {
    if (isModalOpen) {
      modalRef.current?.focus();
    } else {
      searchInputRef.current?.focus();
    }
  }, [isModalOpen]);

  // Handle keyboard navigation for modal
  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
    }
  };

  // Select a history item or result and redirect if it's a result
  const handleSelectItem = (item) => {
    if (typeof item === 'string') {
      // If the item is a history term (string), set the search term and re-trigger search
      setSearchTerm(item);
      const updatedHistory = [item, ...searchHistory.filter((term) => term !== item)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setIsModalOpen(false);
    } else {
      // If the item is a search result (object), redirect to tech details
      setSearchTerm(item.name);
      const updatedHistory = [item.name, ...searchHistory.filter((term) => term !== item.name)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setIsModalOpen(false);
      navigate(`/tech-details/${item._id}`);
    }
  };

  // Search bar animation
  const searchBarVariants = {
    hidden: { width: '50%', opacity: 0 },
    visible: { width: '100%', opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Modal animation
  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  // Card container animation for staggering children
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  // Individual card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', type: 'spring', stiffness: 100 },
    },
    hover: {
      scale: 1.05,
      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  return (
    <section className="search-section">
      <div className="search-container">
        <motion.div
          className="search-bar-wrapper"
          initial="hidden"
          animate="visible"
          variants={searchBarVariants}
        >
          <div className="search-bar">
            <Search className="search-icon" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search assistive technologies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsModalOpen(true)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="search-input"
              aria-label="Search assistive technologies"
            />
            {searchTerm && (
              <button onClick={handleClear} className="search-clear" aria-label="Clear search">
                <X />
              </button>
            )}
          </div>

          {/* YouTube-style Modal for Results and History */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="search-modal"
                ref={modalRef}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalVariants}
                onKeyDown={handleModalKeyDown}
                role="dialog"
                aria-labelledby="search-modal-title"
                tabIndex={0}
              >
                <div className="search-modal-content">
                  {/* Real-Time Results */}
                  {searchTerm && (
                    <div className="search-results-section">
                      <h3>Results</h3>
                      {loading && <p>Loading...</p>}
                      {error && <p className="error-message">Error: {error}</p>}
                      {!loading && !error && liveResults.length === 0 && (
                        <p>No results found.</p>
                      )}
                      {liveResults.map((result, index) => (
                        <div
                          key={index}
                          className="search-result-item"
                          onClick={() => handleSelectItem(result)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSelectItem(result)}
                          tabIndex={0}
                          role="button"
                          aria-label={`Select ${result.name}`}
                        >
                          <span>{result.name}</span>
                          <span className="result-category">({result.category})</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search History */}
                  <div className="search-history-section">
                    <h3>
                      <History className="history-icon" aria-hidden="true" /> Recent Searches
                    </h3>
                    {searchHistory.length === 0 && <p>No recent searches.</p>}
                    {searchHistory.map((term, index) => (
                      <div
                        key={index}
                        className="search-history-item"
                        onClick={() => handleSelectItem(term)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSelectItem(term)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Select recent search: ${term}`}
                      >
                        {term}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="search-cards"
          initial="hidden"
          animate="visible"
          variants={cardContainerVariants}
        >
          <motion.div
            className="search-card"
            variants={cardVariants}
            whileHover="hover"
            tabIndex={0}
            aria-label="Data-Driven Insights: Make informed decisions with comprehensive analytics and evaluation metrics."
          >
            <BarChart2 className="card-icon" />
            <h3>Data-Driven Insights</h3>
            <p>Make informed decisions with comprehensive analytics and evaluation metrics.</p>
          </motion.div>
          <motion.div
            className="search-card"
            variants={cardVariants}
            whileHover="hover"
            tabIndex={0}
            aria-label="Inclusive Community: Join a network of educators committed to accessible education for all students."
          >
            <Users className="card-icon" />
            <h3>Inclusive Community</h3>
            <p>Join a network of educators committed to accessible education for all students.</p>
          </motion.div>
          <motion.div
            className="search-card"
            variants={cardVariants}
            whileHover="hover"
            tabIndex={0}
            aria-label="Trusted Reviews: Access verified reviews from educational professionals and institutions."
          >
            <Shield className="card-icon" />
            <h3>Trusted Reviews</h3>
            <p>Access verified reviews from educational professionals and institutions.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SearchArea;