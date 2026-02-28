import api from './base/axiosConfig';

const sucursalService = {
    getAll: () => api.get('/sucursales/'),
    getInventario: (sucursalId) => api.get(`/inventarios-sucursal/sucursal_id/${sucursalId}/`)
};

export default sucursalService;
