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
  const [formData, setFormData] = useState({ email: '', role: '', socialLinks: { twitter: '', linkedin: '', github: '' } });
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
        const response = await fetch(`${finalAPI_URL}/api/auth/profile`, {
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
          socialLinks: data.socialLinks || { twitter: '', linkedin: '', github: '' }
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
    const { name, value } = e.target;
    if (name.startsWith('socialLinks.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        socialLinks: { ...formData.socialLinks, [field]: value }
      });
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
      const response = await fetch(`${finalAPI_URL}/api/auth/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload avatar');
      }

      const data = await response.json();
      setUser({ ...user, avatar: data.avatar });
      toast.success('Avatar uploaded successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${finalAPI_URL}/api/auth/profile`, {
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
    if (user?.email) score += 40;
    if (user?.avatar) score += 30;
    if (user?.socialLinks?.twitter) score += 10;
    if (user?.socialLinks?.linkedin) score += 10;
    if (user?.socialLinks?.github) score += 10;
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
    <section className="profile-section dark">
      <div className="profile-container">
        <h1 className="profile-title">Profile</h1>
        
        <div className="profile-completion">
          <div className="completion-bar">
            <div className="completion-progress" style={{ width: `${calculateProfileCompletion()}%` }}></div>
          </div>
          <span className="completion-text">Profile Completion: {calculateProfileCompletion()}%</span>
        </div>

        <div className="profile-card">
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
            <div className="stat-item" style={{ animationDelay: '0.1s' }}>
              <span className="stat-label">Account Age:</span>
              <span className="stat-value">{calculateAccountAge()}</span>
            </div>
            <div className="stat-item" style={{ animationDelay: '0.2s' }}>
              <span className="stat-label">Last Login:</span>
              <span className="stat-value">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>

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
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="socialLinks.twitter">Twitter</label>
                <input
                  type="url"
                  id="socialLinks.twitter"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleInputChange}
                  placeholder="https://twitter.com/username"
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
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">Save Changes</button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="profile-field" style={{ animationDelay: '0.3s' }}>
                <span className="profile-label">Email:</span>
                <span className="profile-value">{user.email}</span>
              </div>
              <div className="profile-field" style={{ animationDelay: '0.4s' }}>
                <span className="profile-label">Role:</span>
                <span className="profile-value">{user.role}</span>
              </div>
              <div className="profile-field" style={{ animationDelay: '0.5s' }}>
                <span className="profile-label">Joined:</span>
                <span className="profile-value">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              {user.socialLinks && (
                <div className="profile-social" style={{ animationDelay: '0.6s' }}>
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
    </section>
  );
};

export default Profile;