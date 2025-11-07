import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Trophy, Zap, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import GroupBadge from '../../components/GroupBadge';
import Confetti from '../../components/Confetti';
import { toast } from 'sonner@2.0.3';

const grupos = [
  { nombre: 'Grupo Rojo', color: '#ff4757' },
  { nombre: 'Grupo Azul', color: '#3742fa' },
  { nombre: 'Grupo Verde', color: '#2ed573' },
  { nombre: 'Grupo Amarillo', color: '#ffa502' },
];

interface Pregunta {
  pregunta: string;
  opciones: { texto: string; correcta: boolean; emoji?: string }[];
  tiempoSegundos: number;
}

const preguntas: Pregunta[] = [
  {
    pregunta: '¿Qué es un MVP en emprendimiento?',
    opciones: [
      { texto: 'Producto Muy Popular', correcta: false },
      { texto: 'Mínimo Producto Viable', correcta: true },
      { texto: 'Mayor Valor del Producto', correcta: false },
      { texto: 'Mercado Virtual Preferido', correcta: false },
    ],
    tiempoSegundos: 15,
  },
  {
    pregunta: '¿Cuál de estos es un ejemplo de innovación?',
    opciones: [
      { texto: 'Crear una app que entrega café a domicilio', correcta: true },
      { texto: 'Repetir el mismo producto sin cambios', correcta: false },
      { texto: 'Copiar una idea ya existente', correcta: false },
      { texto: 'Hacer un cartel publicitario', correcta: false },
    ],
    tiempoSegundos: 18,
  },
  {
    pregunta: '¿Qué es pivotar en un negocio?',
    opciones: [
      { texto: 'Cambiar de estrategia para mejorar', correcta: true },
      { texto: 'Abrir una nueva sucursal', correcta: false },
      { texto: 'Vender acciones de la empresa', correcta: false },
      { texto: 'Hacer publicidad', correcta: false },
    ],
    tiempoSegundos: 15,
  },
  {
    pregunta: '¿Qué hace que una idea de negocio sea escalable?',
    opciones: [
      { texto: 'Puede crecer rápidamente y llegar a muchos', correcta: true },
      { texto: 'Es muy barata', correcta: false },
      { texto: 'Solo funciona en la ciudad donde nació', correcta: false },
      { texto: 'Tiene pocos clientes', correcta: false },
    ],
    tiempoSegundos: 18,
  },
  {
    pregunta: '¿Qué es un pitch?',
    opciones: [
      { texto: 'Una presentación breve para vender tu idea', correcta: true },
      { texto: 'Un plan de marketing detallado', correcta: false },
      { texto: 'Un tipo de logo', correcta: false },
      { texto: 'Una reunión de inversionistas', correcta: false },
    ],
    tiempoSegundos: 15,
  },
  {
    pregunta: 'Si tu startup pudiera ser un superhéroe, ¿cuál sería la mejor habilidad?',
    opciones: [
      { texto: 'Teletransportar café', correcta: true, emoji: '☕' },
      { texto: 'Dormir mientras trabaja', correcta: false },
      { texto: 'Volar sin rumbo', correcta: false },
      { texto: 'Leer la mente del cliente', correcta: false },
    ],
    tiempoSegundos: 20,
  },
];

const colores = ['#FF4444', '#4488FF', '#FFD700', '#44DD44']; // Rojo, Azul, Amarillo, Verde

export default function TabletMiniQuiz() {
  const navigate = useNavigate();
  const [grupoAsignado] = useState(() => {
    return grupos[Math.floor(Math.random() * 4)];
  });

  const [preguntaActual, setPreguntaActual] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<number | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(preguntas[0].tiempoSegundos);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [inicioQuiz, setInicioQuiz] = useState(true);

  // Timer por pregunta
  useEffect(() => {
    if (juegoTerminado || mostrarResultado || inicioQuiz) return;

    const timer = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          // Tiempo agotado
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [preguntaActual, mostrarResultado, juegoTerminado, inicioQuiz]);

  const handleTimeout = () => {
    if (!mostrarResultado) {
      toast.error('⏰ ¡Se acabó el tiempo!');
      setMostrarResultado(true);
      setTimeout(siguientePregunta, 2000);
    }
  };

  const iniciarQuiz = () => {
    setInicioQuiz(false);
    setTiempoRestante(preguntas[0].tiempoSegundos);
  };

  const handleRespuesta = (indice: number) => {
    if (respuestaSeleccionada !== null || mostrarResultado) return;

    setRespuestaSeleccionada(indice);
    setMostrarResultado(true);

    const opcionSeleccionada = preguntas[preguntaActual].opciones[indice];
    
    if (opcionSeleccionada.correcta) {
      // Calcular puntos: base 1000 + bonus por velocidad (hasta 500 puntos extra)
      const porcentajeTiempo = tiempoRestante / preguntas[preguntaActual].tiempoSegundos;
      const puntosVelocidad = Math.round(500 * porcentajeTiempo);
      const puntosGanados = 1000 + puntosVelocidad;
      
      setPuntos(puntos + puntosGanados);
      setShowConfetti(true);
      toast.success(`🎉 ¡Correcto! +${puntosGanados} puntos`);
      
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      toast.error('❌ Respuesta incorrecta');
    }

    // Siguiente pregunta después de 2.5 segundos
    setTimeout(siguientePregunta, 2500);
  };

  const siguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
      setRespuestaSeleccionada(null);
      setMostrarResultado(false);
      setTiempoRestante(preguntas[preguntaActual + 1].tiempoSegundos);
    } else {
      setJuegoTerminado(true);
    }
  };

  const handleContinuar = () => {
    navigate('/tablet/espera-etapa');
  };

  // Calcular progreso del timer
  const progressPercentage = (tiempoRestante / preguntas[preguntaActual]?.tiempoSegundos) * 100;

  return (
    <div className="h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-orange-500 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Animated background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 270, 180, 90, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
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

      {/* Score - Top Right */}
      {!inicioQuiz && (
        <motion.div
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', delay: 0.3 }}
          className="absolute top-4 right-4 z-20"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20">
            <div className="text-white text-center">
              <Trophy className="w-8 h-8 text-yellow-300 mx-auto mb-1" />
              <div className="text-3xl font-mono">{puntos}</div>
              <div className="text-sm opacity-80">puntos</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Question Progress - Top Left */}
      {!inicioQuiz && !juegoTerminado && (
        <motion.div
          initial={{ scale: 0, x: -50 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ type: 'spring', delay: 0.4 }}
          className="absolute top-4 left-4 z-20"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border-2 border-white/20">
            <div className="text-white text-center">
              <div className="text-2xl">
                {preguntaActual + 1}/{preguntas.length}
              </div>
              <div className="text-sm opacity-80">pregunta</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {inicioQuiz ? (
            // Pantalla de inicio
            <motion.div
              key="inicio"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-24 h-24 text-yellow-300 mx-auto" />
                </motion.div>
                <h1 className="text-white text-6xl drop-shadow-lg">
                  Mini Quiz de Emprendimiento
                </h1>
                <p className="text-white/90 text-2xl">
                  🚀 Estilo Kahoot - ¡Rápido y divertido!
                </p>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={iniciarQuiz}
                  className="w-full h-20 text-3xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl shadow-xl"
                >
                  <Zap className="w-10 h-10 mr-3" />
                  ¡Comenzar Quiz!
                </Button>
              </motion.div>
            </motion.div>
          ) : juegoTerminado ? (
            // Pantalla de resultados
            <motion.div
              key="resultados"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-32 h-32 text-yellow-300 mx-auto" />
                </motion.div>
                <h1 className="text-white text-6xl drop-shadow-lg">
                  ¡Quiz Completado!
                </h1>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-10 shadow-2xl border-4 border-yellow-400"
              >
                <div className="text-center space-y-6">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 border-2 border-purple-300">
                    <h2 className="text-gray-600 text-2xl mb-2">Puntaje Final</h2>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.5 }}
                      className="text-7xl text-purple-900 my-4"
                    >
                      {puntos}
                    </motion.div>
                    <p className="text-gray-600 text-xl">puntos</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                      <p className="text-blue-600 text-lg">Preguntas</p>
                      <p className="text-3xl text-blue-900">{preguntas.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                      <p className="text-green-600 text-lg">Completado</p>
                      <p className="text-3xl text-green-900">✓</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border-2 border-orange-300">
                    <p className="text-orange-900 text-xl">
                      🎉 ¡Excelente trabajo en equipo!
                    </p>
                  </div>
                </div>
              </motion.div>

              <Button
                onClick={handleContinuar}
                className="w-full h-16 text-xl bg-white hover:bg-white/90 text-purple-700 rounded-full shadow-xl"
              >
                Continuar al juego
                <ArrowRight className="w-7 h-7 ml-2" />
              </Button>
            </motion.div>
          ) : (
            // Pantalla de pregunta
            <motion.div
              key={`pregunta-${preguntaActual}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="space-y-6"
            >
              {/* Timer Bar */}
              <div className="bg-white/20 backdrop-blur-md rounded-full h-6 overflow-hidden border-2 border-white/40">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                  className={`h-full ${
                    tiempoRestante > 5 ? 'bg-green-400' : 'bg-red-500'
                  } rounded-full`}
                />
              </div>

              {/* Question */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-white/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-gray-900 text-3xl flex-1 leading-tight">
                    {preguntas[preguntaActual].pregunta}
                  </h2>
                  <div className="flex items-center gap-2 bg-purple-100 rounded-xl px-4 py-2 border-2 border-purple-300">
                    <Clock className="w-6 h-6 text-purple-600" />
                    <span className="text-3xl text-purple-900 font-mono min-w-[3ch] text-center">
                      {tiempoRestante}
                    </span>
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {preguntas[preguntaActual].opciones.map((opcion, index) => {
                    const isSelected = respuestaSeleccionada === index;
                    const isCorrect = opcion.correcta;
                    const showResult = mostrarResultado;

                    let bgColor = colores[index];
                    let borderColor = 'transparent';
                    let icon = null;

                    if (showResult) {
                      if (isSelected && isCorrect) {
                        borderColor = '#00FF00';
                        icon = <CheckCircle2 className="w-8 h-8 text-green-500" />;
                      } else if (isSelected && !isCorrect) {
                        borderColor = '#FF0000';
                        icon = <XCircle className="w-8 h-8 text-red-500" />;
                      } else if (isCorrect) {
                        borderColor = '#00FF00';
                        icon = <CheckCircle2 className="w-8 h-8 text-green-500" />;
                      }
                    }

                    return (
                      <motion.button
                        key={index}
                        onClick={() => handleRespuesta(index)}
                        disabled={respuestaSeleccionada !== null}
                        whileHover={{ scale: respuestaSeleccionada === null ? 1.05 : 1 }}
                        whileTap={{ scale: respuestaSeleccionada === null ? 0.95 : 1 }}
                        className="relative h-28 rounded-2xl text-white text-xl transition-all disabled:cursor-not-allowed overflow-hidden group"
                        style={{
                          backgroundColor: bgColor,
                          border: `4px solid ${borderColor}`,
                          opacity: showResult && !isCorrect && !isSelected ? 0.5 : 1,
                        }}
                      >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="relative h-full flex items-center justify-center px-4 gap-3">
                          {icon && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              {icon}
                            </motion.div>
                          )}
                          <span className="flex-1 text-center">
                            {opcion.texto} {opcion.emoji}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
