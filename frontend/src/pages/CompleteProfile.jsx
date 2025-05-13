import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationModal from './NotificationModal';
import './Auth.css';

const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_PROD_BACKEND_URL
    : import.meta.env.VITE_API_DEV_BACKEND_URL;

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    disabilityType: '',
    accommodations: [],
    accessibilityNotes: '',
    profession: '',
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        accommodations: checked
          ? [...prev.accommodations, value]
          : prev.accommodations.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.disabilityType) {
      setNotification({ message: 'Please select a disability type', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/auth/complete-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          disabilityType: formData.disabilityType,
          accommodations: formData.accommodations,
          accessibilityNotes: formData.accessibilityNotes,
          profession: formData.profession,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Profile completion failed: ${response.status}`);
      }

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const { role } = tokenPayload;

      setNotification({ message: 'Profile completed successfully!', type: 'success' });

      setTimeout(() => {
        navigate(role === 'admin' ? '/dashboard' : '/profile');
      }, 1000);
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
    <section className="auth-section" aria-labelledby="complete-profile-title">
      {notification && (
        <NotificationModal
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <div className="auth-container">
        <h1 id="complete-profile-title" className="auth-title">Complete Your Profile</h1>
        <p className="auth-description">
          Please provide details about your accessibility needs and profession to help us tailor your experience.
        </p>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="disabilityType">Disability Type *</label>
            <select
              id="disabilityType"
              name="disabilityType"
              value={formData.disabilityType}
              onChange={handleInputChange}
              required
              aria-required="true"
              aria-label="Select disability type"
            >
              <option value="">Select a type</option>
              <option value="visual">Visual</option>
              <option value="auditory">Auditory</option>
              <option value="motor">Motor</option>
              <option value="cognitive">Cognitive</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group checkbox-group">
            <label>Accessibility Accommodations (select all that apply)</label>
            <div className="checkbox-options">
              <label htmlFor="screen-reader">
                <input
                  type="checkbox"
                  id="screen-reader"
                  name="accommodations"
                  value="Screen reader"
                  checked={formData.accommodations.includes('Screen reader')}
                  onChange={handleInputChange}
                  aria-label="Screen reader accommodation"
                />
                Screen reader
              </label>
              <label htmlFor="high-contrast">
                <input
                  type="checkbox"
                  id="high-contrast"
                  name="accommodations"
                  value="High-contrast mode"
                  checked={formData.accommodations.includes('High-contrast mode')}
                  onChange={handleInputChange}
                  aria-label="High-contrast mode accommodation"
                />
                High-contrast mode
              </label>
              <label htmlFor="voice-control">
                <input
                  type="checkbox"
                  id="voice-control"
                  name="accommodations"
                  value="Voice control"
                  checked={formData.accommodations.includes('Voice control')}
                  onChange={handleInputChange}
                  aria-label="Voice control accommodation"
                />
                Voice control
              </label>
              <label htmlFor="large-text">
                <input
                  type="checkbox"
                  id="large-text"
                  name="accommodations"
                  value="Large text"
                  checked={formData.accommodations.includes('Large text')}
                  onChange={handleInputChange}
                  aria-label="Large text accommodation"
                />
                Large text
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="accessibilityNotes">Additional Accessibility Needs</label>
            <textarea
              id="accessibilityNotes"
              name="accessibilityNotes"
              value={formData.accessibilityNotes}
              onChange={handleInputChange}
              placeholder="Describe any specific accessibility requirements"
              aria-label="Additional accessibility needs"
              rows="4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="profession">Profession</label>
            <input
              type="text"
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              placeholder="e.g., Teacher, Engineer, Student"
              aria-label="Profession"
              autoComplete="organization-title"
            />
          </div>
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
            aria-label="Complete Profile"
          >
            {loading ? 'Saving...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CompleteProfile;