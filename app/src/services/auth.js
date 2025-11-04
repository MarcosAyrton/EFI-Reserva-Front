import { api } from './api';

export async function login({ username, password }) {
  const { data } = await api.post('/auth/login', { username, password });
  return data; // expects { token, role, username, id }
}

// Helper to clean optional string fields: '' -> undefined; trim strings
function sanitize(value) {
  if (value === null || value === undefined) return undefined;
  if (typeof value === 'string') {
    const t = value.trim();
    return t === '' ? undefined : t;
  }
  return value;
}

export async function register(payload) {
  // Shape payload to backend contract and avoid transaction rollbacks due to empty strings
  const body = {
    // People
    name: sanitize(payload.name),
    age: sanitize(payload.age),
    gender: sanitize(payload.gender),
    birthday: sanitize(payload.birthday),
    dni: sanitize(payload.dni),
    phone: sanitize(payload.phone),
    mail: sanitize(payload.mail),
    // User
    username: sanitize(payload.username),
    password: payload.password, // keep as-is to preserve spaces if user intended
    confirm_password: payload.confirm_password,
    role: sanitize(payload.role) || 'customer',
  };
  // Remove undefined keys to not send empty optional fields
  Object.keys(body).forEach((k) => body[k] === undefined && delete body[k]);

  const { data } = await api.post('/auth/register', body);
  return data;
}

export async function forgotPassword(email) {
  // Backend expects { mail }
  const { data } = await api.post('/auth/forgot-password', { mail: email });
  return data;
}

export async function resetPassword({ id, token, password, confirm_password }) {
  const { data } = await api.post('/auth/reset-password', { id, token, password, confirm_password });
  return data;
}
