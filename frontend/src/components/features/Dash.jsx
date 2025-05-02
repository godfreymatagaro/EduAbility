import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const role = tokenPayload.role;

        if (role !== 'admin') {
          navigate('/login');
        } else {
          setAuthLoading(false);
        }
      } catch (err) {
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    if (authLoading) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${finalAPI_URL}/api/technologies`);
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
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
  }, [authLoading]);

  if (authLoading) return null;

  return (
    <section className="dashboard-section">
      <div className="dashboard-container">
        <h1 className="dashboard-title">DASHBOARD</h1>
        <div className="stats-wrapper">
          <Link to="/admin-dash" className="stat-card">
            <h2>Total Visitors</h2>
            <p className="stat-number">{stats.totalVisitors}</p>
          </Link>
          <Link to="/admin-dash" className="stat-card">
            <h2>Total Technologies</h2>
            <p className="stat-number">{stats.totalTechnologies}</p>
          </Link>
          <Link to="/admin-dash" className="stat-card">
            <h2>Total Reviews</h2>
            <p className="stat-number">{stats.totalReviews}</p>
          </Link>
        </div>
        {loading && <p className="loading-message">Loading...</p>}
        {error && <p className="error-message">Error: {error}</p>}
      </div>
    </section>
  );
};

export default Dash;