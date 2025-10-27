import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import type { Usuario, LoginRequest, RegistroRequest } from '../types/database';
import { toast } from 'sonner';

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  registro: (data: RegistroRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar usuario del localStorage al iniciar
    const usuarioGuardado = authApi.getCurrentUser();
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(data);
      setUsuario(response.usuario);
      toast.success('Inicio de sesión exitoso');

      // Redirigir según tipo de usuario
      if (response.usuario.id_tipoUsuario === 1) {
        // Profesor
        navigate('/profesor/home');
      } else if (response.usuario.id_tipoUsuario === 2) {
        // Admin
        navigate('/admin/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registro = async (data: RegistroRequest) => {
    try {
      setIsLoading(true);
      await authApi.registro(data);
      toast.success('Registro exitoso. Por favor inicia sesión.');
      navigate('/profesor/login');
    } catch (error: any) {
      toast.error(error.message || 'Error al registrarse');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.logout();
    setUsuario(null);
    toast.info('Sesión cerrada');
    navigate('/profesor/login');
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated: !!usuario,
        isLoading,
        login,
        registro,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
