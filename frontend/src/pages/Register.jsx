// src/pages/Register.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

const Register = () => {
  const isDark = document.documentElement.classList.contains("dark");
  const location = useLocation();
  const userType = location.state?.userType || null;

  if (!userType) {
    // Redirect to SelectUser if userType is not provided
    window.location.replace("/select-user");
    return null;
  }

  return <RegisterForm isDark={isDark} userType={userType} />;
};

export default Register;