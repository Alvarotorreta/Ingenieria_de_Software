import axios from 'axios';

// Misma URL base que usas actualmente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    // Solo agregar token si estamos en una ruta de profesor
    // Las tablets no necesitan token, usan connection_id
    const currentPath = window.location.pathname;
    const isTabletRoute = currentPath.startsWith('/tablet/');
    
    if (!isTabletRoute) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // Si es FormData, no establecer Content-Type (el navegador lo hace automáticamente con boundary)
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
      // Solo redirigir a login si estamos en una ruta de profesor
      // Las tablets no deben redirigirse al login del profesor
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/profesor/')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/profesor/login';
      }
      // Si es una tablet, no hacer nada (dejar que maneje el error normalmente)
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  /**
   * Login - Usa exactamente la misma API que tienes
   * POST /api/auth/token/
   * Body: { username, password }
   * Retorna: { access, refresh }
   */
  login: async (email: string, password: string) => {
    // Extraer username del email (parte antes del @) - igual que en login.html
    const username = email.includes('@') ? email.split('@')[0] : email;
    
    const response = await api.post('/auth/token/', {
      username,
      password,
    });
    
    return response.data; // { access, refresh }
  },
  
  /**
   * Registro - Usa exactamente la misma API que tienes
   * POST /api/auth/professors/
   * Body: { username, email, password, first_name, last_name, access_code? }
   */
  register: async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    access_code?: string;
  }) => {
    // Extraer username del email (parte antes del @) - igual que en login.html
    const username = data.email.includes('@') ? data.email.split('@')[0] : data.email;
    
    const response = await api.post('/auth/professors/', {
      username,
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
      // Si access_code está vacío o undefined, enviar como string vacío (el backend lo convierte a None)
      access_code: data.access_code || '',
    });
    
    return response.data;
  },
  
  /**
   * Obtener perfil del profesor actual
   * GET /api/auth/professors/me/
   * Requiere: Authorization: Bearer {token}
   */
  getProfile: async () => {
    const response = await api.get('/auth/professors/me/');
    return response.data;
  },
  
  /**
   * Refrescar token
   * POST /api/auth/token/refresh/
   * Body: { refresh }
   */
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },
  
  /**
   * Verificar token
   * POST /api/auth/token/verify/
   * Body: { token }
   */
  verifyToken: async (token: string) => {
    const response = await api.post('/auth/token/verify/', {
      token,
    });
    return response.data;
  },
};

export default api;


