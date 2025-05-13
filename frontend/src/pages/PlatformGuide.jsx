import React from 'react';
import './Docs.css';
import Footer from '../components/layout/Footer';

const PlatformGuide = () => {
  return (
    <div className="page-wrapper">
      <main className="platform-guide">
        <div className="content-container">
          <h1>Platform User Guide</h1>
          <p>Welcome to the Edu-Ability Platform User Guide! This comprehensive document provides detailed instructions on how to navigate and utilize our platform effectively, ensuring an accessible and seamless experience for all users.</p>

          <h2>1. Introduction to Edu-Ability</h2>
          <p>Edu-Ability is a platform designed to empower users with disabilities by providing access to assistive technologies, reviews, and community resources. Whether you're exploring technologies, submitting feedback, or engaging with our community, this guide will walk you through each step.</p>

          <h2>2. Getting Started</h2>
          <h3>2.1 Account Creation and Login</h3>
          <ul>
            <li><strong>Sign Up:</strong> Navigate to the homepage and click "Log In." </li>
            <li><strong>Login:</strong> Use your email and password to log in.</li>
            <li><strong>Accessibility Tip:</strong> The login form is fully compatible with screen readers like NVDA and VoiceOver. Use the Tab key to navigate fields and Enter to submit.</li>
          </ul>

         

          <h3>2.3 Submitting Feedback</h3>
          <ul>
            <li><strong>Access the Form:</strong> Navigate to the "Feedback" section via the navbar quick link.</li>
            <li><strong>Fill Out Details:</strong> Select a technology, provide a rating (1-5), write a comment, and add optional tags (e.g., "accessibility, screen-reader").</li>
            <li><strong>Submission:</strong> Click "Submit Review" or press Enter on the button. You'll receive a confirmation message upon successful submission.</li>
          </ul>

          <h2>3. Key Features</h2>
          <h3>3.1 Technology Search with Filters</h3>
          <p>Search for assistive technologies using the search bar on the "Technologies" page. Apply filters such as:</p>
          <ul>
            <li><strong>Category:</strong> Filter by disability type (visual, auditory, physical, cognitive).</li>
            <li><strong>Price Range:</strong> Set a budget to find free or paid options.</li>
            <li><strong>Rating:</strong> Sort by user ratings (highest to lowest).</li>
          </ul>
          <p><strong>Accessibility Note:</strong> Filters are labeled with ARIA attributes for screen reader compatibility.</p>

          <h3>3.2 Review Submission with Ratings and Tags</h3>
          <p>Share your experience with technologies by submitting reviews:</p>
          <ul>
            <li><strong>Rating:</strong> Use a star-based system (1-5) to rate the technology. The rating section includes buttons labeled for screen readers (e.g., "Rate 3 stars").</li>
            <li><strong>Comment:</strong> Provide detailed feedback in the comment box, which supports up to 500 characters.</li>
            <li><strong>Tags:</strong> Add comma-separated tags to categorize your review (e.g., "speech-to-text, user-friendly").</li>
          </ul>

          <h3>3.3 Access to Assistive Technology Resources</h3>
          <p>The "Resources" section provides links to:</p>
          <ul>
            <li>Documentation for assistive technologies like NVDA and VoiceOver.</li>
            <li>Tutorials for setting up and using assistive tools.</li>
            <li>Community forums and external accessibility resources.</li>
          </ul>

          <h2>4. Account Management</h2>
          <h3>4.1 Profile Settings</h3>
          <p>Update your profile by navigating to the "Profile" section:</p>
          <ul>
            <li><strong>Personal Information:</strong> Edit your email, name, and disability preferences.</li>
            <li><strong>Password:</strong> Change your password securely via the "Change Password" option.</li>
            <li><strong>Notifications:</strong> Opt-in to receive email updates about new technologies or community events.</li>
          </ul>

          <h3>4.2 Logout</h3>
          <p>Sign out securely by clicking "Logout" in the navbar. Your session will end, and you'll be redirected to the homepage.</p>

          <h2>5. Accessibility Features</h2>
          <p>Edu-Ability is designed with accessibility in mind:</p>
          <ul>
            <li><strong>Keyboard Navigation:</strong> Use Tab to navigate, Enter to select, and Escape to close modals.</li>
            <li><strong>Screen Reader Support:</strong> All elements are labeled with ARIA attributes for compatibility with NVDA, VoiceOver, and Narrator.</li>
            <li><strong>High Contrast Mode:</strong> Toggle dark mode in the navbar for better visibility.</li>
          </ul>

          <h2>6. Troubleshooting</h2>
          <p>Encounter an issue? Try these steps:</p>
          <ul>
            <li><strong>Login Problems:</strong> Ensure your email and password are correct. No need fo Password recovery as the Authentication process is swift throught OTP sent to your email" link if needed.</li>
            <li><strong>Page Not Loading:</strong> Refresh the page or check your internet connection. Contact support if the issue persists.</li>
            <li><strong>Accessibility Issues:</strong> Report any accessibility concerns via the feedback form or email vaishnaviratnalu@gmail.com.</li>
          </ul>

          <h2>7. Contact Support</h2>
          <p>For further assistance, reach out to our support team:</p>
          <ul>
            <li><strong>Email:</strong> vaishnaviratnalu@gmail.com</li>
            <li><strong>Phone:</strong> +44 7774 936061 (available 9 AM - 5 PM EST, Monday to Friday)</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlatformGuide;