import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../../assets/images/logo.png';
import useDarkMode from '../../hooks/useDarkMode';
import './Navbar.css';

const API_URL = import.meta.env.MODE === "production"
  ? import.meta.env.VITE_API_PROD_BACKEND_URL
  : import.meta.env.VITE_API_DEV_BACKEND_URL;

const finalAPI_URL = API_URL || (import.meta.env.MODE === "production" ? "https://eduability.onrender.com" : "http://localhost:3000");

const Navbar = () => {
  const [isDark, setIsDark] = useDarkMode();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const mobileMenuRef = useRef(null);
  const firstFocusableRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const menuButtonRef = useRef(null);
  const navigate = useNavigate();

  const truncateName = (name) => {
    if (!name) return 'Guest';
    return name.length > 10 ? `${name.slice(0, 10)}...` : name;
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
            setUser(null);
            toast.error('Session expired. Please log in again.');
            navigate('/login');
          } else {
            setUser({
              name: tokenPayload.name || tokenPayload.email.split('@')[0],
              role: tokenPayload.role || 'user',
              avatar: tokenPayload.avatar || null,
            });
          }
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          toast.error('Invalid token. Please log in again.');
          navigate('/login');
        }
      } else {
        setUser(null);
      }
    };
    checkUserSession();
  }, [navigate]);

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar-container">
          <NavLink to="/" className="navbar-logo-link" aria-label="EduAbility home page">
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
              {user ? (
                <>
                  <NavLink
                    to={user.role === 'admin' ? '/dashboard' : '/profile'}
                    className="navbar-profile-link"
                  >
                    <img
                      src={user.avatar ? `${finalAPI_URL}${user.avatar}` : 'https://via.placeholder.com/40'}
                      alt={`${truncateName(user.name)}'s profile photo`}
                      className="navbar-profile-photo"
                      onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
                    />
                    <span className="navbar-username">{truncateName(user.name)}</span>
                  </NavLink>
                  <button onClick={handleLogout} className="navbar-logout-button">
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/register" className="navbar-signup-button">
                  Sign Up
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
        {user ? (
          <>
            <NavLink
              to={user.role === 'admin' ? '/dashboard' : '/profile'}
              onClick={handleMobileLinkClick}
              className="navbar-mobile-profile-link"
            >
              <img
                src={user.avatar ? `${finalAPI_URL}${user.avatar}` : 'https://via.placeholder.com/40'}
                alt={`${truncateName(user.name)}'s profile photo`}
                className="navbar-mobile-profile-photo"
                onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
              />
              <span className="navbar-mobile-username">{truncateName(user.name)}</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="navbar-mobile-logout-button"
              ref={lastFocusableRef}
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/register"
            onClick={handleMobileLinkClick}
            ref={lastFocusableRef}
            className="navbar-mobile-signup-button"
          >
            Sign Up
          </NavLink>
        )}
      </div>
    </>
  );
};

export default Navbar;