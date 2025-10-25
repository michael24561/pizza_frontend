import api from '.,/base/axiosConfig';

export const clienteService = {
  getAll: () => api.get('/clientes/'),
  getById: (id) => api.get(`/clientes/${id}/`),
  create: (data) => api.post('/clientes/', data),
  update: (id, data) => api.put(`/clientes/${id}/`, data),
  delete: (id) => api.delete(`/clientes/${id}/`),
  search: (columna, valor) => api.get(`/clientes/${columna}/${valor}/`),
};