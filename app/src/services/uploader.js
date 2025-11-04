import { CLOUDINARY } from '../config/env';

export async function uploadImage(file, folder = 'alquileres-pelado') {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY.cloudName}/upload`;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY.uploadPreset);
  if (folder) fd.append('folder', folder);
  // Respect preset settings (unsigned). Optional flags could be added if allowed by preset.
  const res = await fetch(url, { method: 'POST', body: fd });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return {
    public_id: data.public_id,
    url: data.secure_url || data.url,
    width: data.width,
    height: data.height,
    format: data.format,
  };
}
