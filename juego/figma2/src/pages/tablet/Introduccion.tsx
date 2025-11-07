import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Play, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

export default function TabletIntroduccion() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac] flex flex-col items-center justify-center p-6 relative overflow-hidden">
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

      {/* Back Button - Top Left */}
      <motion.div
        initial={{ scale: 0, x: -50 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="absolute top-4 left-4 z-20"
      >
        <Button
          onClick={() => navigate(-1)}
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center mb-4"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-10 h-10 text-yellow-300 drop-shadow-2xl" />
          </motion.div>
          <h1 className="text-white text-4xl drop-shadow-lg">
            ¡Bienvenidos al Juego!
          </h1>
          <motion.div
            animate={{ rotate: [360, 0] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Sparkles className="w-10 h-10 text-yellow-300 drop-shadow-2xl" />
          </motion.div>
        </div>
        <p className="text-white/90 text-lg">
          Mira este video para conocer cómo la UDD apoya el emprendimiento
        </p>
      </motion.div>

      {/* Video Player - CENTERED */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 w-full max-w-4xl flex-shrink-0"
      >
        <div className="bg-black/50 backdrop-blur-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
          {/* Video Container */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-black">
            {/* 
              PLACEHOLDER: Reemplazar con el video institucional real de la UDD
              Opciones:
              1. Video de YouTube: <iframe src="https://www.youtube.com/embed/VIDEO_ID" />
              2. Video local: <video src="/ruta/video.mp4" controls />
              3. Video de Vimeo u otro servicio
            */}
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0"
              title="Video Institucional UDD - Sello Emprendedor"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* Optional overlay badge */}
            <div className="absolute top-3 left-3 bg-[#093c92]/90 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/30">
              <p className="text-white text-sm">📹 Sello Emprendedor UDD</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 text-center mt-4 space-y-3"
      >
        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border-2 border-white/20 inline-block">
          <p className="text-white/90 text-base">
            El grupo que consiga más tokens será el ganador 🏆 Todas las actividades tendrán tiempo asignado ⏱️
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => navigate("/tablet/entrar")}
            size="lg"
            className="h-16 px-12 text-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white rounded-full shadow-2xl border-2 border-white/30"
          >
            <Play className="w-6 h-6 mr-3" />
            ¡Empezar!
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}