import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Sparkles, Tablet, User, Shield, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner@2.0.3';

export default function ProfesorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simular autenticación
    setTimeout(() => {
      setLoading(false);
      
      if (email && password) {
        toast.success('¡Bienvenido! 🎉', {
          description: 'Iniciando sesión...'
        });
        
        // Verificar si es primera vez para mostrar tutorial
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        
        if (!hasSeenTutorial) {
          setTimeout(() => navigate('/profesor/tutorial'), 500);
        } else {
          setTimeout(() => navigate('/profesor/home'), 500);
        }
      } else {
        toast.error('Error', {
          description: 'Por favor completa todos los campos'
        });
      }
    }, 1000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
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
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          className="bg-white/90 hover:bg-white backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="inline-block"
              >
                <Sparkles className="w-16 h-16 text-[#f757ac] mx-auto" />
              </motion.div>
              <h1 className="text-[#093c92]">
                Iniciar Sesión
              </h1>
              <p className="text-gray-600">
                Bienvenido al Juego de Emprendimiento UDD
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#093c92]">
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu.correo@udd.cl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-[#f757ac] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#093c92]">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-[#f757ac] transition-colors"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#f757ac] hover:bg-[#f757ac]/90 text-white rounded-full transition-all transform hover:scale-105"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Ingresar'
                )}
              </Button>
            </form>

            {/* Quick Access for Prototype */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Acceso rápido para ver el prototipo:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => navigate('/admin/login')}
                  variant="outline"
                  size="sm"
                  className="flex flex-col h-auto py-3 gap-1 hover:bg-purple-50 hover:border-purple-300"
                >
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-xs">Admin</span>
                </Button>
                <Button
                  onClick={() => navigate('/tablet/inicio')}
                  variant="outline"
                  size="sm"
                  className="flex flex-col h-auto py-3 gap-1 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Tablet className="w-5 h-5 text-blue-600" />
                  <span className="text-xs">Tablet</span>
                </Button>
                <Button
                  onClick={() => navigate('/estudiante/entrar')}
                  variant="outline"
                  size="sm"
                  className="flex flex-col h-auto py-3 gap-1 hover:bg-green-50 hover:border-green-300"
                >
                  <User className="w-5 h-5 text-green-600" />
                  <span className="text-xs">Estudiante</span>
                </Button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center space-y-2">
              <button
                onClick={() => navigate('/profesor/registro')}
                className="text-[#093c92] hover:text-[#f757ac] transition-colors"
              >
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}