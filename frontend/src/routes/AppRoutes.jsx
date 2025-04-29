// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Technologies from '../pages/Technologies';
import Compare from '../pages/Compare';
import Feedback from '../pages/Feedback';
import Details from '../pages/Details';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/technologies" element={<Technologies />} />
      <Route path="/tech-details" element={<Details />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
  );
};

export default AppRoutes;