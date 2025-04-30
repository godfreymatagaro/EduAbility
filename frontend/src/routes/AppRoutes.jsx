import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Technologies from '../pages/Technologies';
import Compare from '../pages/Compare';
import Feedback from '../pages/Feedback';
import Details from '../pages/Details'; // Import TechDetails instead of Details
import Admin from '../pages/Admin';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/technologies" element={<Technologies />} />
      <Route path="/tech-details/:id" element={<Details />} /> {/* Add :id parameter */}
      <Route path="/compare" element={<Compare />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/admin-dash" element={<Admin />} />
    </Routes>
  );
};

export default AppRoutes;