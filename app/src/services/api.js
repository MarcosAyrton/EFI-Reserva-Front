import axios from 'axios';
import { API } from '../config/env';

// Simple in-memory subscriber for logout from outside (AuthContext will register)
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn; };

export const api = axios.create({
  baseURL: API.baseURL,
  headers: { 'Content-Type': 'application/json' },
});

function normalizeToken(t) {
  if (!t) return t;
  return t.startsWith('Bearer ') ? t.slice(7) : t;
}

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('token');
  const token = normalizeToken(raw);
  // Do not attach Authorization header for public auth endpoints
  const url = (config.url || '').toString();
  const isAuthPublic = url.startsWith('/auth/');
  if (token && !isAuthPublic) {
    // Always attach exactly one 'Bearer '
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      // clear and notify once
      try {
        onUnauthorized?.();
      } catch {}
    }
    return Promise.reject(error);
  }
);
