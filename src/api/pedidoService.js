import api from './base/axiosConfig';

export const pedidoService = {
  getAll: () => api.get('/pedidos/'),
  getById: (id) => api.get(`/pedidos/${id}/`),
  create: (data) => api.post('/pedidos/', data),
  update: (id, data) => api.put(`/pedidos/${id}/`, data),
  delete: (id) => api.delete(`/pedidos/${id}/`),
  search: (columna, valor) => api.get(`/pedidos/${columna}/${valor}/`),
};