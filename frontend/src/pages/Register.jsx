import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import NotificationModal from './NotificationModal';
import './Auth.css';

const API_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_PROD_BACKEND_URL
  : import.meta.env.VITE_API_DEV_BACKEND_URL;

const finalAPI_URL = API_URL || (import.meta.env.MODE === "production" ? "https://eduability.onrender.com" : "http://localhost:3000");

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user', // Default role, not visible in UI
    hasDisability: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setNotification({ message: 'Please enter a valid email address', type: 'error' });
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setNotification({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }

    setLoading(true);
    console.log('[Register.jsx] Sending formData:', formData);

    try {
      const response = await fetch(`${finalAPI_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('[Register.jsx] Response:', data);

      if (!response.ok) {
        console.error('[Register.jsx] Request failed:', { status: response.status, message: data.message });
        throw new Error(data.message || `Registration failed: ${response.status}`);
      }

      setNotification({ message: 'OTP sent to your email!', type: 'success' });
      navigate(`/otp/${data.userId}`);
    } catch (err) {
      console.error('[Register.jsx] Error:', err.message);
      setNotification({ 
        message: err.message === 'User already exists' 
          ? 'Email already registered. Try logging in or use a different email.' 
          : err.message || 'An unexpected error occurred', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <section className="auth-section" aria-labelledby="register-title">
      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <div className="auth-container">
        <h1 id="register-title" className="auth-title">Sign Up</h1>
        <p className="auth-description">Create an account to get started</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              aria-required="true"
              aria-label="Email address"
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                aria-required="true"
                aria-label="Password"
                autoComplete="new-password"
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
          </div>
          <div className="form-group checkbox-group">
            <label htmlFor="hasDisability">
              <input
                type="checkbox"
                id="hasDisability"
                name="hasDisability"
                checked={formData.hasDisability}
                onChange={handleInputChange}
                aria-label="Indicate if you have a disability"
              />
              I require accessibility accommodations
            </label>
          </div>
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
            aria-label="Register"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </section>
  );
};

export default Register;