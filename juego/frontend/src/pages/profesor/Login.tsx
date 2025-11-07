import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, GraduationCap, BookOpen, ArrowLeft, Loader2, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI } from '@/services/api';
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
    <div className="relative min-h-screen overflow-hidden">
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
        
        {/* Efectos de partículas adicionales */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                y: [null, Math.random() * window.innerHeight],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Botón Volver */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white backdrop-blur-sm text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Volver</span>
        </Button>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 sm:space-y-8 backdrop-blur-sm">
            {/* Header mejorado */}
            <div className="text-center space-y-3 sm:space-y-4">
              {/* Badge Profesor */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#093c92] to-[#1e5bb8] text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg"
              >
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>PROFESOR</span>
                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.div>

              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-[#f757ac] mx-auto drop-shadow-lg" />
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl sm:text-3xl font-bold text-[#093c92]"
              >
                Iniciar Sesión
              </motion.h1>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">
                Área exclusiva para <span className="text-[#093c92] font-bold">Profesores</span>
              </p>
              <p className="text-gray-500 text-[10px] sm:text-xs">
                Bienvenido al Juego de Emprendimiento UDD
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#093c92] font-semibold text-sm sm:text-base">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu.correo@udd.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 sm:pl-10 h-11 sm:h-12 border-2 focus:border-[#f757ac] transition-all text-sm sm:text-base"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#093c92] font-semibold text-sm sm:text-base">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 sm:pl-10 h-11 sm:h-12 border-2 focus:border-[#f757ac] transition-all text-sm sm:text-base"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 bg-[#f757ac] hover:bg-[#f757ac]/90 text-white shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Ingresar'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center space-y-2 pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-[10px] sm:text-xs mb-2">
                ¿Eres profesor y aún no tienes cuenta?
              </p>
              <button
                onClick={() => navigate('/profesor/registro')}
                className="text-[#093c92] hover:text-[#f757ac] transition-colors font-semibold text-xs sm:text-sm"
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


