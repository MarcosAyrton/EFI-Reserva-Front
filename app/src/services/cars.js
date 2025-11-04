import { api } from './api';

export async function listCars(params) {
  const { data } = await api.get('/cars', { params });
  return data;
}

export async function getCar(id) {
  const { data } = await api.get(`/cars/${id}`);
  return data;
}

export async function createCar(payload) {
  const { data } = await api.post('/cars', payload);
  return data;
}

export async function updateCar(id, payload) {
  const { data } = await api.put(`/cars/${id}`, payload);
  return data;
}

export async function deleteCar(id) {
  const { data } = await api.delete(`/cars/${id}`);
  return data;
}
