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
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const navigate = useNavigate();

  // Auto-focus input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(storedHistory);
  }, []);

  // Fetch real-time search results
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

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus trap for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;

      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusableRef.current) {
          e.preventDefault();
          lastFocusableRef.current?.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusableRef.current) {
          e.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Handle search submission
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
    searchInputRef.current?.focus();
  };

  // Handle modal keyboard interactions
  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
      searchInputRef.current?.focus();
    }
  };

  // Select a history item or result
  const handleSelectItem = (item) => {
    if (typeof item === 'string') {
      setSearchTerm(item);
      const updatedHistory = [item, ...searchHistory.filter((term) => term !== item)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setIsModalOpen(false);
    } else {
      setSearchTerm(item.name);
      const updatedHistory = [item.name, ...searchHistory.filter((term) => term !== item.name)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setIsModalOpen(false);
      navigate(`/tech-details/${item._id}`);
    }
    searchInputRef.current?.focus();
  };

  // Animation variants
  const searchBarVariants = {
    hidden: { width: '50%', opacity: 0 },
    visible: { width: '100%', opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

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
          <div className="search-bar" role="search">
            <Search className="search-icon" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              id="search-input"
              placeholder="Search assistive technologies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsModalOpen(true)}
              onClick={() => setIsModalOpen(true)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="search-input"
              aria-label="Search assistive technologies"
              aria-describedby="search-instructions"
              aria-expanded={isModalOpen}
              aria-controls="search-modal"
            />
            <span id="search-instructions" className="visually-hidden">
              Type to search assistive technologies. Press Enter to submit. Use arrow keys to navigate results.
            </span>
            {searchTerm && (
              <button
                ref={firstFocusableRef}
                onClick={handleClear}
                className="search-clear"
                aria-label="Clear search input"
              >
                <X />
              </button>
            )}
          </div>

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
                tabIndex={-1}
              >
                <h2 id="search-modal-title" className="visually-hidden">
                  Search Results and History
                </h2>
                <div className="search-modal-content" aria-live="polite">
                  {searchTerm && (
                    <div className="search-results-section">
                      <h3>Results</h3>
                      {loading && <p>Loading...</p>}
                      {error && (
                        <p className="error-message" aria-live="assertive">
                          Error: {error}. Please try again.
                        </p>
                      )}
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
                          role="option"
                          aria-selected={false}
                          ref={index === liveResults.length - 1 && !searchHistory.length ? lastFocusableRef : null}
                        >
                          <span>{result.name}</span>
                          <span className="result-category">({result.category})</span>
                        </div>
                      ))}
                    </div>
                  )}

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
                        role="option"
                        aria-selected={false}
                        ref={index === searchHistory.length - 1 ? lastFocusableRef : null}
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