import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Mock login function
  const login = (email, password) => {
    // Simulate validation (replace with actual logic or backend later)
    if (email === 'test@example.com' && password === 'password') {
      const mockUser = { id: '1', username: 'TestUser', email };
      setUser(mockUser);
      setIsAuthenticated(true);
      navigate('/');
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  };

  // Mock register function
  const register = (username, email, password) => {
    // Simulate registration (replace with backend later)
    if (email === 'test@example.com') {
      return { success: false, message: 'Email already exists' };
    }
    const mockUser = { id: '2', username, email };
    setUser(mockUser);
    setIsAuthenticated(true);
    navigate('/');
    return { success: true };
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};