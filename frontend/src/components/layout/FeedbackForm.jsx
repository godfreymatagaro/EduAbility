import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedbackForm.css';

// Environment-based API URL (same as SearchArea, OTP, and Reviews)
const API_URL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_PROD_BACKEND_URL
    : import.meta.env.VITE_API_DEV_BACKEND_URL;

const FeedbackForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    technologyId: '',
    rating: '',
    comment: '',
    tags: '',
  });
  const [technologies, setTechnologies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  // Fetch technologies on component mount
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const response = await fetch(`${API_URL}/api/technologies`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), // Include token if available
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch technologies: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setTechnologies(data);
      } catch (err) {
        setError('Failed to load technologies. Please try again.');
        console.error('Technologies fetch error:', err);
      }
    };
    fetchTechnologies();
  }, [token]); // Add token to dependency array if auth is required

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechnologyChange = (e) => {
    const selectedId = e.target.value;
    setFormData((prev) => ({ ...prev, technologyId: selectedId }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTechnologies = technologies.filter((tech) =>
    tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!formData.technologyId) {
      setError('Please select a technology.');
      setLoading(false);
      return;
    }
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      setError('Rating must be between 1 and 5.');
      setLoading(false);
      return;
    }
    if (!formData.comment || formData.comment.trim() === '') {
      setError('Comment is required.');
      setLoading(false);
      return;
    }

    try {
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({
          technologyId: formData.technologyId,
          rating: parseInt(formData.rating),
          comment: formData.comment,
          tags,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();

      setSuccess('Review submitted successfully!');
      setFormData({ technologyId: '', rating: '', comment: '', tags: '' });
      setTimeout(() => navigate('/technologies'), 2000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid token. Please log in again.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to submit review.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-section">
      <div className="feedback-form-container" role="form" aria-labelledby="feedback-form-title">
        <h2 id="feedback-form-title" className="feedback-form-title">Submit Your Feedback</h2>
        <form onSubmit={handleSubmit} aria-describedby="feedback-instructions">
          <p id="feedback-instructions" className="sr-only">
            Use the form below to submit a review. Select a technology, rate it from 1 to 5, add a comment, and optionally include tags.
          </p>

          <div className="rating-section" role="group" aria-label="Technology Selection">
            <label htmlFor="technology-search" className="rating-label">Select Technology:</label>
            
            <select
              id="technology-select"
              name="technologyId"
              value={formData.technologyId}
              onChange={handleTechnologyChange}
              className="feedback-textarea"
              aria-label="Select a technology"
              disabled={loading}
              required
            >
              <option value="">Select a technology</option>
              {filteredTechnologies.map((tech) => (
                <option key={tech._id} value={tech._id}>
                  {tech.name} - {tech.description.substring(0, 50)}{tech.description.length > 50 ? '...' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="rating-section" role="group" aria-label="Rating Selection">
            <label htmlFor="rating" className="rating-label">Rating (1-5):</label>
            <div className="rating-stars" role="radiogroup">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="rating-star"
                  onClick={() => handleChange({ target: { name: 'rating', value: star } })}
                  aria-label={`Rate ${star} stars`}
                  disabled={loading}
                >
                  <span
                    className={`star-icon ${parseInt(formData.rating) >= star ? 'selected' : 'unselected'}`}
                    role="img"
                    aria-hidden="true"
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="5"
              className="sr-only"
              required
              aria-required="true"
            />
          </div>

          <div className="feedback-section" role="group" aria-label="Comment Section">
            <label htmlFor="comment" className="feedback-label">Comment:</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Share your thoughts..."
              className="feedback-textarea"
              rows="5"
              required
              aria-required="true"
              disabled={loading}
            />
          </div>

          <div className="feedback-section" role="group" aria-label="Tags Section">
            <label htmlFor="tags" className="feedback-label">Tags (comma-separated, optional):</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., accessibility, screen-reader"
              className="feedback-textarea"
              disabled={loading}
              aria-describedby="tags-help"
            />
            <small id="tags-help" className="sr-only">Enter tags separated by commas, e.g., accessibility, screen-reader</small>
          </div>

          {error && <p className="error-message" role="alert">{error}</p>}
          {success && <div className="submission-message" role="alert">{success}</div>}

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
            aria-busy={loading ? 'true' : 'false'}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;