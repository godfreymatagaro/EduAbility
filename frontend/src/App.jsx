import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
// import TechnologiesPage from './pages/TechnologiesPage';
// import ComparePage from './pages/ComparePage';
// import FeedbackPage from './pages/FeedbackPage';
// import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* <Route path="/technologies" element={<TechnologiesPage />} />
      <Route path="/compare" element={<ComparePage />} />
      <Route path="/feedback" element={<FeedbackPage />} /> */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default App;