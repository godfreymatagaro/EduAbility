import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import './AdminDash.css';

const API_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_PROD_BACKEND_URL
  : import.meta.env.VITE_API_DEV_BACKEND_URL;

const finalAPI_URL = API_URL || (import.meta.env.MODE === "production" ? "https://eduability.onrender.com" : "http://localhost:3000");

const AdminDash = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    coreVitals: {
      customerSupport: 0,
      valueForMoney: 0,
      featuresRating: 0,
      easeOfUse: 0,
    },
    featureComparison: {
      integration: false,
      security: false,
      support: false,
      userManagement: false,
      api: false,
      webhooks: false,
      community: false,
    },
    inputs: '',
    developer: '',
    platform: '',
    version: '',
    evaluation: '',
    cost: 'free',
    price: '',
    category: '',
    systemRequirements: '',
    keyFeatures: '',
    tech_img_link: '',
  });
  const [technologies, setTechnologies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch technologies on mount
  useEffect(() => {
    const fetchTechnologies = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${finalAPI_URL}/api/technologies`);
        if (!response.ok) {
          throw new Error(`Failed to fetch technologies: ${response.status}`);
        }
        const data = await response.json();
        setTechnologies(data);
      } catch (err) {
        toast.error(`Error fetching technologies: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTechnologies();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCoreVitalsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      coreVitals: {
        ...prev.coreVitals,
        [name]: parseFloat(value) || 0,
      },
    }));
  };

  const handleFeatureComparisonChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      featureComparison: {
        ...prev.featureComparison,
        [name]: checked,
      },
    }));
  };

  const handleCategoryChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${finalAPI_URL}/api/technologies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzU1N2U4Yi0wMmYzLTQyYmQtYTkwNi1jZmU2NDk5NzdkMGYiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDU5OTcyMDIsImV4cCI6MTc0NjA4MzYwMn0.hdUehWi1Z2U2GvZ9-IMulLOdOU6OLCUeQJ64FVmY_-0',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.status}`);
      }

      const data = await response.json();
      setTechnologies((prev) => [...prev, data]);
      toast.success('Technology added successfully!');
      setFormData({
        name: '',
        description: '',
        coreVitals: {
          customerSupport: 0,
          valueForMoney: 0,
          featuresRating: 0,
          easeOfUse: 0,
        },
        featureComparison: {
          integration: false,
          security: false,
          support: false,
          userManagement: false,
          api: false,
          webhooks: false,
          community: false,
        },
        inputs: '',
        developer: '',
        platform: '',
        version: '',
        evaluation: '',
        cost: 'free',
        price: '',
        category: '',
        systemRequirements: '',
        keyFeatures: '',
        tech_img_link: '',
      });
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${finalAPI_URL}/api/technologies/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzU1N2U4Yi0wMmYzLTQyYmQtYTkwNi1jZmU2NDk5NzdkMGYiLCJlbWFpbCI6InRlc3R1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDU5OTcyMDIsImV4cCI6MTc0NjA4MzYwMn0.hdUehWi1Z2U2GvZ9-IMulLOdOU6OLCUeQJ64FVmY_-0',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.status}`);
      }

      setTechnologies((prev) => prev.filter((tech) => tech._id !== id));
      toast.success('Technology deleted successfully!');
    } catch (err) {
      toast.error(`Error deleting technology: ${err.message}`);
    }
  };

  const filteredTechnologies = technologies.filter((tech) => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? tech.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="admin-dash-section">
      <div className="admin-dash-container">
        <h1 className="admin-dash-title">Admin Dashboard</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            Add Technology
          </button>
          <button
            className={`tab ${activeTab === 'manage-tech' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage-tech')}
          >
            Manage Technologies
          </button>
          <button
            className={`tab ${activeTab === 'manage-reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage-reviews')}
          >
            Manage Reviews
          </button>
        </div>

        {/* Add Technology Tab */}
        {activeTab === 'add' && (
          <form className="admin-dash-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Add New Technology</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Technology Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Technology name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cost">Cost *</label>
                  <select
                    id="cost"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
              </div>
              {formData.cost !== 'free' && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="$100 - $200"
                      min="0"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="form-section">
              <h2>Technology Description</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="description">Detailed Technology Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detailed technology description"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="inputs">Inputs *</label>
                  <input
                    type="text"
                    id="inputs"
                    name="inputs"
                    value={formData.inputs}
                    onChange={handleInputChange}
                    placeholder="Voice, Touch, etc."
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Core Vitals</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="customerSupport">Customer Support (0-5)</label>
                  <input
                    type="number"
                    id="customerSupport"
                    name="customerSupport"
                    value={formData.coreVitals.customerSupport}
                    onChange={handleCoreVitalsChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="valueForMoney">Value for Money (0-5)</label>
                  <input
                    type="number"
                    id="valueForMoney"
                    name="valueForMoney"
                    value={formData.coreVitals.valueForMoney}
                    onChange={handleCoreVitalsChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="featuresRating">Features Rating (0-5)</label>
                  <input
                    type="number"
                    id="featuresRating"
                    name="featuresRating"
                    value={formData.coreVitals.featuresRating}
                    onChange={handleCoreVitalsChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="easeOfUse">Ease of Use (0-5)</label>
                  <input
                    type="number"
                    id="easeOfUse"
                    name="easeOfUse"
                    value={formData.coreVitals.easeOfUse}
                    onChange={handleCoreVitalsChange}
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Category *</h2>
              <div className="category-group">
                <div className="checkbox-column">
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="visual"
                      checked={formData.category === 'visual'}
                      onChange={handleCategoryChange}
                      required
                    />
                    Visual
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="auditory"
                      checked={formData.category === 'auditory'}
                      onChange={handleCategoryChange}
                    />
                    Auditory
                  </label>
                </div>
                <div className="checkbox-column">
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="physical"
                      checked={formData.category === 'physical'}
                      onChange={handleCategoryChange}
                    />
                    Physical
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="category"
                      value="cognitive"
                      checked={formData.category === 'cognitive'}
                      onChange={handleCategoryChange}
                    />
                    Cognitive
                  </label>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Feature Comparison</h2>
              <div className="feature-comparison-group">
                <div className="checkbox-column">
                  <label>
                    <input
                      type="checkbox"
                      name="integration"
                      checked={formData.featureComparison.integration}
                      onChange={handleFeatureComparisonChange}
                    />
                    Integration
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="security"
                      checked={formData.featureComparison.security}
                      onChange={handleFeatureComparisonChange}
                    />
                    Security
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="support"
                      checked={formData.featureComparison.support}
                      onChange={handleFeatureComparisonChange}
                    />
                    Support
                  </label>
                </div>
                <div className="checkbox-column">
                  <label>
                    <input
                      type="checkbox"
                      name="userManagement"
                      checked={formData.featureComparison.userManagement}
                      onChange={handleFeatureComparisonChange}
                    />
                    User Management
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="api"
                      checked={formData.featureComparison.api}
                      onChange={handleFeatureComparisonChange}
                    />
                    API
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="webhooks"
                      checked={formData.featureComparison.webhooks}
                      onChange={handleFeatureComparisonChange}
                    />
                    Webhooks
                  </label>
                </div>
                <div className="checkbox-column">
                  <label>
                    <input
                      type="checkbox"
                      name="community"
                      checked={formData.featureComparison.community}
                      onChange={handleFeatureComparisonChange}
                    />
                    Community
                  </label>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Additional Details</h2>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="developer">Developer</label>
                  <input
                    type="text"
                    id="developer"
                    name="developer"
                    value={formData.developer}
                    onChange={handleInputChange}
                    placeholder="Developer name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="platform">Platform</label>
                  <input
                    type="text"
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleInputChange}
                    placeholder="Windows, macOS, etc."
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="version">Version</label>
                  <input
                    type="text"
                    id="version"
                    name="version"
                    value={formData.version}
                    onChange={handleInputChange}
                    placeholder="15.6"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="evaluation">Evaluation</label>
                  <input
                    type="text"
                    id="evaluation"
                    name="evaluation"
                    value={formData.evaluation}
                    onChange={handleInputChange}
                    placeholder="Evaluation notes"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="systemRequirements">System Requirements</label>
                  <input
                    type="text"
                    id="systemRequirements"
                    name="systemRequirements"
                    value={formData.systemRequirements}
                    onChange={handleInputChange}
                    placeholder="Windows 10 or later"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="keyFeatures">Key Features</label>
                  <input
                    type="text"
                    id="keyFeatures"
                    name="keyFeatures"
                    value={formData.keyFeatures}
                    onChange={handleInputChange}
                    placeholder="Voice command, etc."
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="tech_img_link">Technology Image Link</label>
                  <input
                    type="url"
                    id="tech_img_link"
                    name="tech_img_link"
                    value={formData.tech_img_link}
                    onChange={handleInputChange}
                    placeholder="Paste image URL here"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-button">Add Technology</button>
          </form>
        )}

        {/* Manage Technologies Tab */}
        {activeTab === 'manage-tech' && (
          <div className="manage-tech-section">
            <h2>Technologies</h2>
            <div className="table-header">
              <div className="search-bar">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="filterCategory">Filter</label>
                <select
                  id="filterCategory"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="visual">Visual Aid</option>
                  <option value="auditory">Auditory</option>
                  <option value="physical">Physical</option>
                  <option value="cognitive">Cognitive</option>
                </select>
                <Filter className="filter-icon" />
              </div>
              <button className="add-button" onClick={() => setActiveTab('add')}>
                <Plus className="add-icon" /> Add
              </button>
            </div>
            {loading ? (
              <p className="loading-message">Loading...</p>
            ) : (
              <table className="tech-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price Range</th>
                    <th>Security</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTechnologies.map((tech) => (
                    <tr key={tech._id}>
                      <td>{tech.name}</td>
                      <td>{tech.category.charAt(0).toUpperCase() + tech.category.slice(1)}</td>
                      <td>
                        {tech.cost === 'free' ? 'Free' : `$${tech.price}`}
                      </td>
                      <td>
                        {tech.featureComparison.security ? '2FA, SSL Encryption, Audit Logs' : '-'}
                      </td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(tech._id)}
                          aria-label={`Delete ${tech.name}`}
                        >
                          <Trash2 className="delete-icon" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Manage Reviews Tab (Placeholder) */}
        {activeTab === 'manage-reviews' && (
          <div className="manage-reviews-section">
            <h2>Manage Reviews</h2>
            <p>Review management functionality coming soon...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDash;