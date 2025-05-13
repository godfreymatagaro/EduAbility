import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Profile.css';

const API_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_PROD_BACKEND_URL
  : import.meta.env.VITE_API_DEV_BACKEND_URL;

const finalAPI_URL = API_URL || (import.meta.env.MODE === "production" ? "https://eduability.onrender.com" : "http://localhost:3000");

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    profession: '',
    hasDisability: false,
    disabilityDetails: { type: '', accommodations: [], notes: '' },
    socialLinks: { twitter: '', linkedin: '', github: '' },
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view your profile');
        navigate('/login');
        return;
      }
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        setAuthLoading(false);
      } catch (err) {
        toast.error('Invalid token. Please log in again.');
        navigate('/login');
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (authLoading) return;
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${finalAPI_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch profile');
        }
        const data = await response.json();
        setUser(data);
        setFormData({
          email: data.email,
          role: data.role,
          profession: data.profession || '',
          hasDisability: data.hasDisability || false,
          disabilityDetails: data.disabilityDetails || { type: '', accommodations: [], notes: '' },
          socialLinks: data.socialLinks || { twitter: '', linkedin: '', github: '' },
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        toast.error(err.message);
      }
    };
    fetchUserProfile();
  }, [authLoading]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('socialLinks.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        socialLinks: { ...formData.socialLinks, [field]: value },
      });
    } else if (name.startsWith('disabilityDetails.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        disabilityDetails: { ...formData.disabilityDetails, [field]: value },
      });
    } else if (name === 'accommodations') {
      setFormData({
        ...formData,
        disabilityDetails: {
          ...formData.disabilityDetails,
          accommodations: checked
            ? [...formData.disabilityDetails.accommodations, value]
            : formData.disabilityDetails.accommodations.filter((item) => item !== value),
        },
      });
    } else if (name === 'hasDisability') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error('Please select an image');
      return;
    }
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${finalAPI_URL}/auth/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload avatar');
      }
      const data = await response.json();
      setUser({ ...user, avatar: data.avatar });
      setAvatarFile(null);
      toast.success('Avatar uploaded successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${finalAPI_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const calculateProfileCompletion = () => {
    let score = 0;
    if (user?.email) score += 20;
    if (user?.avatar) score += 20;
    if (user?.profession) score += 20;
    if (user?.socialLinks?.twitter) score += 10;
    if (user?.socialLinks?.linkedin) score += 10;
    if (user?.socialLinks?.github) score += 10;
    if (user?.disabilityDetails?.type) score += 10;
    return score;
  };

  const calculateAccountAge = () => {
    if (!user?.createdAt) return 'N/A';
    const created = new Date(user.createdAt);
    const now = new Date();
    const years = now.getFullYear() - created.getFullYear();
    const months = now.getMonth() - created.getMonth();
    return years > 0 ? `${years} year${years > 1 ? 's' : ''}` : `${months} month${months > 1 ? 's' : ''}`;
  };

  if (authLoading || loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;

  return (
    <section className="profile-section" aria-labelledby="profile-title">
      <div className="profile-container">
        <h1 id="profile-title" className="profile-title">Your Profile</h1>
        <div className="profile-completion">
          <div className="completion-bar">
            <div className="completion-progress" style={{ width: `${calculateProfileCompletion()}%` }} />
          </div>
          <span className="completion-text">Profile Completion: {calculateProfileCompletion()}%</span>
        </div>
        <div className="profile-grid">
          <div className="profile-sidebar">
            <div className="profile-avatar">
              {user.avatar ? (
                <img
                  src={`${finalAPI_URL}${user.avatar}`}
                  alt="Profile avatar"
                  className="avatar-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png';
                    toast.error('Failed to load avatar');
                  }}
                />
              ) : (
                <div className="avatar-placeholder">No Avatar</div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="avatar-input"
                id="avatar-upload"
                aria-label="Upload profile picture"
              />
              <label htmlFor="avatar-upload" className="avatar-upload-button">Choose Image</label>
              {avatarFile && (
                <button
                  onClick={handleAvatarUpload}
                  className="avatar-submit-button"
                  aria-label="Upload selected image"
                >
                  Upload Avatar
                </button>
              )}
            </div>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Account Age:</span>
                <span className="stat-value">{calculateAccountAge()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Last Login:</span>
                <span className="stat-value">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Joined:</span>
                <span className="stat-value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="profile-content">
            {editMode ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    aria-label="Email address"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    disabled
                    aria-disabled="true"
                    aria-label="User role"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="profession">Profession</label>
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    placeholder="e.g., Teacher, Engineer"
                    aria-label="Profession"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="hasDisability"
                      checked={formData.hasDisability}
                      onChange={handleInputChange}
                      aria-label="Indicate if you have a disability"
                    />
                    I have a disability
                  </label>
                </div>
                {formData.hasDisability && (
                  <>
                    <div className="form-group">
                      <label htmlFor="disabilityDetails.type">Disability Type</label>
                      <select
                        id="disabilityDetails.type"
                        name="disabilityDetails.type"
                        value={formData.disabilityDetails.type}
                        onChange={handleInputChange}
                        aria-label="Disability type"
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
                      <label>Accessibility Accommodations</label>
                      <div className="checkbox-options">
                        {['Screen reader', 'High-contrast mode', 'Voice control', 'Large text'].map((option) => (
                          <label key={option} htmlFor={`accommodation-${option}`}>
                            <input
                              type="checkbox"
                              id={`accommodation-${option}`}
                              name="accommodations"
                              value={option}
                              checked={formData.disabilityDetails.accommodations.includes(option)}
                              onChange={handleInputChange}
                              aria-label={`${option} accommodation`}
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="disabilityDetails.notes">Accessibility Notes</label>
                      <textarea
                        id="disabilityDetails.notes"
                        name="disabilityDetails.notes"
                        value={formData.disabilityDetails.notes}
                        onChange={handleInputChange}
                        placeholder="Additional accessibility needs"
                        aria-label="Accessibility notes"
                        rows="4"
                      />
                    </div>
                  </>
                )}
                <div className="form-group">
                  <label htmlFor="socialLinks.twitter">Twitter</label>
                  <input
                    type="url"
                    id="socialLinks.twitter"
                    name="socialLinks.twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/username"
                    aria-label="Twitter profile URL"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="socialLinks.linkedin">LinkedIn</label>
                  <input
                    type="url"
                    id="socialLinks.linkedin"
                    name="socialLinks.linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    aria-label="LinkedIn profile URL"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="socialLinks.github">GitHub</label>
                  <input
                    type="url"
                    id="socialLinks.github"
                    name="socialLinks.github"
                    value={formData.socialLinks.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    aria-label="GitHub profile URL"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button" aria-label="Save profile changes">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setEditMode(false)}
                    aria-label="Cancel editing"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="profile-field">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">{user.email}</span>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Role:</span>
                  <span className="profile-value">{user.role}</span>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Profession:</span>
                  <span className="profile-value">{user.profession || 'N/A'}</span>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Disability:</span>
                  <span className="profile-value">{user.hasDisability ? 'Yes' : 'No'}</span>
                </div>
                {user.hasDisability && (
                  <>
                    <div className="profile-field">
                      <span className="profile-label">Disability Type:</span>
                      <span className="profile-value">{user.disabilityDetails?.type || 'N/A'}</span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-label">Accommodations:</span>
                      <span className="profile-value">
                        {user.disabilityDetails?.accommodations?.length
                          ? user.disabilityDetails.accommodations.join(', ')
                          : 'None'}
                      </span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-label">Notes:</span>
                      <span className="profile-value">{user.disabilityDetails?.notes || 'N/A'}</span>
                    </div>
                  </>
                )}
                {user.socialLinks && (
                  <div className="profile-social">
                    <span className="profile-label">Social:</span>
                    <div className="social-links">
                      {user.socialLinks.twitter && (
                        <a
                          href={user.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          aria-label="Twitter profile"
                        >
                          Twitter
                        </a>
                      )}
                      {user.socialLinks.linkedin && (
                        <a
                          href={user.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          aria-label="LinkedIn profile"
                        >
                          LinkedIn
                        </a>
                      )}
                      {user.socialLinks.github && (
                        <a
                          href={user.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link"
                          aria-label="GitHub profile"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                )}
                <button
                  className="edit-button"
                  onClick={() => setEditMode(true)}
                  aria-label="Edit profile"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;