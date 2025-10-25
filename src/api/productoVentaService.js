import api from '../base/axiosConfig';

export const productoVentaService = {
  getAll: () => api.get('/productos-venta/'),
  getById: (id) => api.get(`/productos-venta/${id}/`),
  create: (data) => api.post('/productos-venta/', data),
  update: (id, data) => api.put(`/productos-venta/${id}/`, data),
  delete: (id) => api.delete(`/productos-venta/${id}/`),
  search: (columna, valor) => api.get(`/productos-venta/${columna}/${valor}/`),
};