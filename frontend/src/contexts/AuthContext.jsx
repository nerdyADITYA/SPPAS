import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getSocket } from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('sppas_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sppas_token');
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data.data);
          localStorage.setItem('sppas_user', JSON.stringify(res.data.data));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Socket.IO Session Termination Listener
  useEffect(() => {
    if (!user?.empNo) return;

    const socket = getSocket();
    socket.connect();

    const eventName = `SessionTerminated_${user.empNo}`;
    const handleSessionTerminated = (data) => {
      alert(data.message || 'Your session was terminated because a login occurred on another device.');
      logout();
    };

    socket.on(eventName, handleSessionTerminated);

    return () => {
      socket.off(eventName, handleSessionTerminated);
    };
  }, [user?.empNo]);

  const login = async (empNo, password) => {
    const response = await api.post('/auth/login', { empNo, password });
    if (response.data?.code === 'CONCURRENT_LOGIN_DETECTED' || response.data?.data?.isConcurrent) {
      return { isConcurrent: true, concurrentData: response.data.data };
    }
    const { token, user: userData } = response.data.data;
    localStorage.setItem('sppas_token', token);
    localStorage.setItem('sppas_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const forceLogin = async (empNo, password) => {
    const response = await api.post('/auth/force-login', { empNo, password });
    const { token, user: userData } = response.data.data;
    localStorage.setItem('sppas_token', token);
    localStorage.setItem('sppas_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    const token = localStorage.getItem('sppas_token');
    if (token) {
      api.post('/auth/logout').catch(() => {});
    }
    localStorage.removeItem('sppas_token');
    localStorage.removeItem('sppas_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, forceLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
