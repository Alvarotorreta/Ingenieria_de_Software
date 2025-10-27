import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function TabletIntroduccion() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated decorations */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 right-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative z-10 text-center space-y-12 max-w-5xl"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="w-32 h-32 text-yellow-300 mx-auto drop-shadow-2xl" />
        </motion.div>

        <div className="space-y-6 bg-white/10 backdrop-blur-md rounded-3xl p-12 border-4 border-white/20">
          <h1 className="text-white text-6xl drop-shadow-lg">
            ¡Bienvenidos al Juego!
          </h1>
          <p className="text-white/90 text-3xl leading-relaxed">
            Van a trabajar juntos para crear una idea de emprendimiento innovadora
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => navigate('/tablet/mini-juego')}
            size="lg"
            className="h-20 px-16 text-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full shadow-2xl border-4 border-white/30"
          >
            <Play className="w-8 h-8 mr-4" />
            ¡Empezar!
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
