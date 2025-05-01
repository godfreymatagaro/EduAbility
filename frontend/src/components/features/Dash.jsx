import React, { useState, useEffect } from 'react';
import './Dash.css';

const API_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_PROD_BACKEND_URL
  : import.meta.env.VITE_API_DEV_BACKEND_URL;

const finalAPI_URL = API_URL || (import.meta.env.MODE === "production" ? "https://eduability.onrender.com" : "http://localhost:3000");

const Dash = () => {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    totalTechnologies: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Note: Since there's no specific endpoint in the curl, we'll assume these are fetched from the technologies endpoint
        const response = await fetch(`${finalAPI_URL}/api/technologies`);
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        // Mock calculation for stats (adjust based on actual API response)
        setStats({
          totalVisitors: 127, // Replace with actual data if available
          totalTechnologies: data.length,
          totalReviews: 1908, // Replace with actual data if available
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="dashboard-section">
      <div className="dashboard-container">
        <h1 className="dashboard-title">DASHBOARD</h1>
        <div className="stats-wrapper">
          <div className="stat-card">
            <h2>Total Visitors</h2>
            <p className="stat-number">{stats.totalVisitors}</p>
          </div>
          <div className="stat-card">
            <h2>Total Technologies</h2>
            <p className="stat-number">{stats.totalTechnologies}</p>
          </div>
          <div className="stat-card">
            <h2>Total Reviews</h2>
            <p className="stat-number">{stats.totalReviews}</p>
          </div>
        </div>
        {loading && <p className="loading-message">Loading...</p>}
        {error && <p className="error-message">Error: {error}</p>}
      </div>
    </section>
  );
};

export default Dash;