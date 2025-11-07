import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mic, ArrowRight, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function TabletInicioEtapa4() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-rose-500 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Stage lights effect */}
      <motion.div
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-0 left-1/4 w-64 h-64 bg-yellow-300/40 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        className="absolute top-0 right-1/4 w-64 h-64 bg-pink-300/40 rounded-full blur-3xl"
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="relative z-10 w-full max-w-4xl text-center space-y-12"
      >
        <div className="flex justify-center gap-6 mb-8">
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="w-20 h-20 text-yellow-300 drop-shadow-2xl" />
          </motion.div>
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -360]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Mic className="w-32 h-32 text-white drop-shadow-2xl" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -10, 10, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Star className="w-20 h-20 text-yellow-300 drop-shadow-2xl" />
          </motion.div>
        </div>

        <div className="bg-white/15 backdrop-blur-md rounded-3xl p-12 border-4 border-white/30 space-y-8">
          <div className="inline-block px-8 py-3 bg-white/20 rounded-full border-2 border-white/40 mb-4">
            <span className="text-white text-2xl">Etapa 4</span>
          </div>
          
          <h1 className="text-white text-7xl drop-shadow-lg">
            ¡Hora del Pitch!
          </h1>
          
          <p className="text-white/95 text-3xl leading-relaxed">
            Preparen su presentación para convencer a los inversionistas
          </p>

          <div className="flex gap-4 justify-center">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                className="w-3 h-3 bg-white rounded-full"
              />
            ))}
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => navigate('/tablet/crear-pitch')} 
              size="lg" 
              className="h-20 px-16 text-2xl bg-white text-pink-600 hover:bg-yellow-300 hover:text-pink-700 rounded-full shadow-2xl border-4 border-white/40"
            >
              Crear Presentación 
              <ArrowRight className="w-8 h-8 ml-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
