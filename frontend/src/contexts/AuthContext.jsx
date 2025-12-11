import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, getToken, logout as authLogout } from '../services/auth.js';
import { connectSocket, disconnectSocket } from '../services/websocket.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUser = getCurrentUser();
      const token = getToken();
      
      if (storedUser && token) {
        setUser(storedUser);
        connectSocket();
      } else {
        setUser(null);
        disconnectSocket();
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    connectSocket();
  };

  const logout = () => {
    authLogout();
    setUser(null);
    disconnectSocket();
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isWorker: user?.role === 'worker',
    isUser: user?.role === 'user',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};




