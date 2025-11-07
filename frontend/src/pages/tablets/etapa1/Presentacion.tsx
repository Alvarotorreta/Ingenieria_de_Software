import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, Loader2, CheckCircle2, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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
      const statusResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/tablet-connections/status/?connection_id=${connId}`
      );

      if (!statusResponse.ok) {
        if (statusResponse.status === 404) {
          toast.error('Conexión no encontrada. Por favor reconecta.');
          setTimeout(() => {
            navigate('/tablet/join');
          }, 3000);
        }
        return;
      }

      const statusData = await statusResponse.json();
      setTeam(statusData.team);
      setGameSessionId(statusData.game_session.id);

      // Verificar estado del juego
      const gameResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/game-sessions/${statusData.game_session.id}/`
      );
      
      if (!gameResponse.ok) return;

      const gameData = await gameResponse.json();

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
        const stagesResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/session-stages/?game_session=${statusData.game_session.id}`
        );
        if (stagesResponse.ok) {
          const stagesData = await stagesResponse.json();
          const stages = Array.isArray(stagesData.results) ? stagesData.results : (Array.isArray(stagesData) ? stagesData : []);
          if (stages.length > 0) {
            setCurrentSessionStageId(stages[0].id);
          }
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-activity-progress/?team=${teamId}&activity=${activityId}&session_stage=${sessionStageId}`
      );

      if (response.ok) {
        const data = await response.json();
        const results = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
        
        if (results.length > 0 && results[0].status === 'completed') {
          setCompleted(true);
        }
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
      const timerResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/game-sessions/${gameSessionId}/activity_timer/`
      );

      if (!timerResponse.ok) return;

      const timerData = await timerResponse.json();
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
        if (!timeExpiredRef.current) {
          timeExpiredRef.current = true;
          toast.error('⏱️ ¡Tiempo agotado!', {
            duration: 5000,
          });
        }
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
          
          if (!timeExpiredRef.current) {
            timeExpiredRef.current = true;
            toast.error('⏱️ ¡Tiempo agotado!', {
              duration: 5000,
            });
          }
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-activity-progress/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            team: team.id,
            activity: currentActivityId,
            session_stage: currentSessionStageId,
            status: 'completed',
            response_data: {
              type: 'presentation',
              completed: true,
            },
          }),
        }
      );

      if (response.ok || response.status === 201) {
        toast.success('✓ Presentación completada');
        setCompleted(true);
        
        // Recargar estado después de un pequeño delay
        setTimeout(() => {
          loadGameState(connectionId);
        }, 500);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.detail || 'Error al marcar presentación como completada');
      }
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
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg"
                style={{ backgroundColor: getTeamColorHex(team.color) }}
              >
                {team.color.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">{team.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">Equipo {team.color}</p>
              </div>
            </div>
            <div className="bg-[#093c92] text-white px-4 py-2 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2">
              🪙 {team.tokens_total || 0} Tokens
            </div>
          </div>
        </div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-2">
              2. Presentación - Conócenos
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Tómate un tiempo para presentarte con tu equipo
            </p>
          </div>

          {/* Temporizador */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-700" />
              <p className="text-yellow-800 font-semibold text-base sm:text-lg">
                ⏱️ Tiempo restante: <span className="font-bold">{timerRemaining}</span>
              </p>
            </div>
          </div>

          {/* Explicación */}
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 sm:p-6 mb-6">
            <p className="text-blue-800 font-semibold text-base sm:text-lg mb-3">
              👋 ¡Es momento de conocerse!
            </p>
            <p className="text-gray-700 text-sm sm:text-base mb-3">
              Como no se conocen aún, tómense un tiempo para presentarse. Cada miembro del equipo debe compartir:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700 ml-2">
              <li>Su nombre</li>
              <li>Algo sobre ellos (intereses, hobbies, etc.)</li>
              <li>Qué esperan de esta experiencia</li>
            </ul>
            <p className="text-gray-600 text-sm sm:text-base italic mt-4">
              Cuando todos hayan terminado de presentarse, presiona el botón "Listo" para continuar.
            </p>
          </div>

          <Button
            onClick={handlePresentationDone}
            disabled={completed || submitting}
            className="w-full h-12 sm:h-14 bg-[#093c92] hover:bg-[#072e73] text-white text-base sm:text-lg font-semibold"
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
  );
}


