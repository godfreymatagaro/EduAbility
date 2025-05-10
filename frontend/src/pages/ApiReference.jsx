import React from 'react';
import './Docs.css';

const ApiReference = () => {
  return (
    <div className="api-reference">
      <h1>API Reference</h1>
      <p>This API Reference provides detailed information on how to integrate with the Edu-Ability platform programmatically. Our RESTful API allows developers to access technologies, submit reviews, and manage user data securely.</p>

      <h2>1. Base URL</h2>
      <p>All API requests should be made to:</p>
      <pre><code>{`https://api.edu-ability.com`}</code></pre>
      <p>In development environments, use:</p>
      <pre><code>{`http://localhost:3000`}</code></pre>

      <h2>2. Authentication</h2>
      <h3>2.1 Overview</h3>
      <p>The Edu-Ability API uses Bearer Token authentication to secure endpoints. You must include a valid token in the `Authorization` header of your requests for protected routes.</p>

      <h3>2.2 Obtaining a Token</h3>
      <p>To authenticate and obtain a token, make a POST request to the authentication endpoint:</p>
      <pre>
        <code>
{`POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}`}
        </code>
      </pre>
      <p><strong>Response (Success):</strong></p>
      <pre>
        <code>
{`HTTP/1.1 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "12345",
    "email": "user@example.com",
    "role": "user"
  }
}`}
        </code>
      </pre>
      <p><strong>Response (Error):</strong></p>
      <pre>
        <code>
{`HTTP/1.1 401 Unauthorized
{
  "message": "Invalid credentials"
}`}
        </code>
      </pre>

      <h3>2.3 Using the Token</h3>
      <p>Include the token in the `Authorization` header of your requests:</p>
      <pre>
        <code>
{`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
        </code>
      </pre>
      <p><strong>Note:</strong> Tokens expire after 24 hours. Refresh the token by re-authenticating or using the `/api/auth/refresh` endpoint (if available).</p>

      <h3>2.4 Error Handling for Authentication</h3>
      <ul>
        <li><strong>401 Unauthorized:</strong> Invalid or missing token. Re-authenticate and retry.</li>
        <li><strong>403 Forbidden:</strong> Token is valid but lacks permission (e.g., trying to access admin routes as a user).</li>
      </ul>

      <h2>3. Endpoints</h2>
      <h3>3.1 GET /technologies</h3>
      <p>Retrieve a list of all assistive technologies available on the platform.</p>
      <p><strong>Request:</strong></p>
      <pre>
        <code>
{`GET /technologies
Accept: application/json`}
        </code>
      </pre>
      <p><strong>Response (Success):</strong></p>
      <pre>
        <code>
{`HTTP/1.1 200 OK
[
  {
    "_id": "tech123",
    "name": "NVDA",
    "category": "visual",
    "cost": "free",
    "price": 0,
    "coreVitals": {
      "easeOfUse": "4.5",
      "featuresRating": "4.8",
      "valueForMoney": "5.0",
      "customerSupport": "4.0"
    },
    "featureComparison": {
      "security": true,
      "integration": false,
      "support": true
    }
  },
  ...
]`}
        </code>
      </pre>
      <p><strong>Response (Error):</strong></p>
      <pre>
        <code>
{`HTTP/1.1 500 Internal Server Error
{
  "message": "Failed to fetch technologies"
}`}
        </code>
      </pre>

      <h3>3.2 POST /reviews</h3>
      <p>Submit a new review for a technology. Requires authentication.</p>
      <p><strong>Request:</strong></p>
      <pre>
        <code>
{`POST /reviews
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "technologyId": "tech123",
  "rating": 4,
  "comment": "Great screen reader for Windows users!",
  "tags": ["accessibility", "screen-reader"]
}`}
        </code>
      </pre>
      <p><strong>Response (Success):</strong></p>
      <pre>
        <code>
{`HTTP/1.1 201 Created
{
  "_id": "review456",
  "technologyId": "tech123",
  "userId": "user789",
  "rating": 4,
  "comment": "Great screen reader for Windows users!",
  "tags": ["accessibility", "screen-reader"],
  "createdAt": "2025-05-10T10:00:00Z"
}`}
        </code>
      </pre>
      <p><strong>Response (Error):</strong></p>
      <pre>
        <code>
{`HTTP/1.1 401 Unauthorized
{
  "message": "Authentication required"
}`}
        </code>
      </pre>

      <h3>3.3 GET /reviews</h3>
      <p>Fetch all reviews for a specific technology or all reviews if no query parameter is provided.</p>
      <p><strong>Request:</strong></p>
      <pre>
        <code>
{`GET /reviews?technologyId=tech123
Accept: application/json`}
        </code>
      </pre>
      <p><strong>Response (Success):</strong></p>
      <pre>
        <code>
{`HTTP/1.1 200 OK
[
  {
    "_id": "review456",
    "technologyId": "tech123",
    "userId": "user789",
    "rating": 4,
    "comment": "Great screen reader for Windows users!",
    "tags": ["accessibility", "screen-reader"],
    "createdAt": "2025-05-10T10:00:00Z"
  },
  ...
]`}
        </code>
      </pre>
      <p><strong>Response (Error):</strong></p>
      <pre>
        <code>
{`HTTP/1.1 400 Bad Request
{
  "message": "Invalid technology ID"
}`}
        </code>
      </pre>

      <h2>4. Rate Limits</h2>
      <p>To ensure fair usage, the API enforces the following rate limits:</p>
      <ul>
        <li><strong>Unauthenticated Requests:</strong> 100 requests per hour per IP address.</li>
        <li><strong>Authenticated Requests:</strong> 500 requests per hour per user.</li>
        <li><strong>Response on Exceeding Limit:</strong></li>
      </ul>
      <pre>
        <code>
{`HTTP/1.1 429 Too Many Requests
{
  "message": "Rate limit exceeded. Please try again later."
}`}
        </code>
      </pre>

      <h2>5. Error Codes</h2>
      <ul>
        <li><strong>400 Bad Request:</strong> Invalid request parameters or payload.</li>
        <li><strong>401 Unauthorized:</strong> Missing or invalid authentication token.</li>
        <li><strong>403 Forbidden:</strong> Insufficient permissions.</li>
        <li><strong>404 Not Found:</strong> Requested resource does not exist.</li>
        <li><strong>429 Too Many Requests:</strong> Rate limit exceeded.</li>
        <li><strong>500 Internal Server Error:</strong> Server-side issue. Contact support.</li>
      </ul>

      <h2>6. Best Practices</h2>
      <ul>
        <li><strong>Secure Tokens:</strong> Store tokens securely and never expose them in client-side code.</li>
        <li><strong>Validate Inputs:</strong> Ensure all request payloads are valid to avoid 400 errors.</li>
        <li><strong>Handle Errors:</strong> Implement proper error handling to manage 401, 429, etc.</li>
        <li><strong>Cache Responses:</strong> Cache GET responses to reduce API calls and improve performance.</li>
      </ul>

      <h2>7. Support</h2>
      <p>For API-related issues, contact our developer support team:</p>
      <ul>
        <li><strong>Email:</strong> api-support@edu-ability.com</li>
        <li><strong>Documentation Updates:</strong> Check this page regularly for updates to endpoints and features.</li>
      </ul>
    </div>
  );
};

export default ApiReference;