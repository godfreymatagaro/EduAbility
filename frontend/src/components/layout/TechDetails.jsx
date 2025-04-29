import React, { useState } from 'react';
import { ChevronRight, Tag, Monitor, User, Plus, FileText, Headphones, Facebook, Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';
import './TechDetails.css';

const TechDetails = () => {
  const [activeTab, setActiveTab] = useState('Details');

  const techDetails = {
    name: 'JAWS Screen Reader',
    logo: 'https://modernsolutions.co.ke/wp-content/uploads/2023/11/jaws-product-image.jpg',
    description:
      'JAWS (Job Access With Speech) is a computer screen reader program for Microsoft Windows that allows blind and visually impaired users to read the screen either with a text-to-speech output or by a refreshable Braille display.',
    features: [
      'Advanced web navigation',
      'Multiple language support',
      'Customizable keyboard commands',
      'Braille display compatibility',
    ],
    systemRequirements: ['Windows 10 or later', '4 GB RAM minimum', '1.5 GB hard disk space'],
    latestVersion: '2025.2',
    platform: 'Windows',
    developer: 'Freedom Scientific',
  };

  const relatedTechnologies = [
    {
      id: 1,
      name: 'NVDA Screen Reader',
      description: 'Free, open-source screen reader for Windows.',
      image: 'https://modernsolutions.co.ke/wp-content/uploads/2023/11/jaws-product-image.jpg',
    },
    {
      id: 2,
      name: 'VoiceOver',
      description: 'Built-in screen reader for Apple devices.',
      image: 'https://modernsolutions.co.ke/wp-content/uploads/2023/11/jaws-product-image.jpg',
    },
    {
      id: 3,
      name: 'TalkBack',
      description: "Android's built-in screen reader.",
      image: 'https://modernsolutions.co.ke/wp-content/uploads/2023/11/jaws-product-image.jpg',
    },
  ];

  // Framer Motion variants for animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const linkVariants = {
    rest: { x: 0 },
    hover: { x: 5, transition: { duration: 0.2 } },
  };

  return (
    <section className="tech-details-section">
      <div className="tech-details-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href="/technologies" className="breadcrumb-link">
            Technologies
          </a>
          <ChevronRight className="breadcrumb-icon" />
          <a href="/technologies/jaws" className="breadcrumb-link">
            JAWS
          </a>
          <ChevronRight className="breadcrumb-icon" />
          <span className="breadcrumb-current">{techDetails.name}</span>
        </nav>

        {/* Main Tech Display with Tabs */}
        <div className="tech-main">
          <div className="tech-image-info-card">
            <div className="tech-image-info">
              <div className="tech-image">
                <img src={techDetails.logo} alt={`${techDetails.name} logo`} />
              </div>
              <div className="tech-info">
                <h1 className="tech-title">{techDetails.name}</h1>
                <div className="tech-meta">
                  <p>
                    <Tag className="meta-icon" />
                    <span><strong>Latest Version:</strong> {techDetails.latestVersion}</span>
                  </p>
                  <p>
                    <Monitor className="meta-icon" />
                    <span><strong>Platform:</strong> {techDetails.platform}</span>
                  </p>
                  <p>
                    <User className="meta-icon" />
                    <span><strong>Developer:</strong> {techDetails.developer}</span>
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
                    <p>{techDetails.description}</p>
                    <div className="tech-features">
                      <h3>Key Features</h3>
                      <ul>
                        {techDetails.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="tech-requirements">
                      <h3>System Requirements</h3>
                      <ul>
                        {techDetails.systemRequirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {activeTab === 'Evaluation' && (
                  <div className="tab-pane">
                    <p>No evaluation available yet.</p>
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
              <div key={tech.id} className="related-tech-card">
                <img src={tech.image} alt={`${tech.name} logo`} className="related-tech-image" />
                <div className="related-tech-content">
                  <h3>{tech.name}</h3>
                  <p>{tech.description}</p>
                  <button className="learn-more-button">Learn More</button>
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
              <FileText className="resource-icon" />
              <h3>Documentation</h3>
              <ul>
                <li>User Manual (PDF)</li>
                <li>Video Tutorials</li>
                <li>Keyboard Shortcuts Guide</li>
              </ul>
            </motion.div>
            <motion.div
              className="resource-card"
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
            >
              <Headphones className="resource-icon" />
              <h3>Support</h3>
              <ul>
                <li>Community Forum</li>
                <li>Technical Support</li>
                <li>Training Programs</li>
              </ul>
            </motion.div>
          </div>
        
        </motion.div>
      </div>
    </section>
  );
};

export default TechDetails;