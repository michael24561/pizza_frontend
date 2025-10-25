import api from './base/axiosConfig';

export const repertorioService = {
  getAll: () => api.get('/repertorios/'),
  getById: (id) => api.get(`/repertorios/${id}/`),
  create: (data) => api.post('/repertorios/', data),
  update: (id, data) => api.put(`/repertorios/${id}/`, data),
  delete: (id) => api.delete(`/repertorios/${id}/`),
  search: (columna, valor) => api.get(`/repertorios/${columna}/${valor}/`),
};