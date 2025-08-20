import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v2';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const machinesApi = {
  // Machines
  getAll: () => api.get('/machines'),
  getById: (id) => api.get(`/machines/${id}`),
  create: (data) => api.post('/machines', data),
  update: (id, data) => api.put(`/machines/${id}`, data),
  delete: (id) => api.delete(`/machines/${id}`),

  // Sections
  getSections: (machineId) => api.get(`/machines/${machineId}/sections`),
  createSection: (data) => api.post('/sections', data),
  updateSection: (id, data) => api.put(`/sections/${id}`, data),
  deleteSection: (id) => api.delete(`/sections/${id}`),

  // Components
  getComponents: (sectionId) => api.get(`/sections/${sectionId}/components`),
  createComponent: (data) => api.post('/components', data),
  updateComponent: (id, data) => api.put(`/components/${id}`, data),
  deleteComponent: (id) => api.delete(`/components/${id}`),

  // Machine hierarchy
  getHierarchy: (machineId) => api.get(`/machines/${machineId}/hierarchy`),
};
