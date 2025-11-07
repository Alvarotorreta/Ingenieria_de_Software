import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Users, Clock, Sparkles, SkipForward } from 'lucide-react';
import { Button } from '../../components/ui/button';
import GroupBadge from '../../components/GroupBadge';
import RankingTokens from '../../components/RankingTokens';

const grupos = [
  { nombre: 'Grupo Rojo', color: '#ff4757' },
  { nombre: 'Grupo Azul', color: '#3742fa' },
  { nombre: 'Grupo Verde', color: '#2ed573' },
  { nombre: 'Grupo Amarillo', color: '#ffa502' },
];

// Datos simulados de grupos con tokens para el ranking
const gruposConTokens = [
  { nombre: 'Grupo Rojo', color: '#ff4757', tokens: 450 },
  { nombre: 'Grupo Azul', color: '#3742fa', tokens: 380 },
  { nombre: 'Grupo Verde', color: '#2ed573', tokens: 520 },
  { nombre: 'Grupo Amarillo', color: '#ffa502', tokens: 410 },
];

export default function TabletEsperaEtapa() {
  const navigate = useNavigate();
  const [grupoAsignado] = useState(() => {
    return grupos[Math.floor(Math.random() * 4)];
  });

  const [dots, setDots] = useState('');
  const [mostrarRanking, setMostrarRanking] = useState(false);
  
  // Simular que el profesor finaliza la etapa después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarRanking(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Handler para el botón SKIP que muestra el ranking inmediatamente
  const handleSkip = () => {
    setMostrarRanking(true);
  };

  // Handler para continuar después del ranking
  const handleContinuarDesdeRanking = () => {
    navigate('/tablet/eleccion-tematica');
  };

  // Si se debe mostrar el ranking, renderizarlo
  if (mostrarRanking) {
    return (
      <RankingTokens 
        grupos={gruposConTokens}
        etapa={1} // Esto debería venir del contexto del juego
        onContinuar={handleContinuarDesdeRanking}
        variant="purple"
      />
    );
  }

  // Pantalla de espera
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac] flex items-center justify-center p-6 relative overflow-hidden">
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

      {/* Dev Skip Button - Top Right */}
      <motion.div
        initial={{ scale: 0, y: -50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', delay: 0.3 }}
        className="absolute top-4 right-4 z-20"
      >
        <Button
          onClick={handleSkip}
          className="bg-yellow-500/90 hover:bg-yellow-600 text-black border-2 border-yellow-300"
        >
          <SkipForward className="w-5 h-5 mr-2" />
          SKIP (Dev)
        </Button>
      </motion.div>

      {/* Group Badge - Bottom Left */}
      <motion.div
        initial={{ scale: 0, x: -100 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="absolute bottom-4 left-4 z-20"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border-2 border-white/20">
          <GroupBadge name={grupoAsignado.nombre} color={grupoAsignado.color} size="large" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-3xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-full p-6 border-4 border-white/20">
              <CheckCircle className="w-24 h-24 text-green-400" />
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-3"
          >
            <h1 className="text-white text-5xl drop-shadow-lg">
              ¡Etapa completada!
            </h1>
            <p className="text-white/90 text-2xl">
              Excelente trabajo equipo 🎉
            </p>
          </motion.div>

          {/* Waiting Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white/95 backdrop-blur-md rounded-3xl border-4 border-white/50 shadow-2xl p-8"
          >
            <div className="space-y-5">
              {/* Animated waiting icon */}
              <div className="flex justify-center">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Clock className="w-16 h-16 text-[#093c92]" />
                </motion.div>
              </div>

              {/* Waiting message */}
              <div className="text-center space-y-2">
                <h2 className="text-[#093c92] text-2xl">
                  Esperando a los demás grupos{dots}
                </h2>
                <p className="text-gray-600 text-lg">
                  El profesor finalizará la etapa cuando todos estén listos
                </p>
              </div>

              {/* Progress indicators */}
              <div className="flex justify-center gap-4 pt-2">
                {[0, 1, 2, 3].map((index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    className="w-4 h-4 bg-gradient-to-br from-[#093c92] to-purple-600 rounded-full"
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Motivational message */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/70 text-center text-xl"
          >
            ✨ Pueden conversar mientras esperan ✨
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
