import { api } from './api';

// People endpoints
export async function listPeople(params) {
  const { data } = await api.get('/people', { params });
  return data;
}

export async function getPersonById(id) {
  const { data } = await api.get(`/people/${id}`);
  return data;
}

export async function searchPeopleByName(name) {
  const { data } = await api.get(`/people/name/${encodeURIComponent(name)}`);
  return data;
}

// Users endpoints (client-related)
export async function getUserProfile(id) {
  const { data } = await api.get(`/user/profile/${id}`);
  return data;
}

export async function updateUser(id, payload) {
  const { data } = await api.put(`/user/update/${id}`, payload);
  return data;
}

export async function deactivateUser(id) {
  const { data } = await api.patch(`/user/${id}/status`);
  return data;
}

// Create client via auth/register (creates user + person)
export async function createClient(payload) {
  const { data } = await api.post('/auth/register', { ...payload, role: 'customer' });
  return data;
}

// Person data by user id (backend route: GET /user/:id/person)
// Backend responde con wrapper { status, data: { ...person } }.
// Normalizamos para devolver el objeto plano de Persona.
export async function getPersonByUserId(userId) {
  const res = await api.get(`/user/${userId}/person`);
  const d = res?.data;
  // Soportar ambas variantes: con wrapper o plana
  if (d && typeof d === 'object' && 'data' in d && d.data) return d.data;
  return d;
}
