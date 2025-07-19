// src/context/AuthContext.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
//import { logout as logoutAction } from '../features/auth/authSlice';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const login = (token, user, userType) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userType', userType);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    dispatch(logoutAction());
    navigate('/login');
  };

  const value = {
    authToken: authState.token,
    user: authState.user,
    userType: authState.userType,
    isAuthenticated: !!authState.token,
    isOwner: authState.userType === 'owner',
    isTenant: authState.userType === 'tenant',
    login,
    logout
  };

  if (!isInitialized) {
    return null; // Or loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthContext