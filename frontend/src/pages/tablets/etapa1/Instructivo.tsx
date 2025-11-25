import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, BookOpen, Users, Lightbulb, Target, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sessionsAPI, tabletConnectionsAPI } from '@/services';

export function TabletInstructivo() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    loadGameState(connId);

    // Polling cada 2 segundos para detectar rápidamente cuando el profesor inicia la Etapa 1
    intervalRef.current = setInterval(() => {
      loadGameState(connId);
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [searchParams, navigate]);

  const loadGameState = async (connId: string) => {
    try {
      // Obtener información de la conexión
      const statusData = await tabletConnectionsAPI.getStatus(connId);
      
      if (!statusData.game_session || !statusData.game_session.id) {
        setLoading(false);
        return;
      }

      const gameSessionId = statusData.game_session.id;

      // Obtener estado del juego
      const gameData = await sessionsAPI.getById(gameSessionId);
      
      // Si la sesión finaliza, redirigir al join
      if (gameData.status === 'finished' || gameData.status === 'completed') {
        setTimeout(() => navigate('/tablet/join'), 2000);
        return;
      }

      // Si hay una actividad establecida (Personalización), redirigir a pantalla de carga primero
      if (gameData.current_activity_name && gameData.current_stage_number) {
        console.log('🔄 Profesor inició Etapa 1, redirigiendo desde Instructivo:', gameData.current_activity_name);
        const normalizedName = gameData.current_activity_name.toLowerCase();
        if (normalizedName.includes('personaliz')) {
          console.log('✅ Redirigiendo a pantalla de carga antes de Personalización');
          // Pasar la siguiente ruta como parámetro para que la pantalla de carga sepa a dónde ir
          window.location.href = `/tablet/loading?redirect=/tablet/etapa1/personalizacion&connection_id=${connId}`;
          return;
        } else if (normalizedName.includes('presentaci')) {
          console.log('✅ Redirigiendo a Presentación');
          window.location.href = `/tablet/etapa1/presentacion?connection_id=${connId}`;
          return;
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading game state:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const instructivoItems = [
    {
      icon: Users,
      title: 'Trabajo en Equipo',
      description: 'Colabora con tu equipo para resolver desafíos juntos',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      icon: Lightbulb,
      title: 'Creatividad e Innovación',
      description: 'Genera ideas originales y soluciones innovadoras',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Target,
      title: '4 Etapas de Aprendizaje',
      description: 'Completa todas las etapas para llegar al objetivo final',
      color: 'from-purple-400 to-pink-500',
    },
    {
      icon: Award,
      title: 'Divertido y Desafiante',
      description: 'Aprende mientras te diviertes enfrentando retos reales',
      color: 'from-green-400 to-emerald-500',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Fondo animado */}
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

      <div className="relative z-10 h-screen flex flex-col items-center justify-center p-3 sm:p-4 pt-12 sm:pt-16 md:pt-20 lg:pt-24 overflow-y-auto">
        {/* Logo UDD */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30">
          <img 
            src="/images/UDD-negro.png" 
            alt="Logo UDD" 
            className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain opacity-90 drop-shadow-lg"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl flex flex-col items-center space-y-4 sm:space-y-6"
        >
          {/* Título principal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-4 sm:mb-6"
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#093c92] to-[#f757ac] rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                Bienvenido a Misión Emprende
              </h1>
            </div>
            <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium">
              Instrucciones del Juego
            </p>
          </motion.div>

          {/* Contenedor de instrucciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full"
          >
            {/* Items del instructivo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {instructivoItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-5 border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[#093c92] font-bold text-base sm:text-lg mb-1 sm:mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-700 text-sm sm:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Sección de objetivos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-[#093c92]/10 to-[#f757ac]/10 rounded-xl p-4 sm:p-6 border border-[#093c92]/20"
            >
              <h3 className="text-[#093c92] font-bold text-lg sm:text-xl mb-3 sm:mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                Objetivos del Juego
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  'Desarrollar habilidades de trabajo en equipo y comunicación',
                  'Fomentar la creatividad y el pensamiento innovador',
                  'Aprender a identificar problemas y generar soluciones',
                  'Presentar ideas de manera efectiva y persuasiva',
                ].map((objetivo, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="flex items-start gap-2 sm:gap-3 text-gray-700 text-sm sm:text-base"
                  >
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{objetivo}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Mensaje final */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-6 sm:mt-8 text-center"
            >
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#093c92] to-[#f757ac] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg">
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                <p className="text-sm sm:text-base font-semibold">
                  ¡Espera a que el profesor inicie la primera etapa!
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

