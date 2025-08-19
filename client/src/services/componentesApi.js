// api.js
// Servicios API para el recurso Componente

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function getComponentes(token) {
  const res = await fetch(`${API_URL}/componentes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}

export async function getComponenteById(id, token) {
  const res = await fetch(`${API_URL}/componentes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}

export async function createComponente(data, token) {
  const res = await fetch(`${API_URL}/componentes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function updateComponente(id, data, token) {
  const res = await fetch(`${API_URL}/componentes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}

export async function deleteComponente(id, token) {
  const res = await fetch(`${API_URL}/componentes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
}
