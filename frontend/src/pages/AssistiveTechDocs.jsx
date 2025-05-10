import React from 'react';
import './Docs.css';

const AssistiveTechDocs = () => {
  return (
    <div className="assistive-tech-docs">
      <h1>Assistive Technology Documentation</h1>
      <p>Learn how to use assistive technologies with Edu-Ability.</p>
      <h2>Screen Readers</h2>
      <ul>
        <li><a href="https://www.nvaccess.org/download/">NVDA</a> - Free screen reader for Windows.</li>
        <li><a href="https://support.apple.com/guide/voiceover/welcome/mac">VoiceOver</a> - Apple’s built-in solution.</li>
      </ul>
      <h2>Voice Control</h2>
      <p>Configure voice commands using your device’s built-in voice control features.</p>
    </div>
  );
};

export default AssistiveTechDocs;