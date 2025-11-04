// Environment and app constants
export const APP = {
  name: 'ALQUILERES PELADO',
  locale: 'es-AR',
  currency: 'ARS',
  dateFormat: 'dd/MM/yyyy',
};

export const API = {
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000',
};

export const CLOUDINARY = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dgbmfsgg1',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'productos_preset',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '455481518926355',
};
