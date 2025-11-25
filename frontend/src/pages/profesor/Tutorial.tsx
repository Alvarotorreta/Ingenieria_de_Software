import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Tutorial() {
  const navigate = useNavigate();

  // URL del video tutorial - Puede ser un video de YouTube
  // Para cambiar el video, reemplaza el ID después de /embed/
  // Ejemplo: https://www.youtube.com/watch?v=VIDEO_ID se convierte en:
  // https://www.youtube.com/embed/VIDEO_ID
  const tutorialVideoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0&modestbranding=1';

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo animado igual que Panel */}
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
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative z-10 h-screen flex flex-col items-center justify-center p-2 sm:p-3">
        <div className="w-full max-w-5xl flex flex-col h-full">
          <Button
            onClick={() => navigate('/profesor/panel')}
            variant="ghost"
            className="mb-2 text-white hover:bg-white/20 self-start text-xs sm:text-sm"
            size="sm"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Volver al Panel
          </Button>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-3 sm:p-4 border border-gray-200 w-full flex-1 flex flex-col"
          >
            <div className="flex items-center justify-center gap-2 mb-2 flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#093c92] to-[#f757ac] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <Film className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <h2 className="text-[#093c92] text-base sm:text-lg font-bold">
                Video Instructivo
              </h2>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="flex-1 rounded-lg shadow-xl overflow-hidden relative bg-black min-h-0"
            >
              <iframe
                src={tutorialVideoUrl}
                title="Tutorial - Cómo Jugar Misión Emprende"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

