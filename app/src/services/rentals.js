import { api } from './api';

export async function listRentals(params) {
  // Si el backend no implementa GET /rental/rentals, esto fallará; lo manejamos en la UI.
  // Normalizamos la respuesta para devolver siempre un array.
  const { data } = await api.get('/rental/rentals', { params });
  const arr = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
  return arr;
}

export async function createRental(payload) {
  // payload: { car_id, user_id, start_date, completion_date, daily_rate, total, observation? }
  const { data } = await api.post('/rental/rentals', payload);
  return data;
}

export async function finishOverdue(id) {
  // Si existe endpoint de finalizar por ID, usarlo; en su defecto el cron lo hará
  const url = id ? `/rental/rentals/${id}/finish` : '/rental/rentals/:id/finish';
  const { data } = await api.post(url);
  return data;
}

// export async function updateRental(id, payload) { const { data } = await api.put(`/rental/rentals/${id}`, payload); return data; }
// export async function cancelRental(id) { const { data } = await api.delete(`/rental/rentals/${id}`); return data; }
