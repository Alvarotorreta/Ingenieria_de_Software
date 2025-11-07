import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Key, ArrowLeft, Loader2, GraduationCap, BookOpen, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authAPI } from '@/services/api';
import { toast } from 'sonner';

export function ProfesorRegistro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    codigo: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones igual que en login.html
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Usa exactamente la misma API que tienes en login.html
      await authAPI.register({
        email: formData.email,
        password: formData.password,
        first_name: formData.nombre,
        last_name: formData.apellidos,
        access_code: formData.codigo || undefined, // Si está vacío, no enviar
      });

      toast.success('¡Cuenta creada exitosamente! 🎉', {
        description: 'Iniciando sesión automáticamente...',
      });

      // Login automático después del registro (igual que en login.html - líneas 413-429)
      setTimeout(async () => {
        try {
          // Extraer username del email (igual que en login.html)
          const username = formData.email.includes('@') ? formData.email.split('@')[0] : formData.email;
          
          const loginData = await authAPI.login(formData.email, formData.password);
          
          // Guardar tokens
          localStorage.setItem('authToken', loginData.access);
          localStorage.setItem('refreshToken', loginData.refresh);

          toast.success('¡Sesión iniciada!', {
            description: 'Redirigiendo al panel...',
          });

          // Redirigir al panel (igual que en login.html - línea 425)
          setTimeout(() => navigate('/profesor/panel'), 500);
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || 'Error al iniciar sesión';
          toast.error('Registro exitoso pero error al iniciar sesión', {
            description: errorMessage,
          });
          // Si falla el login, redirigir al login manual
          setTimeout(() => navigate('/profesor/login'), 2000);
        }
      }, 1000);
    } catch (error: any) {
      // Manejo de errores igual que en login.html
      let errorMessage = 'Error al registrar';
      if (error.response?.data) {
        const data = error.response.data;
        if (data.email) {
          errorMessage = Array.isArray(data.email) ? data.email[0] : data.email;
        } else if (data.username) {
          errorMessage = Array.isArray(data.username) ? data.username[0] : data.username;
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      }
      toast.error('Error', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Mismo fondo animado que Login */}
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

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4 sm:space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Botón Volver */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/profesor/login')}
              className="rounded-full"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            {/* Header */}
            <div className="text-center space-y-3 sm:space-y-4">
              {/* Badge Profesor */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#093c92] to-[#1e5bb8] text-white rounded-full text-xs sm:text-sm font-semibold shadow-lg"
              >
                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-sm">REGISTRO DE PROFESOR</span>
                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.div>

              <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 text-[#f757ac] mx-auto drop-shadow-lg" />
              <h1 className="text-2xl sm:text-3xl font-bold text-[#093c92]">
                Crear Cuenta de Profesor
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm font-medium">
                Área exclusiva para <span className="text-[#093c92] font-bold">Profesores UDD</span>
              </p>
              <p className="text-gray-500 text-[10px] sm:text-xs">
                Únete al Juego de Emprendimiento UDD
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="text-sm sm:text-base">Nombres</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="nombre"
                      placeholder="Juan"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos" className="text-sm sm:text-base">Apellidos</Label>
                  <Input
                    id="apellidos"
                    placeholder="Pérez"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className="h-11 sm:h-12 text-sm sm:text-base"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">Correo UDD</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu.correo@udd.cl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo" className="flex items-center gap-2 text-sm sm:text-base">
                  <Key className="w-3 h-3 sm:w-4 sm:h-4 text-[#093c92]" />
                  <span className="text-xs sm:text-sm">Código de Acceso de Profesor (Opcional)</span>
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    id="codigo"
                    placeholder="Si tienes código de profesor, ingrésalo aquí"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    disabled={loading}
                  />
                </div>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Solo si posees un código de acceso especial de profesor
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    required
                    minLength={8}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirmar Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-9 sm:pl-10 h-11 sm:h-12 text-sm sm:text-base"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 sm:h-12 bg-[#f757ac] hover:bg-[#f757ac]/90 text-white mt-4 sm:mt-6 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Creando cuenta de profesor...
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Crear Cuenta de Profesor
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center space-y-2 pt-4 border-t border-gray-200">
              <p className="text-gray-500 text-[10px] sm:text-xs">
                ¿Ya tienes una cuenta de profesor?
              </p>
              <button
                onClick={() => navigate('/profesor/login')}
                className="text-[#093c92] hover:text-[#f757ac] transition-colors font-semibold text-xs sm:text-sm"
                disabled={loading}
              >
                Inicia sesión <span className="underline">aquí</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


