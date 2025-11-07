import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { GraduationCap, Shield, Tablet, User, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function SeleccionUsuario() {
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'profesor',
      title: 'Profesor',
      description: 'Gestiona y modera el juego',
      icon: GraduationCap,
      color: 'from-blue-500 to-blue-700',
      hoverColor: 'hover:from-blue-600 hover:to-blue-800',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      path: '/profesor/login',
      delay: 0,
    },
    {
      id: 'admin',
      title: 'Administrador',
      description: 'Panel de control y métricas',
      icon: Shield,
      color: 'from-purple-500 to-purple-700',
      hoverColor: 'hover:from-purple-600 hover:to-purple-800',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      path: '/admin/login',
      delay: 0.1,
    },
    {
      id: 'tablet',
      title: 'Tablet (Grupo)',
      description: 'Participa con tu grupo',
      icon: Tablet,
      color: 'from-green-500 to-green-700',
      hoverColor: 'hover:from-green-600 hover:to-green-800',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      path: '/tablet/inicio',
      delay: 0.2,
    },
    {
      id: 'estudiante',
      title: 'Estudiante',
      description: 'Evaluación individual',
      icon: User,
      color: 'from-orange-500 to-orange-700',
      hoverColor: 'hover:from-orange-600 hover:to-orange-800',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      path: '/estudiante/entrar',
      delay: 0.3,
    },
  ];

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

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: -100,
              opacity: 0.3
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: 360,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear',
            }}
            style={{
              left: `${(i * 20) % 100}%`,
            }}
          >
            <Sparkles className="w-8 h-8 text-white/20" />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 space-y-4"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="inline-block"
            >
              <Sparkles className="w-20 h-20 text-white mx-auto mb-4" />
            </motion.div>
            <h1 className="text-white text-5xl md:text-6xl">
              Juego de Emprendimiento
            </h1>
            <p className="text-white/90 text-xl md:text-2xl">
              Universidad del Desarrollo
            </p>
            <div className="h-1 w-32 bg-white/50 rounded-full mx-auto mt-6" />
          </motion.div>

          {/* User Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-white text-center text-2xl mb-8">
              ¿Quién eres?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: type.delay,
                      type: 'spring',
                      stiffness: 100,
                    }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => navigate(type.path)}
                      className="w-full h-full"
                    >
                      <div className={`bg-white rounded-3xl shadow-2xl p-8 h-full flex flex-col items-center justify-center space-y-6 border-4 ${type.borderColor} hover:shadow-3xl transition-all duration-300`}>
                        {/* Icon Container */}
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className={`${type.bgColor} p-6 rounded-full`}
                        >
                          <Icon className={`w-16 h-16 ${type.iconColor}`} />
                        </motion.div>

                        {/* Text */}
                        <div className="space-y-2 text-center">
                          <h3 className="text-gray-900 text-2xl">
                            {type.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {type.description}
                          </p>
                        </div>

                        {/* Button */}
                        <Button
                          className={`w-full bg-gradient-to-r ${type.color} ${type.hoverColor} text-white rounded-full py-6 transition-all duration-300`}
                        >
                          Ingresar
                        </Button>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-center text-white/70 text-sm mt-12"
          >
            <p>Desarrollado para la Universidad del Desarrollo</p>
            <p className="mt-2">© 2025 - Todos los derechos reservados</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
