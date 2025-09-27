// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/auth/user/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Auth check failed', err);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/login/', { username, password });
      localStorage.setItem('accessToken', res.data.access);
      localStorage.setItem('refreshToken', res.data.refresh);
      await checkAuth();
      return true;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  };

  const register = async (data) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register/', data);
      return true;
    } catch (err) {
      console.error('Register failed', err);
      return false;
    }
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (refresh) {
      try {
        await axios.post('http://127.0.0.1:8000/api/auth/logout/', { refresh }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
      } catch (err) {
        console.error('Logout failed', err);
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/token/refresh/', {
        refresh: localStorage.getItem('refreshToken'),
      });
      localStorage.setItem('accessToken', res.data.access);
      return true;
    } catch (err) {
      console.error('Token refresh failed', err);
      logout();
      return false;
    }
  };

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401 && !error.config._retry) {
        error.config._retry = true;
        const refreshed = await refreshToken();
        if (refreshed) {
          error.config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
          return axios(error.config);
        }
      }
      return Promise.reject(error);
    }
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};
