import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles, ArrowRight, RotateCcw, Users, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import GroupBadge from '../../components/GroupBadge';
import { toast } from 'sonner@2.0.3';

const grupos = [
  { nombre: 'Grupo Rojo', color: '#ff4757' },
  { nombre: 'Grupo Azul', color: '#3742fa' },
  { nombre: 'Grupo Verde', color: '#2ed573' },
  { nombre: 'Grupo Amarillo', color: '#ffa502' },
];

const preguntas = [
  "¿Qué superpoder te gustaría tener?",
  "¿Cuál fue tu último fail?",
  "Si fueras un meme, ¿cuál serías?",
  "¿Qué canción describe tu semana?",
  "¿Qué harías si fueras invisible por un día?",
  "¿Cuál sería tu nombre de superhéroe?",
  "¿Qué comida comerías todos los días si pudieras?",
  "¿Qué emoji te representa hoy?",
  "¿Qué hiciste esta semana que nadie esperaría de ti?",
  "¿Qué app usarías si solo pudieras quedarte con una?",
  "¿Qué harías si ganaras la lotería mañana?",
  "Si pudieras eliminar una comida del mundo para siempre, ¿cuál sería?",
  "¿Cuál es tu GIF favorito?",
  "¿Qué personaje de película o serie te representa?",
  "¿Cuál es tu peor habilidad?",
];

export default function TabletRompeHielos() {
  const navigate = useNavigate();
  const [grupoAsignado] = useState(() => {
    return grupos[Math.floor(Math.random() * 4)];
  });

  const [numeroIntegrantes, setNumeroIntegrantes] = useState<number | null>(null);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [showInstrucciones, setShowInstrucciones] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState<string | null>(null);
  const [preguntasUsadas, setPreguntasUsadas] = useState<string[]>([]);
  const [contador, setContador] = useState(0);
  const [showButton, setShowButton] = useState(true);

  const iniciarJuego = (numIntegrantes: number) => {
    setNumeroIntegrantes(numIntegrantes);
    setJuegoIniciado(true);
    setShowInstrucciones(true);
  };

  const obtenerPreguntaAleatoria = () => {
    // Verificar si ya alcanzamos el número de integrantes
    if (numeroIntegrantes && contador >= numeroIntegrantes) {
      toast.info('¡Ya todos han participado! 🎉');
      return;
    }

    // Filtrar preguntas no usadas
    const preguntasDisponibles = preguntas.filter(p => !preguntasUsadas.includes(p));
    
    if (preguntasDisponibles.length === 0) {
      toast.success('¡Han usado todas las preguntas disponibles! 🎉');
      return;
    }

    const preguntaRandom = preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)];
    setPreguntaActual(preguntaRandom);
    setPreguntasUsadas([...preguntasUsadas, preguntaRandom]);
    setContador(contador + 1);
    setShowButton(false);

    // Mostrar botón de nuevo después de 3 segundos
    setTimeout(() => setShowButton(true), 3000);
  };

  const resetear = () => {
    setPreguntaActual(null);
    setPreguntasUsadas([]);
    setContador(0);
    setShowButton(true);
    setJuegoIniciado(false);
    setNumeroIntegrantes(null);
    toast.success('¡Reiniciado! Empiecen de nuevo');
  };

  const handleContinuar = () => {
    navigate('/tablet/mini-quiz');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated decorations */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
          x: [0, 50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-10 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.3, 1, 1.3],
          rotate: [360, 180, 0],
          x: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-10 left-10 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl"
      />

      {/* Group Badge - Bottom Left */}
      <motion.div
        initial={{ scale: 0, x: -100 }}
        animate={{ scale: 1, x: 0 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="absolute bottom-4 left-4 z-20"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20">
          <GroupBadge name={grupoAsignado.nombre} color={grupoAsignado.color} size="large" />
        </div>
      </motion.div>

      {/* Contador - Top Right (Solo cuando el juego ha iniciado) */}
      {juegoIniciado && numeroIntegrantes && (
        <motion.div
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', delay: 0.3 }}
          className="absolute top-4 right-4 z-20"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20">
            <div className="text-white text-center">
              <div className="text-3xl font-mono">{contador}/{numeroIntegrantes}</div>
              <div className="text-sm opacity-80">participantes</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Reset Button - Top Left */}
      {juegoIniciado && contador > 0 && (
        <motion.div
          initial={{ scale: 0, x: -50 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ type: 'spring' }}
          className="absolute top-4 left-4 z-20"
        >
          <Button
            onClick={resetear}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/40 backdrop-blur-md"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reiniciar
          </Button>
        </motion.div>
      )}

      {/* Help Button - Top Left (cuando ya inicio el juego) */}
      {juegoIniciado && (
        <motion.div
          initial={{ scale: 0, x: -50 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ type: 'spring', delay: 0.4 }}
          className="absolute top-4 left-4 z-20"
          style={{ marginTop: contador > 0 ? '70px' : '0' }}
        >
          <Button
            onClick={() => setShowInstrucciones(true)}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/40 backdrop-blur-md"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            ¿Cómo jugar?
          </Button>
        </motion.div>
      )}

      {/* Dialog de Instrucciones */}
      <Dialog open={showInstrucciones} onOpenChange={setShowInstrucciones}>
        <DialogContent className="bg-gradient-to-br from-purple-50 to-blue-50 border-4 border-purple-300 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl text-center text-purple-900 flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-yellow-500" />
              ¿Cómo jugar El Botón del Caos?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <div>
                  <h4 className="text-purple-900 text-lg">Una persona presiona el botón</h4>
                  <p className="text-gray-600">El botón amarillo del caos revelará una pregunta</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <div>
                  <h4 className="text-purple-900 text-lg">Lee la pregunta en voz alta</h4>
                  <p className="text-gray-600">Para que todo el grupo la escuche</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <div>
                  <h4 className="text-purple-900 text-lg">Responde en 5 segundos</h4>
                  <p className="text-gray-600">Una frase rápida, sin pensar mucho</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">4️⃣</span>
                <div>
                  <h4 className="text-purple-900 text-lg">Pasa la tablet al siguiente</h4>
                  <p className="text-gray-600">Para que otro compañero presione</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-orange-300">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <p className="text-orange-900">
                  <span className="block">¡Objetivo: que todos hablen al menos una vez!</span>
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setShowInstrucciones(false)}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
          >
            ¡Entendido! Vamos a jugar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {!juegoIniciado ? (
            // Pantalla de selección de integrantes
            <motion.div
              key="seleccion"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-4">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users className="w-24 h-24 text-yellow-300 mx-auto" />
                </motion.div>
                <h1 className="text-white text-5xl drop-shadow-lg">
                  El Botón del Caos
                </h1>
                <p className="text-white/90 text-2xl">
                  Rompehielos rápido y divertido 🎲
                </p>
              </div>

              {/* Pregunta de integrantes */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-4 border-white/50"
              >
                <h2 className="text-3xl text-center text-gray-900 mb-6">
                  ¿Cuántos integrantes son en el grupo?
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  {[2, 3, 4, 5].map((num) => (
                    <motion.div
                      key={num}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => iniciarJuego(num)}
                        className="w-full h-24 text-4xl bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-2xl shadow-lg border-2 border-white/30"
                      >
                        <Users className="w-8 h-8 mr-3" />
                        {num} personas
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <p className="text-gray-500 text-center mt-6">
                  💡 Selecciona el número para ajustar las preguntas
                </p>
              </motion.div>
            </motion.div>
          ) : (
            // Pantalla del juego
            <motion.div
              key="juego"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center space-y-2">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                  }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-16 h-16 text-yellow-300 mx-auto" />
                </motion.div>
                <h1 className="text-white text-5xl drop-shadow-lg">
                  El Botón del Caos
                </h1>
                <p className="text-white/90 text-xl">
                  {numeroIntegrantes} integrantes - ¡Que todos participen! 🎲
                </p>
              </div>

              {/* Pregunta Display */}
              <AnimatePresence mode="wait">
                {preguntaActual && (
                  <motion.div
                    key={preguntaActual}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                    transition={{ type: 'spring', duration: 0.6 }}
                    className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400"
                  >
                    <div className="flex items-start gap-4">
                      <motion.span 
                        className="text-5xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        💥
                      </motion.span>
                      <p className="text-gray-900 text-3xl flex-1 leading-tight">
                        {preguntaActual}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chaos Button */}
              {showButton && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={obtenerPreguntaAleatoria}
                    disabled={numeroIntegrantes ? contador >= numeroIntegrantes : false}
                    className="w-full h-24 text-3xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 hover:from-yellow-500 hover:via-orange-500 hover:to-red-600 text-white rounded-full shadow-2xl border-4 border-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Zap className="w-10 h-10 mr-3" />
                    {preguntaActual 
                      ? "¡Siguiente pregunta del caos!" 
                      : "👉 Presiona para desatar el caos"}
                  </Button>
                </motion.div>
              )}

              {/* Continue Button */}
              {numeroIntegrantes && contador >= numeroIntegrantes && (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                >
                  <Button
                    onClick={handleContinuar}
                    className="w-full h-16 text-xl bg-white hover:bg-white/90 text-[#093c92] rounded-full shadow-xl"
                  >
                    ¡Hielo roto! Continuar al juego
                    <ArrowRight className="w-7 h-7 ml-2" />
                  </Button>
                </motion.div>
              )}

              {/* Progress hint */}
              {numeroIntegrantes && contador > 0 && contador < numeroIntegrantes && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-white/70 text-center text-lg"
                >
                  💡 Faltan {numeroIntegrantes - contador} integrante{numeroIntegrantes - contador !== 1 ? 's' : ''} por participar
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
