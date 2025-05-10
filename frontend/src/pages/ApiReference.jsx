import React from 'react';
import './Docs.css';

const ApiReference = () => {
  return (
    <div className="api-reference">
      <h1>API Reference</h1>
      <p>This section outlines the API endpoints available for integrating with Edu-Ability.</p>
      <h2>Endpoints</h2>
      <ul>
        <li><code>GET /technologies</code> - Retrieve a list of technologies.</li>
        <li><code>POST /reviews</code> - Submit a new review (requires authentication).</li>
        <li><code>GET /reviews</code> - Fetch all reviews.</li>
      </ul>
      <h2>Authentication</h2>
      <p>Use a Bearer token in the Authorization header for protected routes.</p>
    </div>
  );
};

export default ApiReference;