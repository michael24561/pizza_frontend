import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Servicios para cada modelo
export const clienteService = {
  getAll: () => api.get('/clientes/'),
  getById: (id) => api.get(`/clientes/${id}/`),
  create: (data) => api.post('/clientes/', data),
  update: (id, data) => api.put(`/clientes/${id}/`, data),
  delete: (id) => api.delete(`/clientes/${id}/`),
};

export const repertorioService = {
  getAll: () => api.get('/repertorios/'),
  getById: (id) => api.get(`/repertorios/${id}/`),
  create: (data) => api.post('/repertorios/', data),
  update: (id, data) => api.put(`/repertorios/${id}/`, data),
  delete: (id) => api.delete(`/repertorios/${id}/`),
  getDisponibles: () => api.get('/repertorios/disponibles/'),
};

export const pedidoService = {
  getAll: () => api.get('/pedidos/'),
  getById: (id) => api.get(`/pedidos/${id}/`),
  create: (data) => api.post('/pedidos/', data),
  update: (id, data) => api.put(`/pedidos/${id}/`, data),
  delete: (id) => api.delete(`/pedidos/${id}/`),
  getByCliente: (clienteId) => api.get(`/pedidos/?cliente=${clienteId}`),
};

export const productoVentaService = {
  getAll: () => api.get('/productos-venta/'),
  getById: (id) => api.get(`/productos-venta/${id}/`),
  create: (data) => api.post('/productos-venta/', data),
  update: (id, data) => api.put(`/productos-venta/${id}/`, data),
  delete: (id) => api.delete(`/productos-venta/${id}/`),
};

export const carritoService = {
  getByCliente: (clienteId) => api.get(`/carritos/?cliente=${clienteId}`),
  addItem: (data) => api.post('/carritos/', data),
  removeItem: (id) => api.delete(`/carritos/${id}/`),
  updateItem: (id, data) => api.put(`/carritos/${id}/`, data),
};

export const authService = {
  login: (credentials) => api.post('/auth/login/', credentials),
  register: (data) => api.post('/auth/register/', data),
  logout: () => api.post('/auth/logout/'),
};