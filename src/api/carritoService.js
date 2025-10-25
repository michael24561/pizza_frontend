import api from './base/axiosConfig';

export const carritoService = {
  getAll: () => api.get('/carritos/'),
  getById: (id) => api.get(`/carritos/${id}/`),
  create: (data) => api.post('/carritos/', data),
  update: (id, data) => api.put(`/carritos/${id}/`, data),
  delete: (id) => api.delete(`/carritos/${id}/`),
  search: (columna, valor) => api.get(`/carritos/${columna}/${valor}/`),
};