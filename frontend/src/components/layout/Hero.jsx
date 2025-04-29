import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button  from '../common/Button';
import heroImage from '../../assets/images/hero-image.png';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <motion.section
      className="hero"
      initial="hidden"
      animate="visible"
      variants={heroVariants}
    >
      <div className="hero-container">
        <div className="hero-text">
          <h1>Empower Inclusive Education</h1>
          <p>
            Accessible tool for evaluating educational assistive technology.
            Helping educators make informed decisions for inclusive learning
            environments.
          </p>
          <Button
            variant="compare"
            size="md"
            onClick={() => navigate('/technologies')}
            ariaLabel="Explore Technologies"
          >
            Explore Technologies
          </Button>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Inclusive education illustration" />
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;