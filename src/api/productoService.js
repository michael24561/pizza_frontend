import api from './base/axiosConfig';

export const productoService = {
    getAll: () => api.get('/productos/'),
    getById: (id) => api.get(`/productos/${id}/`),
    create: (data) => api.post('/productos/', data),
    update: (id, data) => api.put(`/productos/${id}/`, data),
    delete: (id) => api.delete(`/productos/${id}/`),
    search: (columna, valor) => api.get(`/productos/${columna}/${valor}/`),
};

export const promocionService = {
    getAll: () => api.get('/promociones/'),
    getById: (id) => api.get(`/promociones/${id}/`),
    create: (data) => api.post('/promociones/', data),
    update: (id, data) => api.put(`/promociones/${id}/`, data),
    delete: (id) => api.delete(`/promociones/${id}/`),
    search: (columna, valor) => api.get(`/promociones/${columna}/${valor}/`),
};
