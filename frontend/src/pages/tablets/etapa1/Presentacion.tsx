import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, Loader2, CheckCircle2, Gamepad2, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EtapaIntroModal } from '@/components/EtapaIntroModal';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import { toast } from 'sonner';
import { tabletConnectionsAPI, sessionsAPI, teamPersonalizationsAPI, teamActivityProgressAPI } from '@/services';

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total?: number;
}

export function TabletPresentacion() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);
  const [currentSessionStageId, setCurrentSessionStageId] = useState<number | null>(null);
  const [showEtapaIntro, setShowEtapaIntro] = useState(false);
  const [personalization, setPersonalization] = useState<{ team_name?: string } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeExpiredRef = useRef<boolean>(false);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    loadGameState(connId);

    // Polling cada 5 segundos
    intervalRef.current = setInterval(() => {
      loadGameState(connId);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [searchParams, navigate]);

  const loadGameState = async (connId: string) => {
    try {
      let statusData;
      try {
        statusData = await tabletConnectionsAPI.getStatus(connId);
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error('Conexión no encontrada. Por favor reconecta.');
          setTimeout(() => {
            navigate('/tablet/join');
          }, 3000);
        }
        return;
      }
      
      setTeam(statusData.team);
      setGameSessionId(statusData.game_session.id);

      // Cargar personalización del equipo
      try {
        const persList = await teamPersonalizationsAPI.list({ team: statusData.team.id });
        const persResults = Array.isArray(persList) ? persList : [persList];
        if (persResults.length > 0 && persResults[0].team_name) {
          setPersonalization({ team_name: persResults[0].team_name });
        } else {
          setPersonalization(null);
        }
      } catch (error) {
        console.error('Error loading personalization:', error);
        setPersonalization(null);
      }

      // Verificar estado del juego
      const gameData = await sessionsAPI.getById(statusData.game_session.id);
      const sessionId = statusData.game_session.id;

      // Verificar si debemos mostrar la intro de la etapa
      if (gameData.current_stage_number === 1) {
        const introKey = `tablet_etapa_intro_${sessionId}_1`;
        const hasSeenIntro = localStorage.getItem(introKey);
        if (!hasSeenIntro) {
          setShowEtapaIntro(true);
        }
      }

      // Verificar si el juego ha finalizado o está en lobby
      if (gameData.status === 'finished' || gameData.status === 'completed') {
        toast.info('El juego ha finalizado. Redirigiendo...');
        setTimeout(() => {
          navigate('/tablet/join');
        }, 2000);
        return;
      }

      if (gameData.status === 'lobby') {
        navigate(`/tablet/lobby?connection_id=${connId}`);
        return;
      }

      // Verificar actividad actual
      const currentActivityName = gameData.current_activity_name?.toLowerCase() || '';
      const currentStageNumber = gameData.current_stage_number;

      if (currentStageNumber !== 1 || !currentActivityName.includes('presentacion') && !currentActivityName.includes('presentación')) {
        // Redirigir según la actividad actual
        if (currentStageNumber === 1 && currentActivityName.includes('personaliz')) {
          window.location.href = `/tablet/etapa1/personalizacion/?connection_id=${connId}`;
        } else if (currentStageNumber === 1 && !currentActivityName) {
          window.location.href = `/tablet/etapa1/resultados/?connection_id=${connId}`;
        } else {
          window.location.href = `/tablet/lobby?connection_id=${connId}`;
        }
        return;
      }

      setCurrentActivityId(gameData.current_activity);

      // Obtener session_stage
      if (!currentSessionStageId) {
        try {
          const stagesData = await sessionsAPI.getSessionStages(statusData.game_session.id);
          const stages = Array.isArray(stagesData) ? stagesData : [stagesData];
          if (stages.length > 0) {
            setCurrentSessionStageId(stages[0].id);
          }
        } catch (error) {
          console.error('Error loading session stages:', error);
        }
      }

      // Verificar si ya completaron la presentación
      if (currentActivityId && currentSessionStageId) {
        await checkExistingProgress(statusData.team.id, currentActivityId, currentSessionStageId);
      }

      // Iniciar temporizador
      if (gameData.current_activity && !timerIntervalRef.current) {
        startTimer(gameData.current_activity, statusData.game_session.id);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading game state:', error);
      toast.error('Error de conexión: ' + (error.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  const checkExistingProgress = async (teamId: number, activityId: number, sessionStageId: number) => {
    try {
      const progressList = await teamActivityProgressAPI.list({
        team: teamId,
        activity: activityId,
        session_stage: sessionStageId
      });
      const results = Array.isArray(progressList) ? progressList : [progressList];
      
      if (results.length > 0 && results[0].status === 'completed') {
        setCompleted(true);
      }
    } catch (error) {
      console.error('Error checking presentation progress:', error);
    }
  };

  const startTimer = async (activityId: number, gameSessionId: number) => {
    if (timerIntervalRef.current) {
      return;
    }

    try {
      const timerData = await sessionsAPI.getActivityTimer(gameSessionId);
      if (timerData.error || !timerData.timer_duration) return;

      const timerDuration = timerData.timer_duration;
      const startTime = timerData.started_at 
        ? new Date(timerData.started_at).getTime()
        : new Date(timerData.current_time).getTime();

      // Verificar si el tiempo ya expiró
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, timerDuration - elapsed);

      if (remaining <= 0) {
        setTimerRemaining('00:00');
        timeExpiredRef.current = true;
        return;
      }

      const updateTimer = () => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = Math.max(0, timerDuration - elapsed);

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        setTimerRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

        if (remaining <= 0) {
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          setTimerRemaining('00:00');
          timeExpiredRef.current = true;
        }
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const handlePresentationDone = async () => {
    if (!team || !currentActivityId || !currentSessionStageId || !connectionId) {
      toast.error('Faltan datos necesarios. Por favor, recarga la página.');
      return;
    }

    setSubmitting(true);

    try {
      await teamActivityProgressAPI.create({
        team: team.id,
        activity: currentActivityId,
        session_stage: currentSessionStageId,
        status: 'completed',
        response_data: {
          type: 'presentation',
          completed: true,
        },
      });

      toast.success('✓ Presentación completada');
      setCompleted(true);
      
      // Recargar estado después de un pequeño delay
      setTimeout(() => {
        loadGameState(connectionId);
      }, 500);
    } catch (error: any) {
      toast.error('Error: ' + (error.message || 'Error desconocido'));
    } finally {
      setSubmitting(false);
    }
  };

  const getTeamColorHex = (color: string) => {
    const colorMap: Record<string, string> = {
      Verde: '#28a745',
      Azul: '#007bff',
      Rojo: '#dc3545',
      Amarillo: '#ffc107',
      Naranja: '#fd7e14',
      Morado: '#6f42c1',
      Rosa: '#e83e8c',
      Cian: '#17a2b8',
      Gris: '#6c757d',
      Marrón: '#795548',
    };
    return colorMap[color] || '#667eea';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error al cargar información del equipo</p>
          <Button onClick={() => navigate('/tablet/join')}>Volver a Conectar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
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
        
        {/* Efectos de partículas adicionales */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              }}
              animate={{
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-3 sm:p-4">
        <div className="max-w-6xl mx-auto relative z-20">
        {/* Header Mejorado */}
        <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0"
                style={{ backgroundColor: getTeamColorHex(team.color) }}
              >
                {team.color.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                  {personalization?.team_name 
                    ? `Equipo ${personalization.team_name}` 
                    : team.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  Equipo {team.color}
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 flex-shrink-0 shadow-sm">
              <Coins className="w-4 h-4" />
              <span>{team.tokens_total || 0}</span>
            </div>
          </div>
        </div>

        {/* Formulario Mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-4 sm:p-6"
        >
          {/* Título y Descripción */}
          <div className="mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-2">
              2. Presentación - Conócenos
            </h2>
            <p className="text-gray-600 text-sm">
              Tómate un tiempo para presentarte con tu equipo
            </p>
          </div>

          {/* Temporizador Mejorado */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mb-4 sm:mb-5">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-yellow-700" />
              <span className="text-yellow-800 font-semibold text-sm sm:text-base">
                Tiempo restante: <span className="font-bold">{timerRemaining}</span>
              </span>
            </div>
          </div>

          {/* Explicación */}
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 sm:p-5 mb-4 sm:mb-5">
            <p className="text-blue-800 font-semibold text-sm sm:text-base mb-2">
              👋 ¡Es momento de conocerse!
            </p>
            <p className="text-gray-700 text-xs sm:text-sm mb-2">
              Como no se conocen aún, tómense un tiempo para presentarse. Cada miembro del equipo debe compartir:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700 ml-2">
              <li>Su nombre</li>
              <li>Algo sobre ellos (intereses, hobbies, etc.)</li>
              <li>Qué esperan de esta experiencia</li>
            </ul>
            <p className="text-gray-600 text-xs sm:text-sm italic mt-3">
              Cuando todos hayan terminado de presentarse, presiona el botón "Listo" para continuar.
            </p>
          </div>

          {/* Botón Entregar Mejorado */}
          <Button
            onClick={handlePresentationDone}
            disabled={completed || submitting}
            className="w-full h-12 sm:h-14 bg-[#093c92] hover:bg-[#072e73] text-white text-sm sm:text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              </>
            ) : completed ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                ✓ Completado
              </>
            ) : (
              '✓ Listo - Hemos terminado de presentarnos'
            )}
          </Button>
        </motion.div>
        </div>
      </div>

      {/* Modal de Introducción de Etapa */}
      <EtapaIntroModal
        etapaNumero={1}
        isOpen={showEtapaIntro}
        onClose={() => {
          setShowEtapaIntro(false);
          if (gameSessionId) {
            localStorage.setItem(`tablet_etapa_intro_${gameSessionId}_1`, 'true');
          }
        }}
      />

      {/* Música de fondo */}
      <BackgroundMusic storageKey="tablet_backgroundMusicEnabled" />
    </div>
  );
}


