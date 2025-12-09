import api from './base/axiosConfig';

export const categoriaService = {
    getAll: () => api.get('/categorias/'),
    getById: (id) => api.get(`/categorias/${id}/`),
    search: (columna, valor) => api.get(`/categorias/${columna}/${valor}/`),
};
