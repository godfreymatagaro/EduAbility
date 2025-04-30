import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, Star, X, ChevronLeft, ChevronRight, Eye, Ear, Keyboard, Brain, Compare } from 'lucide-react';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchTech.css';

// Determine the API URL based on the environment
const API_URL = import.meta.env.NODE_ENV === 'production'
  ? import.meta.env.VITE_API_PROD_BACKEND_URL
  : import.meta.env.VITE_API_DEV_BACKEND_URL;

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
  const [selectedTechs, setSelectedTechs] = useState([]); // For comparison
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch technologies on component mount
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
        setTechnologies(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setTechnologies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  // Apply filters and sorting to technologies
  const filteredTechnologies = technologies.filter((tech) => {
    // Category filter
    const categoryMatch = Object.keys(categoryFilters).some(
      (key) => categoryFilters[key] && tech.category && tech.category.toLowerCase() === key
    );
    if (Object.values(categoryFilters).some(Boolean) && !categoryMatch) {
      return false;
    }

    // Cost filter
    let costMatch = true;
    if (Object.values(costFilters).some(Boolean)) {
      costMatch = false;
      if (costFilters.free && tech.cost === 'free') costMatch = true;
      if (costFilters.low && tech.cost === 'paid' && parseFloat(tech.price || 0) <= 50) costMatch = true;
      if (costFilters.medium && tech.cost === 'paid' && parseFloat(tech.price || 0) > 50 && parseFloat(tech.price || 0) <= 200) costMatch = true;
      if (costFilters.high && tech.cost === 'paid' && parseFloat(tech.price || 0) > 200) costMatch = true;
    }
    if (!costMatch) return false;

    // Rating filter
    const avgRating = tech.coreVitals?.featuresRating || 0;
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

  // Sort technologies
  const sortedTechnologies = [...filteredTechnologies].sort((a, b) => {
    if (sortOption === 'Newest') {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    }
    if (sortOption === 'Highest Rated') {
      const ratingA = a.coreVitals?.featuresRating || 0;
      const ratingB = b.coreVitals?.featuresRating || 0;
      return ratingB - ratingA;
    }
    // Default: Most Popular (sort by name for simplicity)
    return a.name.localeCompare(b.name);
  });

  // Pagination
  const itemsPerPage = 3;
  const totalPages = Math.ceil(sortedTechnologies.length / itemsPerPage);
  const paginatedTechnologies = sortedTechnologies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fetch search results using /api/technology/search
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearchModalOpen(true);
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/technology/search?q=${encodeURIComponent(searchQuery)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch search results: ${response.status} ${response.statusText}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle technology selection for comparison
  const handleSelectTech = (tech) => {
    if (selectedTechs.length >= 5) {
      alert('Maximum 5 technologies can be compared!');
      return;
    }
    if (!selectedTechs.some(t => t._id === tech._id)) {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  // Remove technology from comparison
  const handleRemoveTech = (id) => {
    setSelectedTechs(selectedTechs.filter(tech => tech._id !== id));
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.3, ease: 'easeIn' },
    },
  };

  const handleCategoryChange = (filter) => {
    setCategoryFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
    setCurrentPage(1);
  };

  const handleCostChange = (filter) => {
    setCostFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
    setCurrentPage(1);
  };

  const handleRatingChange = (filter) => {
    setRatingFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
    setCurrentPage(1);
  };

  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    setIsSortModalOpen(false);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <motion.section
      className="search-tech-section"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="search-tech-container">
        {/* Selected Technologies for Comparison */}
        {selectedTechs.length > 0 && (
          <div className="selected-techs">
            <h3>Selected for Comparison</h3>
            <div className="selected-tech-list">
              {selectedTechs.map(tech => (
                <div key={tech._id} className="selected-tech-item">
                  <span>{tech.name}</span>
                  <button
                    onClick={() => handleRemoveTech(tech._id)}
                    className="remove-tech-button"
                    aria-label={`Remove ${tech.name} from comparison`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <Link to="/tech-comparison" state={{ selectedTechs }}>
                <Button variant="filled" size="md" className="compare-button">
                  Compare Now ({selectedTechs.length})
                </Button>
              </Link>
            </div>
          </div>
        )}

        <div className="search-tech-header">
          <div className="search-bar-wrapper">
            <div className="search-bar">
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="sort-by">
            <label>Sort by:</label>
            <button
              className="sort-button"
              onClick={() => setIsSortModalOpen(true)}
            >
              {sortOption}
              <ChevronDown className="dropdown-icon" />
            </button>
          </div>
        </div>
        <div className="search-tech-content">
          <div className="filters">
            <h3>Filters</h3>
            <div className="filter-group">
              <h4>Category</h4>
              <label>
                <input
                  type="checkbox"
                  checked={categoryFilters.visual}
                  onChange={() => handleCategoryChange('visual')}
                />
                <span>Visual</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={categoryFilters.auditory}
                  onChange={() => handleCategoryChange('auditory')}
                />
                <span>Auditory</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={categoryFilters.physical}
                  onChange={() => handleCategoryChange('physical')}
                />
                <span>Physical</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={categoryFilters.cognitive}
                  onChange={() => handleCategoryChange('cognitive')}
                />
                <span>Cognitive</span>
              </label>
            </div>
            <div className="filter-group">
              <h4>Cost</h4>
              <label>
                <input
                  type="checkbox"
                  checked={costFilters.free}
                  onChange={() => handleCostChange('free')}
                />
                <span>Free</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={costFilters.low}
                  onChange={() => handleCostChange('low')}
                />
                <span>$1-$50</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={costFilters.medium}
                  onChange={() => handleCostChange('medium')}
                />
                <span>$51-$200</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={costFilters.high}
                  onChange={() => handleCostChange('high')}
                />
                <span>$200+</span>
              </label>
            </div>
            <div className="filter-group">
              <h4>Rating</h4>
              <label>
                <input
                  type="checkbox"
                  checked={ratingFilters.fourPlus}
                  onChange={() => handleRatingChange('fourPlus')}
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
                  onChange={() => handleRatingChange('threePlus')}
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
          <div className="tech-cards-wrapper">
            {loading && <p>Loading technologies...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            {!loading && !error && sortedTechnologies.length === 0 && (
              <p>No technologies found.</p>
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
                  key={tech._id}
                  className="tech-card"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <h3>{tech.name}</h3>
                  <p>{tech.description}</p>
                  <div className="tech-card-actions">
                    <Link to={`/tech-details/${tech._id}`}>
                      <Button
                        variant="filled"
                        size="md"
                        className="tech-card-button glow"
                        ariaLabel={`Learn more about ${tech.name}`}
                      >
                        Learn More
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => handleSelectTech(tech)}
                      className="compare-button"
                      ariaLabel={`Add ${tech.name} to comparison`}
                      disabled={selectedTechs.some(t => t._id === tech._id)}
                    >
                      <Compare size={16} /> Compare
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="pagination">
              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="pagination-icon" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  className={`pagination-number ${
                    currentPage === index + 1 ? 'active' : ''
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="pagination-arrow"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
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
              <button className="category-button">
                <Eye className="category-icon" />
                Visual Aid
              </button>
              <button className="category-button">
                <Ear className="category-icon" />
                Hearing Aid
              </button>
              <button className="category-button">
                <Keyboard className="category-icon" />
                Physical Keyboard
              </button>
              <button className="category-button">
                <Brain className="category-icon" />
                Cognitive Aid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Modal */}
      <AnimatePresence>
        {isSearchModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchModalOpen(false)}
          >
            <motion.div
              className="modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setIsSearchModalOpen(false)}
              >
                <X className="modal-close-icon" />
              </button>
              <h2>Search Results for "{searchQuery}"</h2>
              <div className="modal-results">
                {loading && <p>Loading search results...</p>}
                {error && <p className="error-message">Error: {error}</p>}
                {!loading && !error && searchResults.length === 0 && (
                  <p>No results found for "{searchQuery}".</p>
                )}
                {searchResults.map((tech) => (
                  <div key={tech._id} className="modal-result-item">
                    <h3>{tech.name}</h3>
                    <p>{tech.description}</p>
                    <div className="modal-result-actions">
                      <Link to={`/tech-details/${tech._id}`}>
                        <Button
                          variant="filled"
                          size="sm"
                          ariaLabel={`Learn more about ${tech.name}`}
                        >
                          Learn More
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelectTech(tech)}
                        ariaLabel={`Add ${tech.name} to comparison`}
                        disabled={selectedTechs.some(t => t._id === tech._id)}
                      >
                        <Compare size={16} /> Compare
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort Options Modal */}
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
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setIsSortModalOpen(false)}
              >
                <X className="modal-close-icon" />
              </button>
              <h2>Sort Options</h2>
              <div className="sort-options">
                <button
                  className={`sort-option ${
                    sortOption === 'Most Popular' ? 'active' : ''
                  }`}
                  onClick={() => handleSortOptionSelect('Most Popular')}
                >
                  Most Popular
                </button>
                <button
                  className={`sort-option ${
                    sortOption === 'Newest' ? 'active' : ''
                  }`}
                  onClick={() => handleSortOptionSelect('Newest')}
                >
                  Newest
                </button>
                <button
                  className={`sort-option ${
                    sortOption === 'Highest Rated' ? 'active' : ''
                  }`}
                  onClick={() => handleSortOptionSelect('Highest Rated')}
                >
                  Highest Rated
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default SearchTech;