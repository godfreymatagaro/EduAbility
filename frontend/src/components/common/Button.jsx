import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  isSelected = false,
  ariaLabel,
  type = 'button',
}) => {
  const variantClass =
    variant === 'filter' && isSelected ? 'button-filter-selected' : `button-${variant}`;

  const buttonVariants = {
    rest: { scale: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
    hover: { scale: 1.05, transition: { duration: 0.2, type: 'spring', stiffness: 300, damping: 20 } },
    disabled: { scale: 1 },
  };

  return (
    <motion.button
      className={`button button-${size} ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel || children}
      aria-disabled={disabled}
      initial="rest"
      animate={disabled ? 'disabled' : 'rest'}
      whileHover={disabled ? 'disabled' : 'hover'}
      variants={buttonVariants}
    >
      {children}
    </motion.button>
  );
};

export default Button;