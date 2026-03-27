import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Habilitar envío de cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar Token Authentication (si se usa token manual)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== "") {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo limpiamos estado, no redirigimos a la fuerza para seguir el deseo del usuario
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;