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
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ email: '', role: '', socialLinks: { twitter: '', linkedin: '', github: '' } });
  const [avatarFile, setAvatarFile] = useState(null);
  const [theme, setTheme] = useState('light');
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

        // Fetch technologies if admin
        if (data.role === 'admin') {
          const techResponse = await fetch(`${finalAPI_URL}/api/technologies`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!techResponse.ok) {
            throw new Error('Failed to fetch technologies');
          }
          const techData = await techResponse.json();
          setTechnologies(techData);
        }

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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
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
    <section className={`profile-section ${theme}`}>
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">User Profile</h1>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>

        <div className="profile-avatar">
          {user.avatar ? (
            <img src={`${finalAPI_URL}${user.avatar}`} alt="Profile avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">No Avatar</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="avatar-input"
            id="avatar-upload"
          />
          <label htmlFor="avatar-upload" className="avatar-upload-button">Choose Image</label>
          {avatarFile && (
            <button onClick={handleAvatarUpload} className="avatar-submit-button">
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
            <div className="profile-field">
              <span className="profile-label">Email:</span>
              <span className="profile-value">{user.email}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Role:</span>
              <span className="profile-value">{user.role}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Joined:</span>
              <span className="profile-value">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
            {user.socialLinks && (
              <div className="profile-social">
                <span className="profile-label">Social:</span>
                <div className="social-links">
                  {user.socialLinks.twitter && (
                    <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                      Twitter
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                      LinkedIn
                    </a>
                  )}
                  {user.socialLinks.github && (
                    <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}
            <button
              className="edit-button"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </div>
        )}

        {user.role === 'admin' && technologies.length > 0 && (
          <div className="profile-technologies">
            <h2 className="technologies-title">Your Technologies</h2>
            <div className="technologies-list">
              {technologies.map((tech) => (
                <div key={tech._id} className="technology-item">
                  <img
                    src={tech.image_url || '/placeholder-image.png'}
                    alt={tech.name}
                    className="technology-image"
                  />
                  <div className="technology-details">
                    <h3>{tech.name}</h3>
                    <p>{tech.description.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Profile;