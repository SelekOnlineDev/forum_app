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

// Klaidų apdorojimas

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Automatinis atsijungimas jei tokenas nebegalioja
      localStorage.removeItem('quantum_token');
      // Priverstinis puslapio perkrovimas, kad būtų aktyvuotas logout
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default api;
