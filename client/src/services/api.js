import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5500/api',
});

// Automatiškai prideda tokeną prie užklausų
api.interceptors.request.use(config => {
  const token = localStorage.getItem('quantum_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
