import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckAuth = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate(isAuthenticated ? '/chat/home' : '/auth/login');
    } else if (
      isAuthenticated &&
      (location.pathname.includes('register') || location.pathname.includes('login'))
    ) {
      navigate('/chat/home');
    } else if (
      !isAuthenticated &&
      (location.pathname.includes('setpassword') || location.pathname.includes('/chat/home'))
    ) {
      navigate('/auth/login');
    }
  }, [location.pathname, isAuthenticated, navigate]);

  return null; 
};

export default CheckAuth;
