import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Search, ChevronDown, Star, X, ChevronLeft, ChevronRight, Eye, Ear, Keyboard, Brain } from 'lucide-react';
import Button from '../common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import './SearchTech.css';

const SearchTech = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilters, setCategoryFilters] = useState({
    visual: false,
    auditory: false,
    physical: false,
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

  const technologies = [
    {
      id: 1,
      category: 'Visual',
      name: 'JAWS Screen Reader',
      description: 'Screen reader for blind and visually impaired users.',
      link: '/tech-details',
    },
    {
      id: 2,
      category: 'Auditory',
      name: 'Voice Command Plus',
      description: 'Voice recognition software with 99% accuracy.',
      link: '/tech/voice-command-plus',
    },
    {
      id: 3,
      category: 'Visual',
      name: 'Text Magnifier',
      description: 'Magnifies text for better readability.',
      link: '/tech/text-magnifier',
    },
    {
      id: 4,
      category: 'Physical',
      name: 'Adaptive Keyboard',
      description: 'Customizable keyboard for physical accessibility.',
      link: '/tech/adaptive-keyboard',
    },
    {
      id: 5,
      category: 'Cognitive',
      name: 'Mind Mapper',
      description: 'Tool to assist with cognitive organization and memory.',
      link: '/tech/mind-mapper',
    },
    {
      id: 6,
      category: 'Visual',
      name: 'Color Adjuster',
      description: 'Adjusts screen colors for visual accessibility.',
      link: '/tech/color-adjuster',
    },
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(technologies.length / itemsPerPage);
  const paginatedTechnologies = technologies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
  };

  const handleCostChange = (filter) => {
    setCostFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleRatingChange = (filter) => {
    setRatingFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  const handleSortOptionSelect = (option) => {
    setSortOption(option);
    setIsSortModalOpen(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearchModalOpen(true);
    }
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
                <span>Visual (24)</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={categoryFilters.auditory}
                  onChange={() => handleCategoryChange('auditory')}
                />
                <span>Auditory (18)</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={categoryFilters.physical}
                  onChange={() => handleCategoryChange('physical')}
                />
                <span>Physical (15)</span>
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
            <motion.div
              className="tech-cards"
              variants={cardContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {paginatedTechnologies.map((tech) => (
                <motion.div
                  key={tech.id}
                  className="tech-card"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <h3>{tech.name}</h3>
                  <p>{tech.description}</p>
                  <Link to={tech.link}>
                    <Button
                      variant="filled"
                      size="md"
                      className="tech-card-button glow"
                      ariaLabel={`Learn more about ${tech.name}`}
                    >
                      Learn More
                    </Button>
                  </Link>
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
                {technologies
                  .filter((tech) =>
                    tech.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((tech) => (
                    <div key={tech.id} className="modal-result-item">
                      <h3>{tech.name}</h3>
                      <p>{tech.description}</p>
                      <Link to={tech.link}>
                        <Button
                          variant="filled"
                          size="sm"
                          ariaLabel={`Learn more about ${tech.name}`}
                        >
                          Learn More
                        </Button>
                      </Link>
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