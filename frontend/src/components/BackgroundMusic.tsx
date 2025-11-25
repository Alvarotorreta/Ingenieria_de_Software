import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { musicManager } from '@/utils/backgroundMusicManager';

interface BackgroundMusicProps {
  musicUrl?: string;
  volume?: number;
  storageKey?: string;
}

export function BackgroundMusic({ 
  musicUrl = '/music/dimelo-ma.mp3', // Archivo local: colocar en frontend/public/music/dimelo-ma.mp3
  volume = 0.3,
  storageKey = 'backgroundMusicEnabled'
}: BackgroundMusicProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Configurar el manager con los parámetros del componente
    musicManager.configure({ musicUrl, volume, storageKey });
    
    // Suscribirse a cambios de estado
    const unsubscribe = musicManager.subscribe((muted, playing) => {
      setIsMuted(muted);
      setIsPlaying(playing);
    });

    // No limpiar el audio al desmontar, solo desuscribirse
    return () => {
      unsubscribe();
    };
  }, [musicUrl, volume, storageKey]);

  const toggleMute = () => {
    musicManager.toggleMute();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        className="pointer-events-auto"
      >
        <Button
          onClick={toggleMute}
          size="lg"
          className="rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 shadow-2xl bg-white/90 hover:bg-white border-2 border-gray-200 hover:border-gray-300 transition-all"
          aria-label={isMuted ? 'Activar música' : 'Silenciar música'}
        >
          <AnimatePresence mode="wait">
            {isMuted ? (
              <motion.div
                key="muted"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </motion.div>
            ) : (
              <motion.div
                key="unmuted"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.2 }}
              >
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
}

