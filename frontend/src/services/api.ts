import axios from 'axios';

// En desarrollo, usar el proxy de Vite (/api)
// En producción, usar la variable de entorno VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    // No agregar token de autenticación a rutas de tablets (no requieren autenticación)
    const currentPath = window.location.pathname;
    const isTabletRoute = currentPath.startsWith('/tablet/');
    
    // También verificar si la URL de la petición es de tablet connections o game-sessions/lobby
    const isTabletConnectionEndpoint = config.url?.includes('/tablet-connections/') || 
                                      config.url?.includes('/tablet-connections') ||
                                      (config.url?.includes('/game-sessions/') && config.url?.includes('/lobby/'));
    
    // Si estamos en una ruta de tablet o haciendo petición a endpoint de tablet, 
    // asegurarnos de que no se envíe el token (y limpiarlo si está presente en headers)
    if (isTabletRoute || isTabletConnectionEndpoint) {
      delete config.headers.Authorization;
    } else {
      // Solo agregar token en rutas que no son de tablet
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Solo manejar 401 en rutas de profesor, no en tablets
      if (currentPath.startsWith('/profesor/')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/profesor/login';
      }
      // En rutas de tablet, no hacer nada (las tablets no requieren autenticación)
      // El error se manejará en el componente
    }
    return Promise.reject(error);
  }
);

// Helper para unwrap results de paginación
export const unwrapResults = <T>(data: any): T => {
  if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
    return data.results as T;
  }
  return data as T;
};

export default api;
