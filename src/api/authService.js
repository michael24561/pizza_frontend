import api from './base/axiosConfig';

export const authService = {
  login: async (credentials) => {
    // Para el endpoint api-token-auth/ de Django REST
    const response = await api.post('/api-token-auth/', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  },

  registro: (data) => api.post('/registro/', data), // Tu endpoint personalizado
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/logout/');
  },

  refreshToken: () => api.post('/refresh/'),

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};