import React, { useState, useEffect, useRef, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Star, X, ChevronLeft, ChevronRight, Eye, Ear, Keyboard, Brain, History, Mic } from 'lucide-react';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchTech.css';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '1rem', color: 'red' }}>
          Error: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_PROD_BACKEND_URL
    : import.meta.env.VITE_API_DEV_BACKEND_URL;

const finalAPI_URL = API_URL || (import.meta.env.MODE === "production" ? "https://eduability.onrender.com" : "http://localhost:3000");

const SearchTech = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilters, setCategoryFilters] = useState({
    visual: false,
    auditory: false,
    physical: false,
    cognitive: false,
  });
  const [costFilters, setCostFilters] = useState({
    free: false,
    low: false,
    medium: false,
    high: false,
  });
  const [ratingFilters, setRatingFilters] = useState({
    fourPlus: false,
    threePlus: false,
  });
  const [sortOption, setSortOption] = useState('Most Popular');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [technologies, setTechnologies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [speechStatus, setSpeechStatus] = useState('');
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const searchInputRef = useRef(null);
  const searchModalRef = useRef(null);
  const sortModalRef = useRef(null);
  const firstSearchFocusableRef = useRef(null);
  const lastSearchFocusableRef = useRef(null);
  const firstSortFocusableRef = useRef(null);
  const lastSortFocusableRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // Initialize speech synthesis voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      console.log('Voices loaded:', availableVoices);
      setVoices(availableVoices);
      if (availableVoices.length === 0) {
        setSpeechStatus('No voices available for text-to-speech. Try Chrome or check system settings.');
      } else {
        setSpeechStatus('');
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      setSpeechStatus('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      console.log('Speech recognition not supported');
      return;
    }
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript received:', transcript);
      setSearchQuery(transcript);
      setListening(false);
      if (voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance(`Searching for ${transcript}`);
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeechStatus('No voices available to confirm search.');
      }
    };
    recognitionRef.current.onerror = (event) => {
      setSpeechStatus(`Speech recognition error: ${event.error}`);
      setListening(false);
      console.error('Speech recognition error:', event.error);
    };
    recognitionRef.current.onend = () => {
      setListening(false);
      console.log('Speech recognition ended');
    };
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voices]);

  // Auto-focus input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Load search history
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(storedHistory);
    console.log('Search history loaded:', storedHistory);
  }, []);

  // Fetch technologies
  useEffect(() => {
    const fetchTechnologies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${finalAPI_URL}/api/technologies`);
        console.log('Fetch technologies status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch technologies: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Technologies data:', data);
        setTechnologies(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setTechnologies([]);
        console.error('Fetch technologies error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTechnologies();
  }, []);

  // Heuristic search function
  const heuristicSearch = (query, dataset) => {
    if (!query.trim()) return [];
    const normalizedQuery = query.toLowerCase();
    const queryTokens = normalizedQuery.split(/\s+/);
    return dataset
      .map(item => {
        let score = 0;
        if (item.name?.toLowerCase().includes(normalizedQuery)) score += 0.4;
        else if (item.name?.toLowerCase().split(/\s+/).some(word => queryTokens.includes(word))) score += 0.2;
        if (item.category?.toLowerCase().includes(normalizedQuery)) score += 0.3;
        const keyFeatures = item.keyFeatures ? item.keyFeatures.toLowerCase().split(', ') : [];
        const featureMatches = keyFeatures.filter(feature => queryTokens.some(token => feature.includes(token)));
        score += featureMatches.length * 0.1;
        if (item.description?.toLowerCase().includes(normalizedQuery)) score += 0.15;
        const easeOfUse = parseFloat(item.coreVitals?.easeOfUse) || 0;
        const featuresRating = parseFloat(item.coreVitals?.featuresRating) || 0;
        score += (easeOfUse / 5) * 0.1;
        score += (featuresRating / 5) * 0.1;
        const tags = [item.category?.toLowerCase(), ...keyFeatures].filter(Boolean);
        const tagMatches = tags.filter(tag => queryTokens.some(token => tag.includes(token)));
        score += tagMatches.length * 0.05;
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  // Fetch search results with heuristic search
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setLoading(false);
        console.log('Empty search query, cleared results');
        return;
      }
      setLoading(true);
      setError(null);
      console.log('Fetching search results for:', searchQuery, 'API_URL:', finalAPI_URL);
      try {
        const response = await fetch(`${finalAPI_URL}/ ****/api/technology/search?q=${encodeURIComponent(searchQuery)}`);
        console.log('Search API response status:', response.status);
        let data = [];
        if (!response.ok) {
          console.log('API failed, falling back to client-side search');
          data = heuristicSearch(searchQuery, technologies);
        } else {
          data = await response.json();
          console.log('Raw search API data:', data);
          data = Array.isArray(data) ? heuristicSearch(searchQuery, data) : [];
        }
        setSearchResults(data);
        console.log('Scored search results:', data);
        if (voices.length > 0) {
          const voice = voices.find(v => v.lang === 'en-US') || voices[0];
          const utterance = new SpeechSynthesisUtterance(
            data.length > 0
              ? `Found ${data.length} results. Top result: ${data[0]?.name || 'Unknown'}`
              : 'No results found.'
          );
          utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
        } else {
          setSpeechStatus('No voices available to announce results.');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message);
        const filteredResults = heuristicSearch(searchQuery, technologies);
        setSearchResults(filteredResults);
        setSpeechStatus(`Search error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchQuery, technologies, voices]);

  // Focus trap for modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (isSearchModalOpen) {
          if (e.shiftKey && document.activeElement === firstSearchFocusableRef.current) {
            e.preventDefault();
            lastSearchFocusableRef.current?.focus();
          } else if (!e.shiftKey && document.activeElement === lastSearchFocusableRef.current) {
            e.preventDefault();
            firstSearchFocusableRef.current?.focus();
          }
        } else if (isSortModalOpen) {
          if (e.shiftKey && document.activeElement === firstSortFocusableRef.current) {
            e.preventDefault();
            lastSortFocusableRef.current?.focus();
          } else if (!e.shiftKey && document.activeElement === lastSortFocusableRef.current) {
            e.preventDefault();
            firstSortFocusableRef.current?.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, isSortModalOpen]);

  // Close modals on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isSearchModalOpen && searchModalRef.current && !searchModalRef.current.contains(e.target) && !searchInputRef.current.contains(e.target)) {
        setIsSearchModalOpen(false);
        searchInputRef.current?.focus();
        console.log('Search modal closed via outside click');
      }
      if (isSortModalOpen && sortModalRef.current && !sortModalRef.current.contains(e.target)) {
        setIsSortModalOpen(false);
        console.log('Sort modal closed via outside click');
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isSearchModalOpen, isSortModalOpen]);

  // Arrow key navigation for search modal
  const handleSearchModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchModalOpen(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setListening(false);
      }
      searchInputRef.current?.focus();
      if (voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance('Search modal closed.');
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeechStatus('No voices available to confirm modal close.');
      }
      console.log('Search modal closed via Escape');
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = searchModalRef.current?.querySelectorAll('.search-result-item, .search-history-item');
      if (!items) return;
      const currentIndex = Array.from(items).indexOf(document.activeElement);
      let nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex >= items.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = items.length - 1;
      items[nextIndex]?.focus();
    }
  };

  // Toggle voice recognition
  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) {
      setSpeechStatus('Speech recognition not supported in this browser.');
      console.log('Speech recognition not supported');
      return;
    }
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      if (voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance('Voice input stopped.');
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeechStatus('No voices available to confirm stop.');
      }
      console.log('Voice input stopped');
    } else if (!window.speechSynthesis.speaking) {
      recognitionRef.current.start();
      setListening(true);
      setIsSearchModalOpen(true);
      if (voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance('Voice input started. Please speak your search query.');
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeechStatus('No voices available to confirm start.');
      }
      console.log('Voice input started');
    } else {
      setSpeechStatus('Please wait, system is currently speaking.');
      console.log('Cannot start voice input, currently speaking');
    }
  };

  // Handle search selection
  const handleSelectItem = (item) => {
    if (typeof item === 'string') {
      setSearchQuery(item);
      const updatedHistory = [item, ...searchHistory.filter((term) => term !== item)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setIsSearchModalOpen(false);
      if (voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance(`Selected recent search: ${item}`);
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeechStatus('No voices available for selection confirmation.');
      }
      console.log('Selected history item:', item);
    } else {
      setSearchQuery(item.name || '');
      const updatedHistory = [item.name || '', ...searchHistory.filter((term) => term !== item.name)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setIsSearchModalOpen(false);
      if (item._id) {
        navigate(`/tech-details/${item._id}`);
        if (voices.length > 0) {
          const voice = voices.find(v => v.lang === 'en-US') || voices[0];
          const utterance = new SpeechSynthesisUtterance(`Selected ${item.name || 'technology'}. Navigating to details.`);
          utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
        } else {
          setSpeechStatus('No voices available for navigation confirmation.');
        }
      }
      console.log('Selected result:', item.name);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
    searchInputRef.current?.focus();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchModalOpen(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
    searchInputRef.current?.focus();
    if (voices.length > 0) {
      const voice = voices.find(v => v.lang === 'en-US') || voices[0];
      const utterance = new SpeechSynthesisUtterance('Search cleared.');
      utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } else {
      setSpeechStatus('No voices available to confirm clear.');
    }
    console.log('Search cleared');
  };

  const handleClearFilters = () => {
    setCategoryFilters({ visual: false, auditory: false, physical: false, cognitive: false });
    setCostFilters({ free: false, low: false, medium: false, high: false });
    setRatingFilters({ fourPlus: false, threePlus: false });
    setCurrentPage(1);
    if (voices.length > 0) {
      const voice = voices.find(v => v.lang === 'en-US') || voices[0];
      const utterance = new SpeechSynthesisUtterance('Filters cleared.');
      utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } else {
      setSpeechStatus('No voices available to confirm filters clear.');
    }
    console.log('Filters cleared');
  };

  // Filter and sort logic
  const filteredTechnologies = technologies.filter((tech) => {
    const categoryMatch = Object.keys(categoryFilters).some(
      (key) => categoryFilters[key] && tech.category?.toLowerCase() === key
    );
    if (Object.values(categoryFilters).some(Boolean) && !categoryMatch) return false;
    let costMatch = true;
    if (Object.values(costFilters).some(Boolean)) {
      costMatch = false;
      if (costFilters.free && tech.cost === 'free') costMatch = true;
      if (costFilters.low && tech.cost === 'paid' && parseFloat(tech.price || 0) <= 50) costMatch = true;
      if (costFilters.medium && tech.cost === 'paid' && parseFloat(tech.price || 0) > 50 && parseFloat(tech.price || 0) <= 200) costMatch = true;
      if (costFilters.high && tech.cost === 'paid' && parseFloat(tech.price || 0) > 200) costMatch = true;
    }
    if (!costMatch) return false;
    const avgRating = parseFloat(tech.coreVitals?.featuresRating) || 0;
    const ratingMatch = Object.keys(ratingFilters).every((key) => {
      if (ratingFilters[key]) {
        if (key === 'fourPlus' && avgRating < 4) return false;
        if (key === 'threePlus' && avgRating < 3) return false;
      }
      return true;
    });
    if (Object.values(ratingFilters).some(Boolean) && !ratingMatch) return false;
    return true;
  });

  const sortedTechnologies = [...filteredTechnologies].sort((a, b) => {
    if (sortOption === 'Newest') {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    }
    if (sortOption === 'Highest Rated') {
      const ratingA = parseFloat(a.coreVitals?.featuresRating) || 0;
      const ratingB = parseFloat(b.coreVitals?.featuresRating) || 0;
      return ratingB - ratingA;
    }
    return (a.name || '').localeCompare(b.name || '');
  });

  // Pagination
  const itemsPerPage = 3;
  const totalPages = Math.ceil(sortedTechnologies.length / itemsPerPage);
  const paginatedTechnologies = sortedTechnologies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Truncate description to 10 words
  const truncateDescription = (description) => {
    const words = (description || '').split(' ');
    return words.slice(0, 10).join(' ') + (words.length > 10 ? '...' : '');
  };

  // Pagination button logic
  const maxVisiblePages = 4;
  const pageNumbers = [];
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };
  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    hover: { scale: 1.02, transition: { duration: 0.3, ease: 'easeOut' } },
  };
  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <ErrorBoundary>
      <motion.section
        className="search-tech-section"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="search-tech-container">
          <div className="search-tech-header" role="search">
            <div className="search-bar-wrapper">
              <div className="search-bar">
                <Search className="search-icon" aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  id="search-input"
                  type="text"
                  className="search-input"
                  placeholder="Search technologies or use voice input"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    console.log('Input changed:', e.target.value);
                  }}
                  onClick={() => setIsSearchModalOpen(true)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      const updatedHistory = [searchQuery, ...searchHistory.filter((term) => term !== searchQuery)].slice(0, 5);
                      setSearchHistory(updatedHistory);
                      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
                      console.log('Enter pressed, search triggered');
                    }
                  }}
                  aria-label="Search technologies or use voice input"
                  aria-describedby="search-instructions"
                  aria-expanded={isSearchModalOpen}
                  aria-controls="search-modal"
                />
                <span id="search-instructions" className="visually-hidden">
                  Type or use voice to search assistive technologies. Press Enter to submit or use arrow keys to navigate results. Press microphone button to start voice input.
                </span>
                <div className="search-buttons">
                  {searchQuery && (
                    <button
                      ref={firstSearchFocusableRef}
                      onClick={handleClearSearch}
                      className="search-clear"
                      aria-label="Clear search input"
                    >
                      <X />
                    </button>
                  )}
                  <button
                    onClick={toggleVoiceRecognition}
                    className={`voice-button ${listening ? 'listening' : ''} ${window.speechSynthesis.speaking ? 'speaking' : ''}`}
                    aria-label={listening ? 'Stop voice input' : window.speechSynthesis.speaking ? 'Voice input paused while speaking' : 'Start voice input'}
                    aria-pressed={listening}
                    disabled={window.speechSynthesis.speaking}
                  >
                    <Mic />
                  </button>
                </div>
              </div>
              {speechStatus && (
                <p className="speech-status" aria-live="polite">
                  {speechStatus}
                </p>
              )}
              <AnimatePresence>
                {isSearchModalOpen && (
                  <motion.div
                    className="search-modal"
                    ref={searchModalRef}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={modalVariants}
                    onKeyDown={handleSearchModalKeyDown}
                    role="dialog"
                    aria-labelledby="search-modal-title"
                    tabIndex={-1}
                  >
                    <h2 id="search-modal-title" className="visually-hidden">
                      Search Results and History
                    </h2>
                    <div className="search-modal-content" aria-live="polite">
                      {searchQuery && (
                        <div className="search-results-section">
                          <h3>Results</h3>
                          {loading && <p>Loading...</p>}
                          {error && (
                            <p className="error-message" aria-live="assertive">
                              Error: {error}. Please try again.
                            </p>
                          )}
                          {!loading && !error && searchResults.length === 0 && (
                            <p>No results found.</p>
                          )}
                          {searchResults.map((result, index) => (
                            <div
                              key={result._id || `result-${index}`}
                              className="search-result-item"
                              onClick={() => handleSelectItem(result)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSelectItem(result)}
                              tabIndex={0}
                              role="option"
                              aria-selected={false}
                              ref={index === searchResults.length - 1 && !searchHistory.length ? lastSearchFocusableRef : null}
                            >
                              <span>{result.name || 'Unknown'}</span>
                              <span className="result-category">({result.category || 'N/A'})</span>
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
                            ref={index === searchHistory.length - 1 ? lastSearchFocusableRef : null}
                          >
                            {term}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="sort-by">
              <label id="sort-label" className="visually-hidden">Sort technologies by</label>
              <button
                className="sort-button"
                onClick={() => setIsSortModalOpen(true)}
                aria-labelledby="sort-label"
                aria-expanded={isSortModalOpen}
                aria-controls="sort-modal"
              >
                Sort by: {sortOption}
                <ChevronDown className="dropdown-icon" />
              </button>
            </div>
          </div>
          <div className="search-tech-content">
            <div className="filters" aria-live="polite">
              <h3>Filters</h3>
              <Button
                variant="outline"
                size="sm"
                className="clear-filters-button"
                onClick={handleClearFilters}
                aria-label="Clear all filters"
              >
                Clear All Filters
              </Button>
              <div className="filter-group">
                <h4 id="category-filter">Category</h4>
                <span id="category-desc" className="visually-hidden">
                  Select categories to filter technologies by disability type.
                </span>
                <label>
                  <input
                    type="checkbox"
                    checked={categoryFilters.visual}
                    onChange={() => setCategoryFilters(prev => ({ ...prev, visual: !prev.visual }))}
                    aria-describedby="category-desc"
                  />
                  <span>Visual</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={categoryFilters.auditory}
                    onChange={() => setCategoryFilters(prev => ({ ...prev, auditory: !prev.auditory }))}
                    aria-describedby="category-desc"
                  />
                  <span>Auditory</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={categoryFilters.physical}
                    onChange={() => setCategoryFilters(prev => ({ ...prev, physical: !prev.physical }))}
                    aria-describedby="category-desc"
                  />
                  <span>Physical</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={categoryFilters.cognitive}
                    onChange={() => setCategoryFilters(prev => ({ ...prev, cognitive: !prev.cognitive }))}
                    aria-describedby="category-desc"
                  />
                  <span>Cognitive</span>
                </label>
              </div>
              <div className="filter-group">
                <h4 id="cost-filter">Cost</h4>
                <span id="cost-desc" className="visually-hidden">
                  Select cost ranges to filter technologies by price.
                </span>
                <label>
                  <input
                    type="checkbox"
                    checked={costFilters.free}
                    onChange={() => setCostFilters(prev => ({ ...prev, free: !prev.free }))}
                    aria-describedby="cost-desc"
                  />
                  <span>Free</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={costFilters.low}
                    onChange={() => setCostFilters(prev => ({ ...prev, low: !prev.low }))}
                    aria-describedby="cost-desc"
                  />
                  <span>$1-$50</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={costFilters.medium}
                    onChange={() => setCostFilters(prev => ({ ...prev, medium: !prev.medium }))}
                    aria-describedby="cost-desc"
                  />
                  <span>$51-$200</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={costFilters.high}
                    onChange={() => setCostFilters(prev => ({ ...prev, high: !prev.high }))}
                    aria-describedby="cost-desc"
                  />
                  <span>$200+</span>
                </label>
              </div>
              <div className="filter-group">
                <h4 id="rating-filter">Rating</h4>
                <span id="rating-desc" className="visually-hidden">
                  Select minimum ratings to filter technologies by user reviews.
                </span>
                <label>
                  <input
                    type="checkbox"
                    checked={ratingFilters.fourPlus}
                    onChange={() => setRatingFilters(prev => ({ ...prev, fourPlus: !prev.fourPlus }))}
                    aria-describedby="rating-desc"
                  />
                  <span>
                    <Star className="rating-star" />
                    <Star className="rating-star" />
                    <Star className="rating-star" />
                    <Star className="rating-star" />
                    & up
                  </span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={ratingFilters.threePlus}
                    onChange={() => setRatingFilters(prev => ({ ...prev, threePlus: !prev.threePlus }))}
                    aria-describedby="rating-desc"
                  />
                  <span>
                    <Star className="rating-star" />
                    <Star className="rating-star" />
                    <Star className="rating-star" />
                    & up
                  </span>
                </label>
              </div>
            </div>
            <div className="tech-cards-wrapper" aria-live="polite">
              {loading && <p>Loading technologies...</p>}
              {error && (
                <p className="error-message" aria-live="assertive">
                  Error: {error}. Please try again or contact support.
                </p>
              )}
              {!loading && !error && sortedTechnologies.length === 0 && (
                <p>No technologies found. Try adjusting your filters.</p>
              )}
              <motion.div
                className="tech-cards"
                variants={cardContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {paginatedTechnologies.map((tech) => (
                  <motion.div
                    key={tech._id || `tech-${Math.random()}`}
                    className="tech-card"
                    variants={cardVariants}
                    whileHover="hover"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && tech._id) {
                        navigate(`/tech-details/${tech._id}`);
                      }
                    }}
                    aria-label={`Technology: ${tech.name || 'Unknown'}, ${tech.description || 'No description'}`}
                  >
                    <div className="tech-card-header">
                      <h3>{tech.name || 'Unnamed Technology'}</h3>
                      <span className="price-tag">
                        {tech.cost === 'free' ? 'Free' : tech.price ? `$${tech.price}` : 'N/A'}
                      </span>
                    </div>
                    <p>{truncateDescription(tech.description || 'No description available')}</p>
                    <div className="tech-card-actions">
                      <Link to={tech._id ? `/tech-details/${tech._id}` : '#'}>
                        <Button
                          variant="filled"
                          size="md"
                          className="tech-card-button"
                          aria-label={`Learn more about ${tech.name || 'this technology'}`}
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <div className="pagination">
                <button
                  className="pagination-arrow"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="pagination-icon" />
                </button>
                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
                {endPage < totalPages && (
                  <>
                    <span className="pagination-ellipsis">...</span>
                    <button
                      className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
                      onClick={() => setCurrentPage(totalPages)}
                      aria-label={`Page ${totalPages}`}
                      aria-current={currentPage === totalPages ? 'page' : undefined}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  className="pagination-arrow"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="pagination-icon" />
                </button>
              </div>
            </div>
          </div>
          <div className="popular-categories-wrapper">
            <div className="popular-categories">
              <h3>Popular Categories</h3>
              <div className="category-buttons">
                <button
                  className="category-button"
                  onClick={() => setCategoryFilters({ ...categoryFilters, visual: true })}
                  aria-label="Filter by Visual Aid category"
                >
                  <Eye className="category-icon" />
                  Visual Aid
                  <span className="category-count">24 Tools</span>
                </button>
                <button
                  className="category-button"
                  onClick={() => setCategoryFilters({ ...categoryFilters, auditory: true })}
                  aria-label="Filter by Hearing Aid category"
                >
                  <Ear className="category-icon" />
                  Hearing Aid
                  <span className="category-count">12 Tools</span>
                </button>
                <button
                  className="category-button"
                  onClick={() => setCategoryFilters({ ...categoryFilters, physical: true })}
                  aria-label="Filter by Physical Aid category"
                >
                  <Keyboard className="category-icon" />
                  Physical Aid
                  <span className="category-count">15 Tools</span>
                </button>
                <button
                  className="category-button"
                  onClick={() => setCategoryFilters({ ...categoryFilters, cognitive: true })}
                  aria-label="Filter by Cognitive Aid category"
                >
                  <Brain className="category-icon" />
                  Cognitive Aid
                  <span className="category-count">8 Tools</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <AnimatePresence>
          {isSortModalOpen && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSortModalOpen(false)}
            >
              <motion.div
                className="modal-content sort-modal"
                ref={sortModalRef}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="sort-modal-title"
                tabIndex={-1}
              >
                <h2 id="sort-modal-title" className="visually-hidden">Sort Options</h2>
                <button
                  ref={firstSortFocusableRef}
                  className="modal-close"
                  onClick={() => setIsSortModalOpen(false)}
                  aria-label="Close sort options"
                >
                  <X className="modal-close-icon" />
                </button>
                <div className="sort-options">
                  {['Most Popular', 'Newest', 'Highest Rated'].map((option, index) => (
                    <button
                      key={option}
                      className={`sort-option ${sortOption === option ? 'active' : ''}`}
                      onClick={() => {
                        setSortOption(option);
                        setIsSortModalOpen(false);
                        setCurrentPage(1);
                      }}
                      aria-selected={sortOption === option}
                      ref={index === 2 ? lastSortFocusableRef : null}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    </ErrorBoundary>
  );
};

export default SearchTech;