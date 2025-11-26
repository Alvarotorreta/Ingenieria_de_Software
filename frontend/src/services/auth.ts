import { api } from './api';

export const authAPI = {
  login: async (email: string, password: string) => {
    const username = email.includes('@') ? email.split('@')[0] : email;
    const response = await api.post('/auth/token/', { username, password });
    return response.data;
  },
  
  register: async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    access_code?: string;
  }) => {
    const username = data.email.includes('@') ? data.email.split('@')[0] : data.email;
    const response = await api.post('/auth/professors/', {
      username,
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      access_code: data.access_code || '',
    });
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/auth/professors/me/');
    return response.data;
  },
  
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/token/refresh/', { refresh: refreshToken });
    return response.data;
  },
  
  verifyToken: async (token: string) => {
    const response = await api.post('/auth/token/verify/', { token });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/auth/professors/stats/');
    return response.data;
  },

  // Admin methods
  getAdminProfile: async () => {
    const response = await api.get('/auth/administrators/me/');
    return response.data;
  },
};











