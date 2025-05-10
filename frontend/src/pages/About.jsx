import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import Button from '../components/Button';
import './About.css';

const About = () => {
  const [isDarkMode] = useDarkMode();

  return (
    <div className={`about-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`} role="main" aria-label="About EduAbility Page">
      <section className="about-mission" aria-labelledby="mission-heading">
        <h1 id="mission-heading">Our Mission</h1>
        <p>
          EduAbility is dedicated to empowering educators and administrators with accessible tools to evaluate assistive technologies, fostering inclusive learning environments for all students, including those with disabilities.
        </p>
        <Button onClick={() => alert('Learn more about our mission!')} label="Learn More" />
      </section>

      <section className="about-team" aria-labelledby="team-heading">
        <h2 id="team-heading">Our Team</h2>
        <ul>
          <li>Jane Doe - Lead Developer</li>
          <li>John Smith - Accessibility Specialist</li>
          <li>Emily Brown - UX Designer</li>
        </ul>
      </section>

      <section className="about-contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Contact Us</h2>
        <p>Email: support@edu-ability.com</p>
        <p>Phone: +1-800-555-1234</p>
        <Button onClick={() => window.location.href = 'mailto:support@edu-ability.com'} label="Send Email" />
      </section>
    </div>
  );
};

export default About;