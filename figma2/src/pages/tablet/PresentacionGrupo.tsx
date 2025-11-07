import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  User,
  Check,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import GroupBadge from "../../components/GroupBadge";

const grupos = [
  { nombre: "Grupo Rojo", color: "#ff4757" },
  { nombre: "Grupo Azul", color: "#3742fa" },
  { nombre: "Grupo Verde", color: "#2ed573" },
  { nombre: "Grupo Amarillo", color: "#ffa502" },
];

export default function TabletPresentacionGrupo() {
  const navigate = useNavigate();
  const [grupoAsignado] = useState(() => {
    return grupos[Math.floor(Math.random() * 4)];
  });

  // Timer de 3 minutos
  const [timeLeft, setTimeLeft] = useState(180); // 180 segundos = 3 minutos
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Ocultar animación inicial después de 2 segundos
    const animTimer = setTimeout(
      () => setShowAnimation(false),
      2000,
    );

    return () => {
      clearInterval(timer);
      clearTimeout(animTimer);
    };
  }, []);

  const minutos = Math.floor(timeLeft / 60);
  const segundos = timeLeft % 60;

  const handleContinuar = () => {
    navigate("/tablet/rompe-hielos");
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac] flex items-center justify-center p-6 relative overflow-hidden">
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

      {/* Group Badge - Bottom Left */}
      <motion.div
        initial={{ scale: 0, x: -100 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="absolute bottom-4 left-4 z-20"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20">
          <GroupBadge
            name={grupoAsignado.nombre}
            color={grupoAsignado.color}
            size="large"
          />
        </div>
      </motion.div>

      {/* Timer - Top Right */}
      <motion.div
        initial={{ scale: 0, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", delay: 0.3 }}
        className="absolute top-4 right-4 z-20"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-yellow-300" />
            <div className="text-white">
              <div className="text-3xl font-mono">
                {minutos}:{segundos.toString().padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Initial Welcome Animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac]"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-40 h-40 text-yellow-300" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl h-full flex items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="w-full space-y-5"
        >
          {/* Header */}
          <div className="text-center">
            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.2, type: "spring" }}
              className="text-white text-5xl drop-shadow-lg"
            >
              ¡Momento de presentarse!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
              className="text-white/80 text-xl mt-2"
            >
              Cada integrante comparte brevemente:
            </motion.p>
          </div>

          {/* Instructions Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl border-4 border-white/50 shadow-2xl p-8"
          >
            {/* Grid de 3 columnas para las instrucciones */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 2.7 }}
                className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border-2 border-white/40">
                    <span className="text-white text-2xl">
                      1
                    </span>
                  </div>
                  <h3 className="text-2xl mb-2">Su nombre</h3>
                  <p className="text-white/90 text-lg">
                    ¿Cómo te llamas?
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.9 }}
                className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border-2 border-white/40">
                    <span className="text-white text-2xl">
                      2
                    </span>
                  </div>
                  <h3 className="text-2xl mb-2">
                    Qué estudias
                  </h3>
                  <p className="text-white/90 text-lg">
                    ¿Qué carrera?
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 3.1 }}
                className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3 border-2 border-white/40">
                    <span className="text-white text-2xl">
                      3
                    </span>
                  </div>
                  <h3 className="text-2xl mb-2">
                    Algo curioso
                  </h3>
                  <p className="text-white/90 text-lg">
                    Hobby, interés o dato breve
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Ejemplo - Full width */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 3.3 }}
              className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-5 border-2 border-emerald-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💡</span>
                <h3 className="text-emerald-900 text-xl">
                  Ejemplo:
                </h3>
              </div>
              <p className="text-emerald-800 text-lg italic pl-12">
                "Soy Fernanda, estudio Diseño, y amo los gatos
                🐱"
              </p>
            </motion.div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3.5 }}
          >
            <Button
              onClick={handleContinuar}
              className="w-full h-16 text-xl bg-white hover:bg-white/90 text-[#093c92] rounded-full shadow-xl transition-all hover:scale-[1.02]"
            >
              <Check className="w-7 h-7 mr-2" />
              ¡Listo! Continuar al juego
              <ArrowRight className="w-7 h-7 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}