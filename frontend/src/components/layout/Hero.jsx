import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import heroImage from '../../assets/images/hero-image.png';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  // Container animation for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Stagger each child by 0.3s
        delayChildren: 0.2,
      },
    },
  };

  // Text and button animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Image animation with subtle scale and opacity
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut', delay: 0.4 },
    },
    hover: {
      y: -10, // Subtle parallax-like lift on hover
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  // Button hover and tap animation
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
    hover: { scale: 1.05, boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' },
    tap: { scale: 0.95 },
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
      <div className="hero-container">
        <motion.div className="hero-text" variants={containerVariants}>
          <motion.h1 variants={itemVariants}>Empower Inclusive Education</motion.h1>
          <motion.p variants={itemVariants}>
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
          whileHover="hover"
          // Subtle drag for playful interaction
          drag
          dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
          dragElastic={0.1}
        >
          <img src={heroImage} alt="Inclusive education illustration" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;