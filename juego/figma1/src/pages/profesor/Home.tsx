import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, History, BookOpen, LogOut, Sparkles, Trophy, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function ProfesorHome() {
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: Play,
      title: 'Nuevo Juego',
      description: 'Comienza una nueva sesión',
      color: 'from-pink-500 to-rose-500',
      action: () => navigate('/profesor/crear-sala')
    },
    {
      icon: History,
      title: 'Historial',
      description: 'Ver juegos anteriores',
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/profesor/historial')
    },
    {
      icon: BookOpen,
      title: 'Objetivos',
      description: 'Objetivos de aprendizaje',
      color: 'from-purple-500 to-violet-500',
      action: () => navigate('/profesor/objetivos')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-white mb-2">
              ¡Bienvenido Profesor! 👋
            </h1>
            <p className="text-white/80 text-lg">
              Juego de Emprendimiento UDD
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="outline"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              onClick={() => {
                localStorage.removeItem('hasSeenTutorial');
                navigate('/profesor/login');
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </motion.div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm p-6 border-0 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-4 rounded-2xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Juegos realizados</p>
                  <p className="text-3xl text-[#093c92]">12</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm p-6 border-0 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estudiantes activos</p>
                  <p className="text-3xl text-[#093c92]">145</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/95 backdrop-blur-sm p-6 border-0 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-purple-500 to-violet-500 p-4 rounded-2xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Promedio satisfacción</p>
                  <p className="text-3xl text-[#093c92]">4.8</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main menu */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className="bg-white/95 backdrop-blur-sm p-8 border-0 shadow-2xl cursor-pointer group overflow-hidden relative"
                onClick={item.action}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`bg-gradient-to-br ${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-[#093c92] mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {item.description}
                  </p>

                  <motion.div
                    className="mt-6 flex items-center text-[#f757ac] group-hover:translate-x-2 transition-transform"
                  >
                    Comenzar
                    <Sparkles className="w-4 h-4 ml-2" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick start button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
          className="fixed bottom-8 right-8"
        >
          <Button
            size="lg"
            onClick={() => navigate('/profesor/crear-sala')}
            className="h-16 px-8 bg-gradient-to-r from-[#f757ac] to-pink-600 hover:from-pink-600 hover:to-[#f757ac] text-white rounded-full shadow-2xl transform hover:scale-110 transition-all"
          >
            <Play className="w-6 h-6 mr-2" />
            ¡Comenzar Juego!
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
