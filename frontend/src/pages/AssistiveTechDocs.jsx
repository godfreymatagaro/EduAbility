import React from 'react';
import './Docs.css';

const AssistiveTechDocs = () => {
  return (
    <div className="assistive-tech-docs">
      <h1>Assistive Technology Documentation</h1>
      <p>This documentation provides detailed guidance on using assistive technologies with Edu-Ability, ensuring users can maximize accessibility and usability on the platform.</p>

      <h2>1. Screen Readers</h2>
      <p>Screen readers are essential tools for users with visual impairments. Edu-Ability is optimized for compatibility with the following screen readers:</p>
      <h3>1.1 NVDA (NonVisual Desktop Access)</h3>
      <ul>
        <li><strong>Overview:</strong> NVDA is a free, open-source screen reader for Windows, offering robust support for web applications.</li>
        <li><strong>Download:</strong> <a href="https://www.nvaccess.org/download/" target="_blank" rel="noopener noreferrer">NVDA Official Download</a></li>
        <li><strong>Setup:</strong>
          <ol>
            <li>Download and install NVDA from the official website.</li>
            <li>Launch NVDA. It will start automatically on boot unless disabled in settings.</li>
            <li>Configure speech settings (voice, speed, etc.) via the NVDA menu (Insert + N).</li>
            <li>Navigate to Edu-Ability and use NVDA commands (e.g., H for headings, T for tables) to interact with the site.</li>
          </ol>
        </li>
        <li><strong>Usage with Edu-Ability:</strong> All forms, buttons, and tables on Edu-Ability are labeled with ARIA attributes for NVDA compatibility. For example, the feedback form includes labels like "Select a technology" and "Rate 3 stars."</li>
      </ul>

      <h3>1.2 VoiceOver (macOS/iOS)</h3>
      <ul>
        <li><strong>Overview:</strong> VoiceOver is Apple’s built-in screen reader, available on macOS and iOS devices.</li>
        <li><strong>Documentation:</strong> <a href="https://support.apple.com/guide/voiceover/welcome/mac" target="_blank" rel="noopener noreferrer">Official VoiceOver Guide</a></li>
        <li><strong>Setup:</strong>
          <ol>
            <li>Enable VoiceOver on macOS: System Preferences > Accessibility > VoiceOver > Enable VoiceOver.</li>
            <li>Enable VoiceOver on iOS: Settings > Accessibility > VoiceOver > Toggle On.</li>
            <li>Adjust settings like speech rate and rotor options for navigation.</li>
            <li>Access Edu-Ability via Safari or another browser. Use VoiceOver commands (e.g., VO + Right Arrow to navigate) to explore the site.</li>
          </ol>
        </li>
        <li><strong>Usage with Edu-Ability:</strong> VoiceOver users can navigate the navbar using VO + Right Arrow, and forms are fully accessible with labeled inputs and buttons.</li>
      </ul>

      <h3>1.3 Windows Narrator</h3>
      <ul>
        <li><strong>Overview:</strong> Narrator is Microsoft’s built-in screen reader for Windows, providing basic accessibility features.</li>
        <li><strong>Documentation:</strong> <a href="https://www.microsoft.com/en-us/accessibility/windows/vision" target="_blank" rel="noopener noreferrer">Windows Narrator Guide</a></li>
        <li><strong>Setup:</strong>
          <ol>
            <li>Enable Narrator: Settings > Ease of Access > Narrator > Toggle On.</li>
            <li>Customize voice settings and verbosity levels in Narrator settings.</li>
            <li>Open Edu-Ability in Microsoft Edge or another browser. Use Narrator commands (e.g., Caps Lock + Right Arrow) to navigate.</li>
          </ol>
        </li>
        <li><strong>Usage with Edu-Ability:</strong> Narrator supports Edu-Ability’s ARIA-labeled elements, such as the search bar and technology comparison tables.</li>
      </ul>

      <h2>2. Voice Control</h2>
      <p>Voice control allows users to interact with Edu-Ability using voice commands, ideal for those with physical disabilities.</p>
      <h3>2.1 Setup on Windows</h3>
      <ul>
        <li><strong>Enable Voice Recognition:</strong> Go to Control Panel > Ease of Access > Speech Recognition > Set up microphone.</li>
        <li><strong>Train Your Voice:</strong> Follow the prompts to train Windows to recognize your voice for better accuracy.</li>
        <li><strong>Commands:</strong> Use commands like "Open browser," "Click search," or "Type NVDA" to interact with Edu-Ability.</li>
      </ul>
      <h3>2.2 Setup on macOS</h3>
      <ul>
        <li><strong>Enable Voice Control:</strong> System Preferences > Accessibility > Voice Control > Enable Voice Control.</li>
        <li><strong>Commands:</strong> Use commands like "Click Feedback" or "Scroll down" to navigate Edu-Ability.</li>
        <li><strong>Best Practices:</strong> <a href="https://www.webaim.org/articles/voice/" target="_blank" rel="noopener noreferrer">WebAIM Voice Control Guide</a></li>
      </ul>
      <h3>2.3 Usage with Edu-Ability</h3>
      <p>Edu-Ability’s buttons and links are labeled for voice control compatibility. For example, say "Click Submit Review" to submit a feedback form.</p>

      <h2>3. Keyboard Shortcuts Guide</h2>
      <p>Keyboard shortcuts enhance navigation for users who rely on keyboards, including those using assistive technologies. Edu-Ability supports both platform-specific and custom shortcuts.</p>
      <h3>3.1 General Keyboard Navigation</h3>
      <ul>
        <li><strong>Tab:</strong> Move focus to the next interactive element (e.g., links, buttons, form fields).</li>
        <li><strong>Shift + Tab:</strong> Move focus to the previous interactive element.</li>
        <li><strong>Enter:</strong> Activate a focused button or link (e.g., submit a form, follow a link).</li>
        <li><strong>Escape:</strong> Close modals or cancel actions (e.g., close the technology comparison modal).</li>
        <li><strong>Space:</strong> Toggle checkboxes or select options in dropdowns.</li>
      </ul>
      <h3>3.2 Edu-Ability Custom Shortcuts</h3>
      <p>These shortcuts are specific to Edu-Ability and designed to improve accessibility:</p>
      <ul>
        <li><strong>Alt + D:</strong> Jump to the dashboard from any page.</li>
        <li><strong>Alt + S:</strong> Focus on the search bar in the "Technologies" section.</li>
        <li><strong>Alt + F:</strong> Navigate to the feedback form.</li>
        <li><strong>Alt + R:</strong> Navigate to the resources page.</li>
        <li><strong>Alt + T:</strong> Navigate to the technology comparison page.</li>
        <li><strong>Ctrl + Shift + H:</strong> Toggle high contrast (dark mode) on or off.</li>
      </ul>
      <h3>3.3 Screen Reader-Specific Shortcuts</h3>
      <p>Combine these with Edu-Ability’s navigation for an enhanced experience:</p>
      <ul>
        <li><strong>NVDA:</strong>
          <ul>
            <li>Insert + T: Read the page title.</li>
            <li>H: Jump to the next heading.</li>
            <li>Tab: Navigate through interactive elements.</li>
          </ul>
        </li>
        <li><strong>VoiceOver:</strong>
          <ul>
            <li>VO + A: Read all content on the page.</li>
            <li>VO + Right Arrow: Move to the next element.</li>
            <li>VO + Command + H: Jump to the next heading.</li>
          </ul>
        </li>
        <li><strong>Narrator:</strong>
          <ul>
            <li>Caps Lock + R: Read the current page.</li>
            <li>Caps Lock + H: Jump to the next heading.</li>
            <li>Tab: Navigate through interactive elements.</li>
          </ul>
        </li>
      </ul>
      <h3>3.4 Configuring Custom Shortcuts</h3>
      <p>Users can configure custom shortcuts in their profile settings under "Accessibility Preferences." For example, reassign "Alt + S" to another key combination if needed.</p>

      <h2>4. Troubleshooting Assistive Tech Issues</h2>
      <ul>
        <li><strong>Screen Reader Not Reading Content:</strong> Ensure the page is fully loaded. Refresh the page or restart your screen reader.</li>
        <li><strong>Voice Control Misinterpreting Commands:</strong> Retrain your voice profile and speak clearly. Use shorter commands like "Click Submit."</li>
        <li><strong>Keyboard Shortcuts Not Working:</strong> Check for browser or system conflicts (e.g., browser extensions). Disable conflicting shortcuts in your browser settings.</li>
      </ul>

      <h2>5. Additional Resources</h2>
      <p>Explore these resources for more information on assistive technologies:</p>
      <ul>
        <li><a href="https://www.w3.org/WAI/standards-guidelines/" target="_blank" rel="noopener noreferrer">W3C Accessibility Guidelines</a></li>
        <li><a href="https://a11yproject.com/" target="_blank" rel="noopener noreferrer">The A11Y Project</a></li>
        <li><a href="https://edu-ability.com/resources" target="_blank" rel="noopener noreferrer">Edu-Ability Resources</a></li>
      </ul>

      <h2>6. Contact Support</h2>
      <p>If you encounter issues with assistive technologies on Edu-Ability, contact us:</p>
      <ul>
        <li><strong>Email:</strong> accessibility@edu-ability.com</li>
        <li><strong>Phone:</strong> +1-800-555-1234 (9 AM - 5 PM EST, Monday to Friday)</li>
        <li><strong>Feedback Form:</strong> Submit feedback directly via the platform.</li>
      </ul>
    </div>
  );
};

export default AssistiveTechDocs;