import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI } from '@/services';
import { toast } from 'sonner';

export function ProfesorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar autenticación al cargar (igual que en login.html - líneas 452-468)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const profile = await authAPI.getProfile();
        if (profile) {
          // Ya está autenticado, redirigir al panel (igual que en login.html - línea 459)
          navigate('/profesor/panel');
        }
      } catch (error) {
        // Token inválido, limpiar
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      // Usa exactamente la misma API que tienes en login.html
      const data = await authAPI.login(email, password);
      
      // Guardar tokens (igual que en login.html)
      localStorage.setItem('authToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      toast.success('¡Bienvenido! 🎉', {
        description: 'Iniciando sesión...',
      });

      // Redirigir al panel (igual que en login.html - línea 355)
      setTimeout(() => {
        navigate('/profesor/panel');
      }, 1000);
    } catch (error: any) {
      // Manejo de errores igual que en login.html
      const errorMessage = error.response?.data?.detail || 'Error al iniciar sesión';
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Fondo animado mejorado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 h-screen flex items-center justify-center p-3 sm:p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 backdrop-blur-sm">
            {/* Header mejorado */}
            <div className="text-center space-y-1.5 sm:space-y-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-[#f757ac] mx-auto drop-shadow-lg" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl font-bold text-[#093c92]"
              >
                Iniciar Sesión
              </motion.h1>
              <p className="text-gray-600 text-xs font-medium">
                Área exclusiva para <span className="text-[#093c92] font-bold">Profesores</span>
              </p>
              <p className="text-gray-500 text-[10px] sm:text-xs">
                Bienvenido a <span className="text-[#f757ac] font-semibold">Misión Emprende</span>
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[#093c92] font-semibold text-xs sm:text-sm">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu.correo@udd.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-10 border-2 focus:border-[#f757ac] transition-all text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[#093c92] font-semibold text-xs sm:text-sm">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 h-10 border-2 focus:border-[#f757ac] transition-all text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-[#f757ac] hover:bg-[#f757ac]/90 text-white shadow-lg hover:shadow-xl text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center space-y-1 pt-2 border-t border-gray-200">
              <p className="text-gray-500 text-[10px] sm:text-xs">
                ¿Eres profesor y aún no tienes cuenta?
              </p>
              <button
                onClick={() => navigate('/profesor/registro')}
                className="text-[#093c92] hover:text-[#f757ac] transition-colors font-semibold text-xs"
                disabled={loading}
              >
                Regístrate como Profesor <span className="underline">aquí</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


