import React from 'react';
import { Search, Star, SlidersHorizontal } from 'lucide-react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AD.css';

const AD = () => {
  const navigate = useNavigate();

  // Animation variants for the section
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  // Animation variants for the cards
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
      scale: 1.05,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  // Animation variants for the button
  const buttonVariants = {
    hover: {
      scale: 1.1,
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.section
      className="ad-section"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="ad-content">
        <h2>Discover Assistive Technologies</h2>
        <motion.div
          className="ad-cards"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            className="ad-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <Search className="ad-icon" />
            <h3>Easy Search</h3>
            <p>Find the perfect tools with our powerful search features</p>
          </motion.div>
          <motion.div
            className="ad-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <Star className="ad-icon" />
            <h3>Verified Reviews</h3>
            <p>Real feedback from educators and specialists</p>
          </motion.div>
          <motion.div
            className="ad-card"
            variants={cardVariants}
            whileHover="hover"
          >
            <SlidersHorizontal className="ad-icon" />
            <h3>Compare Tools</h3>
            <p>Side-by-side comparison of features and pricing</p>
          </motion.div>
        </motion.div>
       
      </div>
    </motion.section>
  );
};

export default AD;