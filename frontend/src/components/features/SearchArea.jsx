import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BarChart2, Users, Shield, History, Mic } from 'lucide-react';
import './SearchArea.css';

// Environment-based API URL
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
  const [isListening, setIsListening] = useState(false);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const navigate = useNavigate();

  // Initialize Web Speech API for voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setSearchTerm(transcript);
        speak(`Searching for ${transcript}`);
      };

      recognitionRef.current.onerror = (event) => {
        const errorMessage = `Voice recognition error: ${event.error}`;
        setError(errorMessage);
        speak(errorMessage);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Voice recognition is not supported in this browser.');
      speak('Voice recognition is not supported in this browser.');
    }
  }, []);

  // Speak function for text-to-speech
  const speak = (text) => {
    if (speechSynthesisRef.current && text) {
      speechSynthesisRef.current.cancel(); // Clear any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;
      speechSynthesisRef.current.speak(utterance);
    }
  };

  // Auto-focus input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(storedHistory);
  }, []);

  // Heuristic search function
  const heuristicSearch = (query, dataset) => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();
    const queryTokens = normalizedQuery.split(/\s+/);

    return dataset
      .map(item => {
        let score = 0;

        // Name match (exact or partial)
        if (item.name.toLowerCase().includes(normalizedQuery)) {
          score += 0.4;
        } else if (item.name.toLowerCase().split(/\s+/).some(word => queryTokens.includes(word))) {
          score += 0.2;
        }

        // Category match
        if (item.category.toLowerCase().includes(normalizedQuery)) {
          score += 0.3;
        }

        // Key features match
        const keyFeatures = item.keyFeatures.toLowerCase().split(', ');
        const featureMatches = keyFeatures.filter(feature => queryTokens.some(token => feature.includes(token)));
        score += featureMatches.length * 0.1;

        // Description match
        if (item.description.toLowerCase().includes(normalizedQuery)) {
          score += 0.15;
        }

        // Core vitals boost (easeOfUse and featuresRating)
        const easeOfUse = parseFloat(item.coreVitals.easeOfUse) || 0;
        const featuresRating = parseFloat(item.coreVitals.featuresRating) || 0;
        score += (easeOfUse / 5) * 0.1; // Normalize to 0-1
        score += (featuresRating / 5) * 0.1;

        // Tag-based matching (derived from category and keyFeatures)
        const tags = [item.category.toLowerCase(), ...keyFeatures];
        const tagMatches = tags.filter(tag => queryTokens.some(token => tag.includes(token)));
        score += tagMatches.length * 0.05;

        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  // Fetch real-time search results with heuristic scoring
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
        let data = await response.json();
        data = Array.isArray(data) ? data : [];

        // Apply heuristic search
        const scoredResults = heuristicSearch(searchTerm, data);
        setLiveResults(scoredResults);

        // Speak results summary
        if (scoredResults.length > 0) {
          speak(`Found ${scoredResults.length} results. Top result: ${scoredResults[0].name}`);
        } else {
          speak('No results found.');
        }
      } catch (err) {
        setError(err.message);
        setLiveResults([]);
        speak(`Error: ${err.message}`);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    speak('Search cleared.');
  };

  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      const errorMessage = 'Voice recognition is not supported in this browser.';
      setError(errorMessage);
      speak(errorMessage);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      speak('Voice input stopped.');
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setIsModalOpen(true);
      speak('Voice input started. Please speak your search query.');
    }
  };

  // Handle modal keyboard interactions
  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
      setIsListening(false);
      recognitionRef.current?.stop();
      searchInputRef.current?.focus();
      speak('Modal closed.');
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
      speak(`Selected recent search: ${item}`);
    } else {
      setSearchTerm(item.name);
      const updatedHistory = [item.name, ...searchHistory.filter((term) => term !== item.name)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setIsModalOpen(false);
      navigate(`/tech-details/${item._id}`);
      speak(`Selected ${item.name}. Navigating to details.`);
    }
    setIsListening(false);
    recognitionRef.current?.stop();
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
              placeholder="Search assistive technologies or use voice input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsModalOpen(true)}
              onClick={() => setIsModalOpen(true)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="search-input"
              aria-label="Search assistive technologies or use voice input"
              aria-describedby="search-instructions"
              aria-expanded={isModalOpen}
              aria-controls="search-modal"
            />
            <span id="search-instructions" className="visually-hidden">
              Type or use voice to search assistive technologies. Press Enter to submit. Use arrow keys to navigate results. Press microphone button to start voice input.
            </span>
            <div className="search-buttons">
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
              <button
                onClick={toggleVoiceRecognition}
                className={`voice-button ${isListening ? 'listening' : ''}`}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                aria-pressed={isListening}
              >
                <Mic />
              </button>
            </div>
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
                          key={result._id}
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