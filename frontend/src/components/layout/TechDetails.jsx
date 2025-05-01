import React, { useState, useEffect, useRef } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { ChevronRight, Tag, Monitor, User, Plus, FileText, Headphones, Video, Keyboard, MessageSquare, Wrench, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import './TechDetails.css';

// Determine the API URL based on the environment
const API_URL = import.meta.env.NODE_ENV === 'production'
  ? import.meta.env.VITE_API_PROD_BACKEND_URL
  : import.meta.env.VITE_API_DEV_BACKEND_URL;

const TechDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Details');
  const [techDetails, setTechDetails] = useState(null);
  const [relatedTechnologies, setRelatedTechnologies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const tabListRef = useRef(null);
  const firstTabRef = useRef(null);
  const lastTabRef = useRef(null);

  // Hardcoded JWT token
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzU1N2U4Yi0wMmYzLTQyYmQtYTkwNi1jZmU2NDk5NzdkMGYiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDU5OTEzNTcsImV4cCI6MTc0NjA3Nzc1N30.EFnagJsRqlnab0znRF1b6E6UladFwjubZCCKIm0Vtxo';

  // Fetch technology details and related technologies
  useEffect(() => {
    const fetchTechDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching tech details for ID: ${id}`);
        console.log(`API URL: ${API_URL}/api/technologies/${id}`);

        // Fetch the specific technology
        const techResponse = await fetch(`${API_URL}/api/technologies/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!techResponse.ok) {
          throw new Error(`Failed to fetch technology details: ${techResponse.status} ${techResponse.statusText}`);
        }
        const techData = await techResponse.json();
        console.log('Tech Details Response:', techData);
        setTechDetails(techData);

        // Fetch related technologies
        if (techData?.category) {
          console.log(`Fetching related technologies for category: ${techData.category}`);
          const relatedResponse = await fetch(
            `${API_URL}/api/technologies?category=${techData.category}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            }
          );
          if (!relatedResponse.ok) {
            throw new Error(`Failed to fetch related technologies: ${relatedResponse.status} ${relatedResponse.statusText}`);
          }
          const relatedData = await relatedResponse.json();
          console.log('Related Technologies Response:', relatedData);
          const filteredRelated = relatedData
            .filter((tech) => tech._id !== id)
            .slice(0, 3);
          setRelatedTechnologies(filteredRelated);
        } else {
          setRelatedTechnologies([]);
        }
      } catch (err) {
        console.error('Error fetching tech details:', err);
        setError(err.message);
        setTechDetails(null);
        setRelatedTechnologies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechDetails();
  }, [id]);

  // Handle keyboard navigation for tabs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        const tabs = tabListRef.current?.querySelectorAll('.tab');
        const currentIndex = Array.from(tabs).findIndex((tab) => tab === document.activeElement);
        let nextIndex = e.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= tabs.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = tabs.length - 1;
        tabs[nextIndex]?.focus();
        setActiveTab(tabs[nextIndex].textContent);
      }
    };
    tabListRef.current?.addEventListener('keydown', handleKeyDown);
    return () => tabListRef.current?.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Framer Motion variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  if (loading) return <p className="loading-message" aria-live="polite">Loading...</p>;
  if (error) return <p className="error-message" aria-live="assertive">Error: {error}</p>;
  if (!techDetails) return <p className="error-message" aria-live="assertive">Technology not found.</p>;

  return (
    <section className="tech-details-section" aria-label="Technology Details">
      <div className="tech-details-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <NavLink to="/technologies" className="breadcrumb-link">
            Technologies
          </NavLink>
          <ChevronRight className="breadcrumb-icon" aria-hidden="true" />
          <NavLink to={`/tech-details/${techDetails._id}`} className="breadcrumb-link">
            {techDetails.name}
          </NavLink>
          <ChevronRight className="breadcrumb-icon" aria-hidden="true" />
          <span className="breadcrumb-current" aria-current="page">{techDetails.name}</span>
        </nav>

        {/* Main Tech Display with Tabs */}
        <div className="tech-main">
          <div className="tech-image-info-card">
            <div className="tech-image-info">
              <div className="tech-image">
                <img
                  src={techDetails.image_url || 'https://modernsolutions.co.ke/wp-content/uploads/2023/11/jaws-product-image.jpg'}
                  alt={`${techDetails.name} logo`}
                  loading="lazy"
                  onError={(e) => (e.target.src = '/placeholder-image.png')} // Fallback if image_url fails
                />
              </div>
              <div className="tech-info">
                <h1 className="tech-title">{techDetails.name}</h1>
                <div className="tech-meta">
                  <p>
                    <Tag className="meta-icon" aria-hidden="true" />
                    <span><strong>Latest Version:</strong> {techDetails.version || 'N/A'}</span>
                  </p>
                  <p>
                    <Monitor className="meta-icon" aria-hidden="true" />
                    <span><strong>Platform:</strong> {techDetails.platform || 'N/A'}</span>
                  </p>
                  <p>
                    <User className="meta-icon" aria-hidden="true" />
                    <span><strong>Developer:</strong> {techDetails.developer || 'N/A'}</span>
                  </p>
                </div>
                <div className="tech-actions">
                  <NavLink
                    to={`/compare?techId=${techDetails._id}`}
                    className="add-compare-button"
                    aria-label={`Add ${techDetails.name} to compare`}
                  >
                    <Plus className="button-icon" aria-hidden="true" />
                    Add to Compare
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
          <div className="tech-tabs-card">
            <div className="tech-tabs" role="tabpanel">
              <div className="tab-list" role="tablist" ref={tabListRef} aria-label="Technology Information Tabs">
                <button
                  ref={firstTabRef}
                  className={`tab ${activeTab === 'Details' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'Details'}
                  aria-controls="details-panel"
                  id="details-tab"
                  onClick={() => setActiveTab('Details')}
                >
                  Details
                </button>
                <button
                  ref={lastTabRef}
                  className={`tab ${activeTab === 'Evaluation' ? 'active' : ''}`}
                  role="tab"
                  aria-selected={activeTab === 'Evaluation'}
                  aria-controls="evaluation-panel"
                  id="evaluation-tab"
                  onClick={() => setActiveTab('Evaluation')}
                >
                  Evaluation
                </button>
              </div>
              <div className="tab-content">
                {activeTab === 'Details' && (
                  <div className="tab-pane" id="details-panel" role="tabpanel" aria-labelledby="details-tab">
                    <p>{techDetails.description || 'No description available.'}</p>
                    <div className="tech-features">
                      <h3>Key Features</h3>
                      <ul>
                        {(techDetails.keyFeatures ? techDetails.keyFeatures.split(', ') : []).map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="tech-requirements">
                      <h3>System Requirements</h3>
                      <ul>
                        {(techDetails.systemRequirements ? techDetails.systemRequirements.split(', ') : []).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {activeTab === 'Evaluation' && (
                  <div className="tab-pane" id="evaluation-panel" role="tabpanel" aria-labelledby="evaluation-tab">
                    <h3>Core Vitals</h3>
                    <ul>
                      <li>Features Rating: {techDetails.coreVitals?.featuresRating || 'N/A'}</li>
                      <li>Ease of Use: {techDetails.coreVitals?.easeOfUse || 'N/A'}</li>
                      <li>Customer Support: {techDetails.coreVitals?.customerSupport || 'N/A'}</li>
                      <li>Value for Money: {techDetails.coreVitals?.valueForMoney || 'N/A'}</li>
                    </ul>
                    <h3>Feature Comparison</h3>
                    <ul>
                      <li>Security: {techDetails.featureComparison?.security ? 'Yes' : 'No'}</li>
                      <li>Integration: {techDetails.featureComparison?.integration ? 'Yes' : 'No'}</li>
                      <li>Support: {techDetails.featureComparison?.support ? 'Yes' : 'No'}</li>
                    </ul>
                    <p>{techDetails.evaluation || 'No additional evaluation available.'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Technologies */}
        <div className="related-tech" aria-live="polite">
          <h2>Related Technologies</h2>
          <div className="related-tech-grid">
            {relatedTechnologies.length === 0 && <p>No related technologies found.</p>}
            {relatedTechnologies.map((tech) => (
              <motion.div
                key={tech._id}
                className="related-tech-card"
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && window.location.assign(`/tech-details/${tech._id}`)}
                aria-label={`Related technology: ${tech.name}`}
              >
                <img
                  src={tech.image_url || 'https://modernsolutions.co.ke/wp-content/uploads/2023/11/jaws-product-image.jpg'}
                  alt={`${tech.name} logo`}
                  className="related-tech-image"
                  loading="lazy"
                  onError={(e) => (e.target.src = '/placeholder-image.png')} // Fallback if image_url fails
                />
                <div className="related-tech-content">
                  <h3>{tech.name}</h3>
                  <p>{tech.description}</p>
                  <NavLink to={`/tech-details/${tech._id}`} className="learn-more-button" aria-label={`Learn more about ${tech.name}`}>
                    Learn More
                  </NavLink>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <motion.div
          className="additional-resources"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          aria-label="Additional Resources"
        >
          <h2>Additional Resources</h2>
          <div className="resources-grid">
            <motion.div
              className="resource-card"
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              tabIndex={0}
              aria-label="Documentation resources"
            >
              <div className="resource-icon-wrapper blue-bg">
                <FileText className="resource-icon" aria-hidden="true" />
              </div>
              <h3>Documentation</h3>
              <ul>
                <li><BookOpen className="resource-icon small" aria-hidden="true" /> User Manual (PDF)</li>
                <li><Video className="resource-icon small" aria-hidden="true" /> Video Tutorials</li>
                <li><Keyboard className="resource-icon small" aria-hidden="true" /> Keyboard Shortcuts Guide</li>
              </ul>
            </motion.div>
            <motion.div
              className="resource-card"
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              tabIndex={0}
              aria-label="Support resources"
            >
              <div className="resource-icon-wrapper green-bg">
                <Headphones className="resource-icon" aria-hidden="true" />
              </div>
              <h3>Support</h3>
              <ul>
                <li><MessageSquare className="resource-icon small" aria-hidden="true" /> Community Forum</li>
                <li><Wrench className="resource-icon small" aria-hidden="true" /> Technical Support</li>
                <li><BookOpen className="resource-icon small" aria-hidden="true" /> Training Programs</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechDetails;