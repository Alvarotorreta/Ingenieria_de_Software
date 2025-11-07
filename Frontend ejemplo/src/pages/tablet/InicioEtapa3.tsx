import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Boxes, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function TabletInicioEtapa3() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center p-8 relative overflow-hidden">
      {/* LEGO brick decorations */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute top-10 right-10 w-32 h-32 bg-red-600/30 rounded-lg blur-2xl"
      />
      <motion.div
        animate={{ 
          rotate: [360, 0],
          scale: [1.2, 1, 1.2]
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-10 left-10 w-40 h-40 bg-yellow-600/30 rounded-lg blur-2xl"
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="relative z-10 w-full max-w-4xl text-center space-y-12"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Boxes className="w-32 h-32 text-white mx-auto drop-shadow-2xl" />
        </motion.div>

        <div className="bg-white/15 backdrop-blur-md rounded-3xl p-12 border-4 border-white/30 space-y-8">
          <div className="inline-block px-8 py-3 bg-white/20 rounded-full border-2 border-white/40 mb-4">
            <span className="text-white text-2xl">Etapa 3</span>
          </div>
          
          <h1 className="text-white text-7xl drop-shadow-lg">
            LEGO
          </h1>
          
          <p className="text-white/95 text-3xl leading-relaxed">
            Es hora de materializar su solución con LEGO
          </p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => navigate('/tablet/etapa3-lego')} 
              size="lg" 
              className="h-20 px-16 text-2xl bg-white text-orange-600 hover:bg-yellow-300 hover:text-orange-700 rounded-full shadow-2xl border-4 border-white/40"
            >
              Comenzar a Construir 
              <ArrowRight className="w-8 h-8 ml-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
