import api from '../base/axiosConfig';

export const empleadoService = {
  getAll: () => api.get('/empleados/'),
  getById: (id) => api.get(`/empleados/${id}/`),
  create: (data) => api.post('/empleados/', data),
  update: (id, data) => api.put(`/empleados/${id}/`, data),
  delete: (id) => api.delete(`/empleados/${id}/`),
  search: (columna, valor) => api.get(`/empleados/${columna}/${valor}/`),
};