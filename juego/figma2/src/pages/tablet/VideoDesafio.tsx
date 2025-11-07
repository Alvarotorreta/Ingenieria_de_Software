import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, ArrowRight, Wallet, GraduationCap, Smartphone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useGame } from '../../contexts/GameContext';

const desafiosData = [
  { 
    id: 1, 
    titulo: 'Educación Financiera Accesible',
    descripcion: 'La ausencia de educación financiera dificulta la planificación y uso responsable del dinero',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Video placeholder
    icono: '💰',
    color: 'from-green-500 to-emerald-600',
    Icon: Wallet
  },
  { 
    id: 2, 
    titulo: 'Inicio de Vida Laboral',
    descripcion: 'Estudiantes recién titulados enfrentan barreras para conseguir su primer empleo',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Video placeholder
    icono: '🎓',
    color: 'from-blue-500 to-indigo-600',
    Icon: GraduationCap
  },
  { 
    id: 3, 
    titulo: 'Tecnología para Adultos Mayores',
    descripcion: 'El avance tecnológico ha dejado a los adultos mayores con dificultades de adaptación',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Video placeholder
    icono: '📱',
    color: 'from-purple-500 to-pink-600',
    Icon: Smartphone
  },
];

export default function TabletVideoDesafio() {
  const navigate = useNavigate();
  const { session } = useGame();
  
  const desafio = desafiosData.find(d => d.id === session?.desafioSeleccionado) || desafiosData[0];
  const IconComponent = desafio.Icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac] p-8 relative overflow-hidden">
      {/* Animated decorations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 right-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl"
            >
              {desafio.icono}
            </motion.div>
            <h1 className="text-white drop-shadow-lg">
              {desafio.titulo}
            </h1>
          </div>
          <p className="text-white/90 text-2xl">
            Conoce más sobre el desafío
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border-4 border-white/30 shadow-2xl">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group">
              {/* Video iframe */}
              <iframe
                className="w-full h-full"
                src={desafio.videoUrl}
                title={desafio.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              {/* Play overlay - only shown initially */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="w-24 h-24 text-white drop-shadow-2xl" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Descripción del desafío */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className={`bg-gradient-to-r ${desafio.color} rounded-3xl p-8 border-4 border-white/30 shadow-2xl`}>
            <div className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-white text-3xl mb-4">
                  El Desafío
                </h2>
                <p className="text-white/95 text-xl leading-relaxed">
                  {desafio.descripcion}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Botón continuar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => navigate('/tablet/desafio')}
            size="lg"
            className="h-20 px-16 text-2xl bg-yellow-400 hover:bg-yellow-500 text-[#093c92] rounded-full shadow-2xl shadow-yellow-400/50 transition-all duration-300"
          >
            Continuar al Desafío
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
