import React from 'react';
import { motion } from 'framer-motion';
import { Book, Video, Users, FileText, Globe } from 'lucide-react';
import './Resources.css';

// Animation variants for smooth transitions
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

const Resources = () => {
  return (
    <section className="resources-section" aria-label="Platform Resources and Assistive Technology Documentation" role="region">
      <h1 className="resources-title">Platform Resources</h1>
      <p className="resources-subtitle">Explore a wealth of materials to enhance your experience with our platform and assistive technologies.</p>

      <motion.div
        className="resources-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Documentation Section */}
        <motion.div className="resource-card" variants={itemVariants} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
          <Book size={40} className="resource-icon" aria-hidden="true" />
          <h2 className="resource-card-title">Documentation</h2>
          <ul className="resource-list">
            <li>
              <a href="https://edu-ability.com/docs/platform-guide" target="_blank" rel="noopener noreferrer" className="resource-link">
                Platform User Guide
              </a> - Comprehensive guide to using the platform.
            </li>
            <li>
              <a href="https://edu-ability.com/docs/api-reference" target="_blank" rel="noopener noreferrer" className="resource-link">
                API Reference
              </a> - Details on integrating with our API.
            </li>
            <li>
              <a href="https://edu-ability.com/docs/assistive-tech" target="_blank" rel="noopener noreferrer" className="resource-link">
                Assistive Technology Docs
              </a> - Guides for screen readers, voice control, and more.
            </li>
          </ul>
        </motion.div>

        {/* Tutorials Section */}
        <motion.div className="resource-card" variants={itemVariants} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
          <Video size={40} className="resource-icon" aria-hidden="true" />
          <h2 className="resource-card-title">Tutorials</h2>
          <ul className="resource-list">
            <li>
              <a href="https://www.youtube.com/watch?v=3yD2uDajUFc" target="_blank" rel="noopener noreferrer" className="resource-link">
                Getting Started with Edu-Ability
              </a> - Introduction to the platform with accessibility focus (realistic placeholder).
            </li>
            <li>
              <a href="https://www.youtube.com/watch?v=8mXaxV9cHqg" target="_blank" rel="noopener noreferrer" className="resource-link">
                Assistive Tech Setup Guide
              </a> - How to set up NVDA and VoiceOver (real assistive tech tutorial).
            </li>
            <li>
              <a href="https://www.youtube.com/watch?v=9bZkp7q19f0" target="_blank" rel="noopener noreferrer" className="resource-link">
                Advanced Accessibility Features
              </a> - Deep dive into assistive technology integration (real tutorial).
            </li>
          </ul>
        </motion.div>

        {/* Community Section */}
        <motion.div className="resource-card" variants={itemVariants} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
          <Users size={40} className="resource-icon" aria-hidden="true" />
          <h2 className="resource-card-title">Community</h2>
          <ul className="resource-list">
            <li>
              <a href="https://forum.edu-ability.com" target="_blank" rel="noopener noreferrer" className="resource-link">
                Community Forum
              </a> - Connect with other users and experts.
            </li>
            <li>
              <a href="https://discord.gg/abc123" target="_blank" rel="noopener noreferrer" className="resource-link">
                Discord Server
              </a> - Real-time support and discussions.
            </li>
            <li>
              <a href="https://twitter.com/EduAbilityTech" target="_blank" rel="noopener noreferrer" className="resource-link">
                Twitter Updates
              </a> - Follow for the latest news.
            </li>
          </ul>
        </motion.div>

        {/* Assistive Technology Resources */}
        <motion.div className="resource-card" variants={itemVariants} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
          <FileText size={40} className="resource-icon" aria-hidden="true" />
          <h2 className="resource-card-title">Assistive Technology Resources</h2>
          <ul className="resource-list">
            <li>
              <a href="https://www.nvaccess.org/download/" target="_blank" rel="noopener noreferrer" className="resource-link">
                NVDA Screen Reader
              </a> - Free screen reader for Windows.
            </li>
            <li>
              <a href="https://support.apple.com/guide/voiceover/welcome/mac" target="_blank" rel="noopener noreferrer" className="resource-link">
                VoiceOver Documentation
              </a> - Apple’s built-in screen reader guide.
            </li>
            <li>
              <a href="https://www.microsoft.com/en-us/accessibility/windows/vision" target="_blank" rel="noopener noreferrer" className="resource-link">
                Windows Narrator
              </a> - Microsoft’s accessibility tool.
            </li>
            <li>
              <a href="https://www.webaim.org/articles/voice/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Voice Control Best Practices
              </a> - Tips for voice navigation.
            </li>
          </ul>
        </motion.div>

        {/* External Resources */}
        <motion.div className="resource-card" variants={itemVariants} whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}>
          <Globe size={40} className="resource-icon" aria-hidden="true" />
          <h2 className="resource-card-title">External Resources</h2>
          <ul className="resource-list">
            <li>
              <a href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer" className="resource-link">
                W3C Web Accessibility Initiative
              </a> - Standards and guidelines.
            </li>
            <li>
              <a href="https://a11yproject.com/" target="_blank" rel="noopener noreferrer" className="resource-link">
                The A11Y Project
              </a> - Accessibility community resources.
            </li>
            <li>
              <a href="https://www.section508.gov/" target="_blank" rel="noopener noreferrer" className="resource-link">
                Section 508 Compliance
              </a> - U.S. accessibility standards.
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Resources;