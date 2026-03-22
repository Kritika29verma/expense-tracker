import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),
};

export const categoryAPI = {
  getAll: () => axios.get(`${API_BASE}/categories`),
  create: (data) => axios.post(`${API_BASE}/categories`, data),
};

export const transactionAPI = {
  add: (data) => axios.post(`${API_BASE}/transactions`, data),
  getAll: (page = 0, size = 10) =>
    axios.get(`${API_BASE}/transactions`, { params: { page, size } }),
  edit: (id, data) => axios.put(`${API_BASE}/transactions/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/transactions/${id}`),
};

export const analyticsAPI = {
  getSummary: (month, year) =>
    axios.get(`${API_BASE}/analytics/summary`, { params: { month, year } }),
  getCategoryBreakdown: (month, year) =>
    axios.get(`${API_BASE}/analytics/categories`, { params: { month, year } }),
};

export const budgetAPI = {
  getAll: (month, year) =>
    axios.get(`${API_BASE}/budgets`, { params: { month, year } }),
  set: (data) => axios.post(`${API_BASE}/budgets`, data),
  delete: (id) => axios.delete(`${API_BASE}/budgets/${id}`),
};

export const exportAPI = {
  downloadCsv: (month, year) =>
    axios.get(`${API_BASE}/export/csv`, {
      params: { month, year },
      responseType: 'blob',
    }),
};
