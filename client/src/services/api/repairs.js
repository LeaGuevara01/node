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

export const repairsApi = {
  // Repair Orders
  getAll: () => api.get('/repairs'),
  getById: (id) => api.get(`/repairs/${id}`),
  create: (data) => api.post('/repairs', data),
  update: (id, data) => api.put(`/repairs/${id}`, data),
  updateStatus: (id, status) => api.patch(`/repairs/${id}/status`, { status }),
  delete: (id) => api.delete(`/repairs/${id}`),

  // Repair Details
  getDetails: (repairId) => api.get(`/repairs/${repairId}/details`),
  addDetail: (repairId, detail) => api.post(`/repairs/${repairId}/details`, detail),
  updateDetail: (repairId, detailId, detail) => api.put(`/repairs/${repairId}/details/${detailId}`, detail),
  deleteDetail: (repairId, detailId) => api.delete(`/repairs/${repairId}/details/${detailId}`),

  // Cost calculation
  calculateCost: (repairId) => api.get(`/repairs/${repairId}/calculate-cost`),
  updateCost: (repairId, costData) => api.put(`/repairs/${repairId}/cost`, costData),

  // Parts and supplies
  getParts: (repairId) => api.get(`/repairs/${repairId}/parts`),
  addPart: (repairId, part) => api.post(`/repairs/${repairId}/parts`, part),
  getSupplies: (repairId) => api.get(`/repairs/${repairId}/supplies`),
  addSupply: (repairId, supply) => api.post(`/repairs/${repairId}/supplies`, supply),

  // Status management
  getStatuses: () => api.get('/repairs/statuses'),
  updateRepairStatus: (id, status) => api.patch(`/repairs/${id}/status`, { status }),
};
