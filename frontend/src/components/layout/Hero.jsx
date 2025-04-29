// src/components/Hero.js
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import heroImage from '../../assets/images/hero-image.png';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  // Container animation with stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4, // Dreamy pacing
        delayChildren: 0.3,
      },
    },
  };

  // Text animation with scale and glow
  const textVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut', type: 'spring', stiffness: 80 },
    },
  };

  // Button animation (simple fade-in, no hover/tap effects)
  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  // Image animation with floating effect
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut', type: 'spring', stiffness: 60 },
    },
    float: {
      y: [-10, 10], // Gentle floating
      transition: { duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' },
    },
  };

  // Overlay animation for gradient and sparkle
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.6, // Soft gradient overlay
      transition: { duration: 1.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      className="hero"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      // Respect reduced motion preferences
      {...(window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? { transition: { duration: 0 } }
        : {})}
    >
      <motion.div
        className="hero-overlay"
        variants={overlayVariants}
        // Subtle sparkle animation
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      />
      <div className="hero-container">
        <motion.div className="hero-text" variants={containerVariants}>
          <motion.h1 variants={textVariants}>Empower Inclusive Education</motion.h1>
          <motion.p variants={textVariants}>
            Accessible tool for evaluating educational assistive technology.
            Helping educators make informed decisions for inclusive learning
            environments.
          </motion.p>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="compare"
              size="md"
              onClick={() => navigate('/technologies')}
              ariaLabel="Explore Technologies"
            >
              Explore Technologies
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-image"
          variants={imageVariants}
          animate="float"
          // Subtle drag for dreamy interaction
          drag
          dragConstraints={{ left: -15, right: 15, top: -15, bottom: 15 }}
          dragElastic={0.2}
        >
          <img src={heroImage} alt="Inclusive education illustration" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;