import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BarChart2, Users, Shield } from 'lucide-react';
import './SearchArea.css';

// Mock data for live search results
const mockResults = [
  'Assistive Technology for Reading',
  'Speech-to-Text Tools',
  'Screen Readers for Accessibility',
  'Inclusive Learning Platforms',
  'Educational Apps for Visual Impairment',
];

const SearchArea = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [liveResults, setLiveResults] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (searchTerm) {
      const filtered = mockResults.filter((result) =>
        result.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setLiveResults(filtered);
      setProgress((prev) => Math.min(prev + 10, 100));
    } else {
      setLiveResults([]);
      setProgress(0);
    }
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm('');
    setLiveResults([]);
    setProgress(0);
  };

  const searchBarVariants = {
    hidden: { width: '50%', opacity: 0 },
    visible: { width: '100%', opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const resultVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
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
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search assistive technologies"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button onClick={handleClear} className="search-clear" aria-label="Clear search">
                <X />
              </button>
            )}
          </div>
          <AnimatePresence>
            {liveResults.length > 0 && (
              <motion.div
                className="search-results"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={resultVariants}
              >
                {liveResults.map((result, index) => (
                  <motion.div
                    key={index}
                    className="search-result-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {result}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {searchTerm && (
          <motion.div
            className="search-progress"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <span className="progress-text">
              {progress === 100 ? '🎉 Search Master!' : `${progress}% to Search Master`}
            </span>
          </motion.div>
        )}

        <div className="search-cards">
          <div className="search-card">
            <BarChart2 className="card-icon" />
            <h3>Data-Driven Insights</h3>
            <p>Make informed decisions with comprehensive analytics and evaluation metrics.</p>
          </div>
          <div className="search-card">
            <Users className="card-icon" />
            <h3>Inclusive Community</h3>
            <p>Join a network of educators committed to accessible education for all students.</p>
          </div>
          <div className="search-card">
            <Shield className="card-icon" />
            <h3>Trusted Reviews</h3>
            <p>Access verified reviews from educational professionals and institutions.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchArea;