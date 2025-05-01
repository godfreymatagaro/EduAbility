import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Auth.css';

const API_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_PROD_BACKEND_URL
  : import.meta.env.VITE_API_DEV_BACKEND_URL;

const finalAPI_URL = API_URL || (import.meta.env.MODE === "production" ? "https://eduability.onrender.com" : "http://localhost:3000");

const OTP = () => {
  const { userId } = useParams(); // Get userId from URL
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${finalAPI_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`OTP verification failed: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Store token in localStorage
      toast.success('Login successful!');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <h1 className="auth-title">Verify OTP</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="otp">OTP *</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              placeholder="Enter the OTP"
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <p className="auth-link">
          Back to <a href="/login">Login</a>
        </p>
      </div>
    </section>
  );
};

export default OTP;