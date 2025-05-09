import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/images/logo.png';
import useDarkMode from '../../hooks/useDarkMode';
import './Navbar.css';

const Navbar = () => {
  const [isDark, setIsDark] = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [userType, setUserType] = useState(null);
  const mobileMenuRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const menuButtonRef = useRef(null);
  const navigate = useNavigate();

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  useEffect(() => {
    const checkUserSession = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          if (tokenPayload.exp < currentTime) {
            localStorage.removeItem('token');
            setUsername(null);
            setUserType(null);
            toast.error('Session expired. Please log in again.');
          } else {
            setUsername(tokenPayload.username || 'User');
            setUserType(tokenPayload.userType || null);
          }
        } catch (err) {
          localStorage.removeItem('token');
          setUsername(null);
          setUserType(null);
          toast.error('Invalid token. Please log in again.');
        }
      }
    };

    checkUserSession();
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      firstFocusableRef.current?.focus();
      const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstFocusableRef.current) {
            e.preventDefault();
            lastFocusableRef.current?.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusableRef.current) {
            e.preventDefault();
            firstFocusableRef.current?.focus();
          }
        } else if (e.key === 'Escape') {
          setIsMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    console.log('Navbar: isDark=', isDark, 'HTML class=', document.documentElement.className);
  }, [isDark]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername(null);
    setUserType(null);
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar-container">
          <NavLink to="/" className="navbar-logo-link" aria-label="Home page">
            <img src={logo} alt="EduAbility Logo" className="navbar-logo" />
          </NavLink>
          <div className="navbar-right">
            <div className="navbar-links" role="navigation">
              <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
                Home
              </NavLink>
              <NavLink to="/technologies" className={({ isActive }) => (isActive ? 'active' : '')}>
                Technologies
              </NavLink>
              <NavLink to="/compare" className={({ isActive }) => (isActive ? 'active' : '')}>
                Compare
              </NavLink>
              <NavLink to="/feedback" className={({ isActive }) => (isActive ? 'active' : '')}>
                Feedback
              </NavLink>
              {username ? (
                <>
                  {userType === 'admin' && (
                    <NavLink to="/dashboard" className="navbar-profile-link">
                      <img
                        src="https://via.placeholder.com/40"
                        alt={`${username}'s profile photo`}
                        className="navbar-profile-photo"
                      />
                      <span className="navbar-username">{username}</span>
                    </NavLink>
                  )}
                  {userType !== 'admin' && (
                    <NavLink to="/profile" className="navbar-username-link">
                      <span className="navbar-username">{username}</span>
                    </NavLink>
                  )}
                  <button onClick={handleLogout} className="navbar-logout-button">
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className="navbar-login-button">
                  Log in
                </NavLink>
              )}
            </div>
            <div className="navbar-controls">
              <button
                className="navbar-theme-toggle"
                onClick={() => setIsDark(!isDark)}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                <Sun className="sun" aria-hidden="true" />
                <Moon className="moon" aria-hidden="true" />
              </button>
              <button
                ref={menuButtonRef}
                className="navbar-menu-button"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open mobile menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`navbar-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-labelledby="mobile-menu-title"
        aria-hidden={!isMobileMenuOpen}
      >
        <h2 id="mobile-menu-title" className="visually-hidden">
          Mobile Navigation Menu
        </h2>
        <button
          ref={firstFocusableRef}
          className="navbar-mobile-menu-close"
          onClick={() => {
            setIsMobileMenuOpen(false);
            menuButtonRef.current?.focus();
          }}
          aria-label="Close mobile menu"
        >
          <X aria-hidden="true" />
        </button>
        <NavLink to="/" onClick={handleMobileLinkClick}>
          Home
        </NavLink>
        <NavLink to="/technologies" onClick={handleMobileLinkClick}>
          Technologies
        </NavLink>
        <NavLink to="/compare" onClick={handleMobileLinkClick}>
          Compare
        </NavLink>
        <NavLink to="/feedback" onClick={handleMobileLinkClick}>
          Feedback
        </NavLink>
        {username ? (
          <>
            {userType === 'admin' && (
              <NavLink to="/dashboard" onClick={handleMobileLinkClick} className="navbar-mobile-profile-link">
                <img
                  src="https://via.placeholder.com/40"
                  alt={`${username}'s profile photo`}
                  className="navbar-mobile-profile-photo"
                />
                <span className="navbar-mobile-username">{username}</span>
              </NavLink>
            )}
            {userType !== 'admin' && (
              <NavLink to="/profile" onClick={handleMobileLinkClick} className="navbar-mobile-username-link">
                <span className="navbar-mobile-username">{username}</span>
              </NavLink>
            )}
            <button onClick={handleLogout} className="navbar-mobile-logout-button" ref={lastFocusableRef}>
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/login"
            onClick={handleMobileLinkClick}
            ref={lastFocusableRef}
            className="navbar-mobile-login-button"
          >
            Log in
          </NavLink>
        )}
      </div>
    </>
  );
};

export default Navbar;