import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, Shield, Tablet, User, GraduationCap } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner@2.0.3';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Error', {
        description: 'Por favor completa todos los campos'
      });
      return;
    }

    try {
      await login({
        correo_udd: email,
        contrasena: password
      });
      // El hook useAuth ya maneja la redirección al dashboard
    } catch (error) {
      // El error ya se muestra en el hook useAuth
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Shield className="w-16 h-16 text-purple-600 mx-auto" />
            </motion.div>
            <h1 className="text-slate-900">
              Panel de Administrador
            </h1>
            <p className="text-gray-600">
              Acceso restringido
            </p>
          </div>

          {/* Credentials info */}
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-xs text-purple-800 text-center">
              <strong>Credenciales:</strong> admin@udd.cl / admin123
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@udd.cl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-2"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                'Ingresar al Panel'
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
                onClick={() => navigate('/profesor/login')}
                variant="outline"
                size="sm"
                className="flex flex-col h-auto py-3 gap-1 hover:bg-blue-50 hover:border-blue-300"
              >
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span className="text-xs">Profesor</span>
              </Button>
              <Button
                onClick={() => navigate('/tablet/inicio')}
                variant="outline"
                size="sm"
                className="flex flex-col h-auto py-3 gap-1 hover:bg-green-50 hover:border-green-300"
              >
                <Tablet className="w-5 h-5 text-green-600" />
                <span className="text-xs">Tablet</span>
              </Button>
              <Button
                onClick={() => navigate('/estudiante/entrar')}
                variant="outline"
                size="sm"
                className="flex flex-col h-auto py-3 gap-1 hover:bg-orange-50 hover:border-orange-300"
              >
                <User className="w-5 h-5 text-orange-600" />
                <span className="text-xs">Estudiante</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}