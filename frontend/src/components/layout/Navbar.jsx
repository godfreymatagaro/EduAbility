import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import useDarkMode from '../../hooks/useDarkMode';
import './Navbar.css';

const Navbar = () => {
  const [isDark, setIsDark] = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Debug: Log dark mode state and HTML class
  useEffect(() => {
    console.log('Navbar: isDark=', isDark, 'HTML class=', document.documentElement.className);
  }, [isDark]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <div className="navbar-links">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Home
            </NavLink>
            <NavLink
              to="/technologies"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Technologies
            </NavLink>
            <NavLink
              to="/compare"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Compare
            </NavLink>
            <NavLink
              to="/feedback"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Feedback
            </NavLink>
          </div>
          <button
            className="navbar-theme-toggle"
            onClick={() => setIsDark(!isDark)}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            <Sun className="sun" />
            <Moon className="moon" />
          </button>
          <button
            className="navbar-menu-button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu />
          </button>
        </div>
      </nav>
      <div className={`navbar-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <button
          className="navbar-mobile-menu-close"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close mobile menu"
        >
          <X />
        </button>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={handleMobileLinkClick}
        >
          Home
        </NavLink>
        <NavLink
          to="/technologies"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={handleMobileLinkClick}
        >
          Technologies
        </NavLink>
        <NavLink
          to="/compare"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={handleMobileLinkClick}
        >
          Compare
        </NavLink>
        <NavLink
          to="/feedback"
          className={({ isActive }) => (isActive ? 'active' : '')}
          onClick={handleMobileLinkClick}
        >
          Feedback
        </NavLink>
      </div>
    </>
  );
};

export default Navbar;