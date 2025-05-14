import React, { useState, useEffect, useRef, Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BarChart2, Users, Shield, History, Mic, VolumeX } from 'lucide-react';
import './SearchArea.css';

// Environment-based API URL
const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_PROD_BACKEND_URL
    : import.meta.env.VITE_API_DEV_BACKEND_URL;

// Tavily Search API URL and Key
const TAVILY_API_URL = 'https://api.tavily.com/search';
const TAVILY_API_KEY = import.meta.env.VITE_TAVILY_API_KEY;

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

const SearchArea = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [externalResults, setExternalResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [speechStatus, setSpeechStatus] = useState('');
  const [listening, setListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState([]);
  const recognitionRef = useRef(null);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
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
      setSearchTerm(transcript);
      setListening(false);
      if (!isMuted && voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance(`Searching for ${transcript}`);
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else if (!isMuted) {
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
  }, [voices, isMuted]);

  // Auto-focus input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    setSearchHistory(storedHistory);
    console.log('Search history loaded:', storedHistory);
  }, []);

  // Heuristic search function for database results
  const heuristicSearch = (query, dataset) => {
    if (!query.trim()) return [];

    const normalizedQuery = query.toLowerCase();
    const queryTokens = normalizedQuery.split(/\s+/);

    return dataset
      .map(item => {
        let score = 0;
        if (item.name.toLowerCase().includes(normalizedQuery)) score += 0.4;
        else if (item.name.toLowerCase().split(/\s+/).some(word => queryTokens.includes(word))) score += 0.2;
        if (item.category.toLowerCase().includes(normalizedQuery)) score += 0.3;
        const keyFeatures = item.keyFeatures.toLowerCase().split(', ');
        const featureMatches = keyFeatures.filter(feature => queryTokens.some(token => feature.includes(token)));
        score += featureMatches.length * 0.1;
        if (item.description.toLowerCase().includes(normalizedQuery)) score += 0.15;
        const easeOfUse = parseFloat(item.coreVitals?.easeOfUse) || 0;
        const featuresRating = parseFloat(item.coreVitals?.featuresRating) || 0;
        score += (easeOfUse / 5) * 0.1;
        score += (featuresRating / 5) * 0.1;
        const tags = [item.category.toLowerCase(), ...keyFeatures];
        const tagMatches = tags.filter(tag => queryTokens.some(tag => queryTokens.includes(token)));
        score += tagMatches.length * 0.05;
        return { ...item, score, source: 'database' };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  // Heuristic scoring for external results
  const scoreExternalResults = (query, results) => {
    const normalizedQuery = query.toLowerCase();
    const queryTokens = normalizedQuery.split(/\s+/);
    const disabilityKeywords = [
      'disability', 'accessibility', 'assistive', 'blind', 'deaf', 'mobility',
      'visual impairment', 'hearing impairment', 'screen reader', 'voice recognition',
      'aira', 'envision glasses', 'proloquo2go', 'jaws', 'nvda', 'dragon naturallyspeaking',
      'orcam myeye', 'sunu band', 'irisvision', 'esight', 'narrator', 'voiceover',
      'talkback', 'braille display', 'zoomtext', 'glassouse', 'xander glasses', 'angelsense watch',
      'tobiidynavox', 'bookshare', 'perkins brailler', 'nueyes', 'kalogon orbiter', 'be my eyes'
    ];

    return results.map(item => {
      let score = 0;
      const title = item.title.toLowerCase();
      const content = item.content.toLowerCase();

      if (title.includes(normalizedQuery)) score += 0.4;
      if (content.includes(normalizedQuery)) score += 0.3;
      const titleTokens = title.split(/\s+/);
      const contentTokens = content.split(/\s+/);
      if (titleTokens.some(word => queryTokens.includes(word))) score += 0.2;
      if (contentTokens.some(word => queryTokens.includes(word))) score += 0.15;

      const disabilityMatchesInTitle = disabilityKeywords.filter(keyword => title.includes(keyword)).length;
      const disabilityMatchesInContent = disabilityKeywords.filter(keyword => content.includes(keyword)).length;
      score += (disabilityMatchesInTitle * 0.25) + (disabilityMatchesInContent * 0.15);

      const techMatches = disabilityKeywords.slice(10).filter(tech => title.includes(tech) || content.includes(tech));
      score += techMatches.length * 0.3;

      return { ...item, score, source: 'external', url: item.url };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  };

  // Fetch real-time search results
  useEffect(() => {
    const fetchDatabaseResults = async () => {
      if (!searchTerm.trim()) {
        setLiveResults([]);
        setExternalResults([]);
        setLoading(false);
        console.log('Empty search term, cleared results');
        return;
      }

      setLoading(true);
      setError(null);
      console.log('Fetching database results for:', searchTerm, 'API_URL:', API_URL);
      try {
        const response = await fetch(`${API_URL}/api/technologies/search?q=${encodeURIComponent(searchTerm)}`);
        console.log('Database API response status:', response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch database results: ${response.status} ${response.statusText}`);
        }
        let data = await response.json();
        console.log('Raw database API data:', data);
        data = Array.isArray(data) ? data : [];
        const scoredResults = heuristicSearch(searchTerm, data);
        setLiveResults(scoredResults);
        console.log('Scored database results:', scoredResults);

        console.log('Fetching external results');
        await fetchExternalResults();

        if (!isMuted && voices.length > 0) {
          const voice = voices.find(v => v.lang === 'en-US') || voices[0];
          const utterance = new SpeechSynthesisUtterance(
            scoredResults.length > 0
              ? `Found ${scoredResults.length} database results. Top result: ${scoredResults[0].name}`
              : 'No database results found. Checking external sources.'
          );
          utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
        } else if (!isMuted) {
          setSpeechStatus('No voices available to announce results.');
        }
      } catch (err) {
        setError(err.message);
        setLiveResults([]);
        setSpeechStatus(`Database search error: ${err.message}`);
        console.error('Database fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchExternalResults = async () => {
      console.log('Tavily API Key:', TAVILY_API_KEY);
      if (!TAVILY_API_KEY) {
        console.warn('Tavily API key not set. Skipping external search.');
        setExternalResults([]);
        setSpeechStatus('Tavily API key not set. Skipping external search.');
        return;
      }

      const refinedQuery = `${searchTerm} assistive technology OR accessibility tools OR screen reader OR braille OR speech-to-text`;
      console.log('Fetching external results from Tavily for refined query:', refinedQuery);
      console.log('Query length:', refinedQuery.length);

      try {
        const requestBody = {
          api_key: TAVILY_API_KEY,
          query: refinedQuery,
          search_depth: 'basic',
          include_answer: false,
          include_images: false,
          max_results: 5,
        };
        console.log('Tavily request body:', requestBody);

        const response = await fetch(TAVILY_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        console.log('Tavily API response status:', response.status);
        console.log('Tavily API response headers:', [...response.headers.entries()]);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch external results: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Raw Tavily API data:', data);
        const results = data.results || [];
        const scoredExternal = scoreExternalResults(searchTerm, results);
        setExternalResults(scoredExternal);
        console.log('Scored external results:', scoredExternal);

        if (!isMuted && voices.length > 0 && scoredExternal.length > 0) {
          const voice = voices.find(v => v.lang === 'en-US') || voices[0];
          const utterance = new SpeechSynthesisUtterance(
            `Found ${scoredExternal.length} external results. Top external result: ${scoredExternal[0].title}`
          );
          utterance.voice = voice;
          window.speechSynthesis.speak(utterance);
        }
      } catch (err) {
        console.error('Tavily fetch error:', err);
        setExternalResults([]);
        setSpeechStatus(`External search error: ${err.message}`);
      }
    };

    fetchDatabaseResults();
  }, [searchTerm, voices, isMuted]);

  // Combine results for display
  const combinedResults = [...liveResults, ...externalResults]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

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
        console.log('Modal closed via click outside');
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
      const updatedHistory = [searchTerm, ...searchHistory.filter(term => term !== searchTerm)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      console.log('Search submitted, history updated:', updatedHistory);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setLiveResults([]);
    setExternalResults([]);
    setIsModalOpen(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsMuted(false);
    }
    searchInputRef.current?.focus();
    if (!isMuted && voices.length > 0) {
      const voice = voices.find(v => v.lang === 'en-US') || voices[0];
      const utterance = new SpeechSynthesisUtterance('Search cleared.');
      utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    } else if (!isMuted) {
      setSpeechStatus('No voices available to confirm clear.');
    }
    console.log('Search cleared');
  };

  // Toggle voice recognition, mute, or unmute speech
  const toggleVoiceRecognition = () => {
    if (window.speechSynthesis.speaking) {
      // Mute ongoing speech
      window.speechSynthesis.cancel();
      setIsMuted(true);
      setSpeechStatus('Speech muted.');
      console.log('Speech muted');
      return;
    }

    if (isMuted && !listening) {
      // Unmute speech
      setIsMuted(false);
      setSpeechStatus('Speech unmuted.');
      console.log('Speech unmuted');
      if (voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance('Speech unmuted.');
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else {
        setSpeechStatus('No voices available to confirm unmute.');
      }
      return;
    }

    if (!recognitionRef.current) {
      setSpeechStatus('Speech recognition not supported in this browser.');
      console.log('Speech recognition not supported');
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      if (!isMuted && voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance('Voice input stopped.');
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else if (!isMuted) {
        setSpeechStatus('No voices available to confirm stop.');
      }
      console.log('Voice input stopped');
    } else {
      setIsModalOpen(true);
      if (!isMuted && voices.length > 0) {
        setSpeechStatus('Preparing to listen...');
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance('Voice input started. Please speak your search query.');
        utterance.voice = voice;
        utterance.onend = () => {
          recognitionRef.current.start();
          setListening(true);
          setSpeechStatus('Listening for your query...');
          console.log('Speech recognition started');
        };
        window.speechSynthesis.speak(utterance);
      } else {
        recognitionRef.current.start();
        setListening(true);
        setSpeechStatus('Listening for your query...');
        console.log('Speech recognition started (no voices available)');
      }
    }
  };

  // Handle modal keyboard interactions
  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsModalOpen(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setListening(false);
      }
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsMuted(false);
      }
      searchInputRef.current?.focus();
      if (!isMuted && voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance('Modal closed.');
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else if (!isMuted) {
        setSpeechStatus('No voices available to confirm modal close.');
      }
      console.log('Modal closed via Escape');
    }
  };

  // Select a history item or result
  const handleSelectItem = (item) => {
    if (typeof item === 'string') {
      setSearchTerm(item);
      const updatedHistory = [item, ...searchHistory.filter(term => term !== item)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setIsModalOpen(false);
      if (!isMuted && voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance(`Selected recent search: ${item}`);
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else if (!isMuted) {
        setSpeechStatus('No voices available for selection confirmation.');
      }
      console.log('Selected history item:', item);
    } else if (item.source === 'database') {
      setSearchTerm(item.name);
      const updatedHistory = [item.name, ...searchHistory.filter(term => term !== item.name)].slice(0, 5);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setIsModalOpen(false);
      navigate(`/tech-details/${item._id}`);
      if (!isMuted && voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance(`Selected ${item.name}. Navigating to details.`);
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else if (!isMuted) {
        setSpeechStatus('No voices available for navigation confirmation.');
      }
      console.log('Selected database result:', item.name);
    } else {
      window.open(item.url, '_blank', 'noopener,noreferrer');
      const updatedHistory = [item.title, ...searchHistory.filter(term => term !== item.title)].slice(0, 5);
      setSearchTerm(item.title);
      setSearchHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
      setIsModalOpen(false);
      if (!isMuted && voices.length > 0) {
        const voice = voices.find(v => v.lang === 'en-US') || voices[0];
        const utterance = new SpeechSynthesisUtterance(`Opening external result: ${item.title}`);
        utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
      } else if (!isMuted) {
        setSpeechStatus('No voices available for external navigation confirmation.');
      }
      console.log('Selected external result:', item.title);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsMuted(false);
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
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', type: 'spring', stiffness: 100 } },
    hover: { scale: 1.02, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <ErrorBoundary>
      <section className="search-area-section">
        <div className="search-area-container">
          <motion.div className="search-bar-wrapper" initial="hidden" animate="visible" variants={searchBarVariants}>
            <div className="search-bar" role="search">
              <Search className="search-icon" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                id="search-input"
                placeholder="Search assistive technologies or use voice input"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  console.log('Input changed:', e.target.value);
                }}
                onFocus={() => setIsModalOpen(true)}
                onClick={() => setIsModalOpen(true)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                    console.log('Enter pressed, search triggered');
                  }
                }}
                className="search-input"
                aria-label="Search assistive technologies or use voice input"
                aria-describedby="search-instructions"
                aria-expanded={isModalOpen}
                aria-controls="search-modal"
              />
              <span id="search-instructions" className="visually-hidden">
                Type or use voice to search assistive technologies. Press Enter to submit or use arrow keys to navigate results. Press microphone button to start voice input, mute, or unmute speech.
              </span>
              <div className="search-buttons">
                {searchTerm && (
                  <button ref={firstFocusableRef} onClick={handleClear} className="search-clear" aria-label="Clear search input">
                    <X />
                  </button>
                )}
                <button
                  onClick={toggleVoiceRecognition}
                  className={`voice-button ${listening ? 'listening' : ''} ${window.speechSynthesis.speaking ? 'speaking' : ''} ${isMuted ? 'muted' : ''}`}
                  aria-label={
                    isMuted ? 'Unmute speech' :
                    listening ? 'Stop voice input' :
                    window.speechSynthesis.speaking ? 'Mute speech' :
                    'Start voice input'
                  }
                  aria-pressed={listening || isMuted}
                  disabled={false}
                >
                  {isMuted ? <VolumeX /> : <Mic />}
                </button>
              </div>
            </div>
            {speechStatus && (
              <p className="speech-status" aria-live="polite">
                {speechStatus}
              </p>
            )}

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
                  <h2 id="search-modal-title" className="visually-hidden">Search Results and History</h2>
                  <div className="search-modal-content" aria-live="polite">
                    {searchTerm && (
                      <div className="search-results-section">
                        <h3>Search Results</h3>
                        {loading && <p>Loading...</p>}
                        {error && (
                          <p className="error-message" aria-live="assertive">
                            Error: {error}. Please try again.
                          </p>
                        )}
                        {!loading && !error && combinedResults.length === 0 && <p>No results found.</p>}
                        {combinedResults.map((result, index) => (
                          <div
                            key={result._id || result.url}
                            className="search-result-item"
                            onClick={() => handleSelectItem(result)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSelectItem(result)}
                            tabIndex={0}
                            role="option"
                            aria-selected={false}
                            ref={index === combinedResults.length - 1 && !searchHistory.length ? lastFocusableRef : null}
                            href={result.source === 'external' ? result.url : null}
                          >
                            <span>{result.source === 'database' ? result.name : result.title}</span>
                            {result.source === 'database' ? (
                              <span className="result-category">({result.category})</span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="search-history-section">
                      <h3>
                        <History className="history-icon" aria-hidden="true" /> Recent Searches
                      </h3>
                      {searchHistory.length == 0 && <p>No recent searches.</p>}
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

          <motion.div className="search-area-cards" initial="hidden" animate="visible" variants={cardContainerVariants}>
            <motion.div
              className="search-area-card"
              variants={cardVariants}
              whileHover="hover"
              tabIndex={0}
              aria-label="Data-driven insights: Make informed decisions with comprehensive analytics and evaluation metrics."
            >
              <BarChart2 className="card-icon" />
              <h3>Data-Driven Insights</h3>
              <p>Make informed decisions with comprehensive analytics and evaluation metrics.</p>
            </motion.div>
            <motion.div
              className="search-area-card"
              variants={cardVariants}
              whileHover="hover"
              tabIndex={0}
              aria-label="Inclusive community: Join a network of educators committed to accessible education for all students."
            >
              <Users className="card-icon" />
              <h3>Inclusive Community</h3>
              <p>Join a network of educators committed to accessible education for all students.</p>
            </motion.div>
            <motion.div
              className="search-area-card"
              variants={cardVariants}
              whileHover="hover"
              tabIndex={0}
              aria-label="Trusted reviews: Access verified reviews from educational professionals and institutions."
            >
              <Shield className="card-icon" />
              <h3>Trusted Reviews</h3>
              <p>Access verified reviews from educational professionals and institutions.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default SearchArea;