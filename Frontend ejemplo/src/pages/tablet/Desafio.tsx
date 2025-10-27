import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Target, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function TabletDesafio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-10 left-1/4 w-64 h-64 bg-yellow-300/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          y: [0, 30, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute bottom-10 right-1/4 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl"
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="relative z-10 w-full max-w-4xl text-center space-y-12"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Target className="w-32 h-32 text-white mx-auto drop-shadow-2xl" />
        </motion.div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border-4 border-white/30 space-y-8">
          <h1 className="text-white text-6xl drop-shadow-lg">
            El Desafío
          </h1>
          
          <div className="bg-white/10 rounded-2xl p-8 border-2 border-white/20">
            <Lightbulb className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
            <p className="text-white text-3xl leading-relaxed">
              Creen una solución innovadora que resuelva un problema real en su temática elegida
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => navigate('/tablet/bubble-map')} 
              size="lg" 
              className="h-20 px-16 text-2xl bg-white text-purple-600 hover:bg-yellow-300 hover:text-purple-700 rounded-full shadow-2xl"
            >
              Comenzar a Idear 
              <ArrowRight className="w-8 h-8 ml-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
