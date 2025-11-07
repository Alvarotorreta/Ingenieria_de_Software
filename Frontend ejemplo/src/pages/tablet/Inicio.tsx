import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function TabletInicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 80 + 30,
              height: Math.random() * 80 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-12"
        >
          {/* Logo/Title */}
          <div>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2
              }}
            >
              <Sparkles className="w-32 h-32 text-white mx-auto mb-8" />
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl text-white mb-4">
              ¡Bienvenidos!
            </h1>
            
            <p className="text-2xl md:text-3xl text-white/90">
              Juego de Emprendimiento UDD
            </p>
          </div>

          {/* Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={() => navigate('/tablet/entrar')}
              size="lg"
              className="h-20 px-16 text-2xl bg-white text-[#093c92] hover:bg-white/90 rounded-full shadow-2xl"
            >
              <LogIn className="w-8 h-8 mr-4" />
              Entrar a la Sala
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
