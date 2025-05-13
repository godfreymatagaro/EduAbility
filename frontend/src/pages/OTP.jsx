import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NotificationModal from './NotificationModal';
import './Auth.css';

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_PROD_BACKEND_URL
    : import.meta.env.VITE_API_DEV_BACKEND_URL;

const OTP = () => {
  const { userId } = useParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setNotification({ message: 'Please enter a valid 6-digit OTP', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `OTP verification failed: ${response.status}`);
      }

      localStorage.setItem('token', data.token);

      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      const { role, hasDisability, disabilityDetailsCompleted } = tokenPayload;

      setNotification({ message: 'Verification successful!', type: 'success' });

      setTimeout(() => {
        if (hasDisability && !disabilityDetailsCompleted) {
          navigate('/complete-profile');
        } else if (role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/profile');
        }
      }, 1000); // Delay to show notification
    } catch (err) {
      setNotification({ message: err.message || 'An unexpected error occurred', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <section className="auth-section" aria-labelledby="otp-title">
      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <div className="auth-container">
        <h1 id="otp-title" className="auth-title">Verify Your Identity</h1>
        <p className="auth-description">Enter the 6-digit OTP sent to your email to continue.</p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="otp">One-Time Password *</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleInputChange}
              placeholder="Enter 6-digit OTP"
              required
              aria-required="true"
              aria-label="One-time password"
              maxLength="6"
              autoComplete="one-time-code"
            />
          </div>
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
            aria-label="Verify OTP"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <p className="auth-link">
          Didn’t receive an OTP? <a href="/login">Resend OTP</a>
        </p>
      </div>
    </section>
  );
};

export default OTP;