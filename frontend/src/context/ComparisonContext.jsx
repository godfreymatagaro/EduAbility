import React, { createContext, useState } from 'react';

export const ComparisonContext = createContext();

export const ComparisonProvider = ({ children }) => {
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);

  // Add a technology to comparison (max 3)
  const addToComparison = (technology) => {
    if (selectedTechnologies.length >= 3) {
      return { success: false, message: 'Maximum of 3 technologies can be compared.' };
    }
    if (selectedTechnologies.some((tech) => tech._id === technology._id)) {
      return { success: false, message: 'Technology already added to comparison.' };
    }
    setSelectedTechnologies([...selectedTechnologies, technology]);
    return { success: true };
  };

  // Remove a technology from comparison
  const removeFromComparison = (technologyId) => {
    setSelectedTechnologies(selectedTechnologies.filter((tech) => tech._id !== technologyId));
  };

  // Clear all selected technologies
  const clearComparison = () => {
    setSelectedTechnologies([]);
  };

  const value = {
    selectedTechnologies,
    addToComparison,
    removeFromComparison,
    clearComparison,
  };

  return <ComparisonContext.Provider value={value}>{children}</ComparisonContext.Provider>;
};