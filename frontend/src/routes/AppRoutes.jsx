import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Technologies from '../pages/Technologies';
import Compare from '../pages/Compare';
import Feedback from '../pages/Feedback';
import Details from '../pages/Details';
import Dashboard from '../pages/DashBoard';
import Admin from '../pages/Admin';
import Login from '../pages/Login';
import OTP from '../pages/OTP';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import About from '../pages/About';
import Resources from '../pages/Resources';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/technologies" element={<Technologies />} />
      <Route path="/tech-details/:id" element={<Details />} />
      <Route path="/compare" element={<Compare />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin-dash" element={<Admin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp/:userId" element={<OTP />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />
      <Route path="/resources" element={<Resources />} />
    </Routes>
  );
};

export default AppRoutes;