import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, ArrowRight, Film } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function TabletVideo() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 50, 0]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          scale: [1.3, 1, 1.3],
          x: [0, -50, 0]
        }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-20 right-20 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-5xl space-y-8"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border-4 border-white/30">
          <div className="flex items-center justify-center gap-4 mb-8">
            <Film className="w-12 h-12 text-white" />
            <h2 className="text-white text-5xl">
              Video Institucional
            </h2>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl flex items-center justify-center mb-8 border-4 border-white/20 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative z-10"
            >
              <Play className="w-32 h-32 text-white/80" />
            </motion.div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/tablet/eleccion-tematica')}
              className="w-full h-16 text-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full shadow-xl border-4 border-white/30"
            >
              Continuar
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
