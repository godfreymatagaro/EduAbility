import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight, Tag, Monitor, User, Plus, FileText, Headphones } from 'lucide-react';
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

  // Hardcoded JWT token
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzU1N2U4Yi0wMmYzLTQyYmQtYTkwNi1jZmU2NDk5NzdkMGYiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDU5OTEzNTcsImV4cCI6MTc0NjA3Nzc1N30.EFnagJsRqlnab0znRF1b6E6UladFwjubZCCKIm0Vtxo';

  // Fetch technology details and related technologies
  useEffect(() => {
    const fetchTechDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching tech details for ID: ${id}`); // Debug log
        console.log(`API URL: ${API_URL}/api/technologies/${id}`); // Debug log

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
        console.log('Tech Details Response:', techData); // Debug log
        setTechDetails(techData);

        // Fetch related technologies (same category, excluding current tech)
        if (techData?.category) {
          console.log(`Fetching related technologies for category: ${techData.category}`); // Debug log
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
          console.log('Related Technologies Response:', relatedData); // Debug log
          // Exclude the current technology and limit to 3
          const filteredRelated = relatedData
            .filter((tech) => tech._id !== id)
            .slice(0, 3);
          setRelatedTechnologies(filteredRelated);
        } else {
          setRelatedTechnologies([]);
        }
      } catch (err) {
        console.error('Error fetching tech details:', err); // Debug log
        setError(err.message);
        setTechDetails(null);
        setRelatedTechnologies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechDetails();
  }, [id]);

  // Framer Motion variants for animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!techDetails) return <p>Technology not found.</p>;

  return (
    <section className="tech-details-section">
      <div className="tech-details-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href="/technologies" className="breadcrumb-link">
            Technologies
          </a>
          <ChevronRight className="breadcrumb-icon" />
          <a href={`/tech-details/${techDetails._id}`} className="breadcrumb-link">
            {techDetails.name}
          </a>
          <ChevronRight className="breadcrumb-icon" />
          <span className="breadcrumb-current">{techDetails.name}</span>
        </nav>

        {/* Main Tech Display with Tabs */}
        <div className="tech-main">
          <div className="tech-image-info-card">
            <div className="tech-image-info">
              <div className="tech-image">
                <img src={techDetails.logo || 'https://modernsolutions.co.ke/wp-content/uploads/2023/11/jaws-product-image.jpg'} alt={`${techDetails.name} logo`} />
              </div>
              <div className="tech-info">
                <h1 className="tech-title">{techDetails.name}</h1>
                <div className="tech-meta">
                  <p>
                    <Tag className="meta-icon" />
                    <span><strong>Latest Version:</strong> {techDetails.version || 'N/A'}</span>
                  </p>
                  <p>
                    <Monitor className="meta-icon" />
                    <span><strong>Platform:</strong> {techDetails.platform || 'N/A'}</span>
                  </p>
                  <p>
                    <User className="meta-icon" />
                    <span><strong>Developer:</strong> {techDetails.developer || 'N/A'}</span>
                  </p>
                </div>
                <div className="tech-actions">
                  <button className="add-compare-button">
                    <Plus className="button-icon" />
                    Add to Compare
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="tech-tabs-card">
            <div className="tech-tabs">
              <div className="tab-list">
                <button
                  className={`tab ${activeTab === 'Details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Details')}
                >
                  Details
                </button>
                <button
                  className={`tab ${activeTab === 'Evaluation' ? 'active' : ''}`}
                  onClick={() => setActiveTab('Evaluation')}
                >
                  Evaluation
                </button>
              </div>
              <div className="tab-content">
                {activeTab === 'Details' && (
                  <div className="tab-pane">
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
                  <div className="tab-pane">
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
        <div className="related-tech">
          <h2>Related Technologies</h2>
          <div className="related-tech-grid">
            {relatedTechnologies.map((tech) => (
              <div key={tech._id} className="related-tech-card">
                <img src={tech.logo || 'https://modernsolutions.co.ke/wp-content/uploads/2023/11/jaws-product-image.jpg'} alt={`${tech.name} logo`} className="related-tech-image" />
                <div className="related-tech-content">
                  <h3>{tech.name}</h3>
                  <p>{tech.description}</p>
                  <a href={`/tech-details/${tech._id}`} className="learn-more-button">Learn More</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Resources */}
        <motion.div
          className="additional-resources"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <h2>Additional Resources</h2>
          <div className="resources-grid">
            <motion.div
              className="resource-card"
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
            >
              <div className="resource-icon-wrapper blue-bg">
                <FileText className="resource-icon" />
              </div>
              <h3>Documentation</h3>
              <ul>
                <li><span className="emoji">📘</span> User Manual (PDF)</li>
                <li><span className="emoji">🎥</span> Video Tutorials</li>
                <li><span className="emoji">⌨️</span> Keyboard Shortcuts Guide</li>
              </ul>
            </motion.div>
            <motion.div
              className="resource-card"
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
            >
              <div className="resource-icon-wrapper green-bg">
                <Headphones className="resource-icon" />
              </div>
              <h3>Support</h3>
              <ul>
                <li><span className="emoji">💬</span> Community Forum</li>
                <li><span className="emoji">🛠️</span> Technical Support</li>
                <li><span className="emoji">📚</span> Training Programs</li>
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechDetails;