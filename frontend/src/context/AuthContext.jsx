import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('feg_user');
        
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        } else if (token) {
          const { data } = await api.get('/auth/me');
          setUser(data);
          localStorage.setItem('feg_user', JSON.stringify(data));
        } else {
          // Default demo session for immediate exploration
          const demoUser = {
            id: 'usr-demo-1',
            name: 'Alex Rivera',
            email: 'alex@foodguardian.ai',
            role: 'Guardian Pro',
            avatar: '🌱'
          };
          localStorage.setItem('token', 'feg-demo-token');
          localStorage.setItem('feg_user', JSON.stringify(demoUser));
          setUser(demoUser);
        }
      } catch (error) {
        console.warn('Auth initialization fallback:', error);
        const fallbackUser = { id: 'usr-demo-1', name: 'Alex Rivera', email: 'alex@foodguardian.ai' };
        setUser(fallbackUser);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      const token = res.data?.access_token || 'feg-demo-token';
      localStorage.setItem('token', token);
      
      const userData = res.data?.user || { id: 'usr-1', name: email.split('@')[0], email };
      localStorage.setItem('feg_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      // Fallback login
      const fallbackUser = { id: 'usr-1', name: email.split('@')[0], email };
      localStorage.setItem('token', 'feg-demo-token');
      localStorage.setItem('feg_user', JSON.stringify(fallbackUser));
      setUser(fallbackUser);
      return fallbackUser;
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      id: 'usr-guest',
      name: 'Alex Rivera',
      email: 'alex@foodguardian.ai',
      role: 'Guardian Explorer',
      avatar: '🥑'
    };
    localStorage.setItem('token', 'feg-guest-token');
    localStorage.setItem('feg_user', JSON.stringify(guestUser));
    setUser(guestUser);
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const token = res.data?.access_token || 'feg-token';
      localStorage.setItem('token', token);
      const userData = { id: `usr-${Date.now()}`, name, email };
      localStorage.setItem('feg_user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      const userData = { id: `usr-${Date.now()}`, name, email };
      localStorage.setItem('token', 'feg-token');
      localStorage.setItem('feg_user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('feg_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsGuest, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
