import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        // Ideally verify token with backend here, for now just decode or assume valid if persistent
        // For better security, hit an endpoint /api/auth/me
        // But we didn't create /me yet. Let's just rely on token presence for simpler start 
        // Or store user in localstorage too.
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('https://skillswap-ffy2.onrender.com/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    setUser(res.data.user);
  };

  const signup = async (username, email, password) => {
    const res = await axios.post('https://skillswap-ffy2.onrender.com/api/auth/signup', { username, email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    axios.defaults.headers.common['x-auth-token'] = res.data.token;
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
