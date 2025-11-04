import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler } from '../services/api';
import * as authService from '../services/auth';

const AuthContext = createContext(null);

function stripBearer(t) {
  if (!t) return t;
  return t.startsWith('Bearer ') ? t.slice(7) : t;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('token');
    return stripBearer(stored);
  });
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const role = user?.role || null;

  const persist = (nextToken, nextUser) => {
    const normalized = stripBearer(nextToken);
    if (normalized) localStorage.setItem('token', normalized); else localStorage.removeItem('token');
    if (nextUser) localStorage.setItem('user', JSON.stringify(nextUser)); else localStorage.removeItem('user');
  };

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ username, password });
      // Expect token, role, username, id
      const nextUser = { id: data.id, username: data.username, role: data.role };
      const normalizedToken = stripBearer(data.token);
      setToken(normalizedToken);
      setUser(nextUser);
      persist(normalizedToken, nextUser);
      return nextUser;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      return await authService.register(payload);
    } finally { setLoading(false); }
  }, []);

  const forgotPassword = useCallback(async (email) => authService.forgotPassword(email), []);
  const resetPassword = useCallback(async (payload) => authService.resetPassword(payload), []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    persist(null, null);
  }, []);

  // Global 401/403 handler
  useEffect(() => {
    setUnauthorizedHandler(() => () => logout());
  }, [logout]);

  const value = useMemo(() => ({ token, user, role, loading, login, logout, register, forgotPassword, resetPassword }), [token, user, role, loading, login, logout, register, forgotPassword, resetPassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
