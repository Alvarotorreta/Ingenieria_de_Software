import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Clock, Loader2, CheckCircle2, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total?: number;
}

interface WordData {
  word: string;
  anagram: string;
}

export function TabletMinijuego() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameWords, setGameWords] = useState<WordData[]>([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);
  const [currentSessionStageId, setCurrentSessionStageId] = useState<number | null>(null);
  const [completedItems, setCompletedItems] = useState<Array<{ word: string; answer: string }>>([]);
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

      if (currentStageNumber !== 1 || (!currentActivityName.includes('presentacion') && !currentActivityName.includes('presentación'))) {
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

      // Cargar actividad del minijuego
      if (gameData.current_activity && gameWords.length === 0) {
        await loadMinijuegoActivity(gameData.current_activity);
      }

      // Verificar progreso existente
      if (gameData.current_activity && currentSessionStageId && statusData.team.id) {
        await checkExistingProgress(statusData.team.id, gameData.current_activity, currentSessionStageId);
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

  const loadMinijuegoActivity = async (activityId: number) => {
    try {
      const activityResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/challenges/activities/${activityId}/`
      );
      
      if (!activityResponse.ok) {
        toast.error('Error al cargar la actividad');
        return;
      }
      
      const activityData = await activityResponse.json();
      const config = activityData.config_data || {};
      const words = config.words || [];
      
      setGameWords(words);
    } catch (error: any) {
      console.error('Error loading minijuego activity:', error);
      toast.error('Error al cargar la actividad: ' + (error.message || 'Error desconocido'));
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
        
        if (results.length > 0) {
          const progress = results[0];
          const responseData = progress.response_data || {};
          const answers = responseData.answers || [];
          
          // Restaurar progreso
          setCompletedItems(answers);
          
          // Si está completado, mostrar pantalla de completado
          if (progress.status === 'completed') {
            setCurrentGameIndex(gameWords.length);
          } else {
            // Continuar desde donde se quedó
            setCurrentGameIndex(answers.length);
          }
        }
      }
    } catch (error) {
      console.error('Error checking game progress:', error);
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

  const verifyAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Por favor escribe una respuesta');
      return;
    }

    if (!team || !currentActivityId || !currentSessionStageId) {
      toast.error('Faltan datos necesarios');
      return;
    }

    const currentWord = gameWords[currentGameIndex];
    if (!currentWord) return;

    const userAnswerLower = userAnswer.trim().toLowerCase();
    const correctWordLower = currentWord.word.toLowerCase();
    const isAnswerCorrect = userAnswerLower === correctWordLower;

    setIsCorrect(isAnswerCorrect);
    setSubmitting(true);

    if (isAnswerCorrect) {
      // Guardar respuesta
      const newCompletedItem = { word: currentWord.word, answer: userAnswerLower };
      setCompletedItems([...completedItems, newCompletedItem]);

      // Enviar respuesta
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-activity-progress/submit_anagram/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              team: team.id,
              activity: currentActivityId,
              session_stage: currentSessionStageId,
              answers: [newCompletedItem],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const tokensEarned = data.tokens_earned || 0;
          
          if (tokensEarned > 0) {
            toast.success(`¡Correcto! +${tokensEarned} tokens`);
            // Recargar estado del equipo para actualizar tokens
            if (connectionId) {
              loadGameState(connectionId);
            }
          }

          // Esperar un momento y mostrar siguiente palabra
          setTimeout(() => {
            setCurrentGameIndex(currentGameIndex + 1);
            setUserAnswer('');
            setIsCorrect(null);
            setSubmitting(false);
          }, 1500);
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error('Error: ' + (errorData.error || 'Error desconocido'));
          setSubmitting(false);
        }
      } catch (error: any) {
        toast.error('Error de conexión: ' + (error.message || 'Error desconocido'));
        setSubmitting(false);
      }
    } else {
      // Respuesta incorrecta
      setTimeout(() => {
        setUserAnswer('');
        setIsCorrect(null);
        setSubmitting(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting) {
      verifyAnswer();
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

  const currentWord = gameWords[currentGameIndex];
  const allCompleted = currentGameIndex >= gameWords.length;

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
              <Award className="w-4 h-4" /> {team.tokens_total || 0} Tokens
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
              2. Presentación - Minijuego de Anagramas
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Adivina las palabras desordenadas. Cada palabra correcta vale 5 tokens
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

          {/* Instrucciones */}
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 sm:p-6 mb-6">
            <p className="text-blue-800 font-semibold text-sm sm:text-base">
              Las palabras están desordenadas. Reordena las letras para formar la palabra correcta. Se enviará automáticamente cuando escribas la respuesta correcta.
            </p>
          </div>

          {/* Progreso */}
          {!allCompleted && (
            <div className="text-center mb-6 text-gray-700 font-semibold text-base sm:text-lg">
              Palabra <span className="text-[#093c92]">{currentGameIndex + 1}</span> de{' '}
              <span className="text-[#093c92]">{gameWords.length}</span>
            </div>
          )}

          {/* Juego */}
          {allCompleted ? (
            <div className="bg-green-50 border-2 border-green-400 rounded-xl p-8 sm:p-12 text-center">
              <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 mx-auto mb-4" />
              <p className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">¡Felicidades!</p>
              <p className="text-green-800 text-base sm:text-lg">Has completado todas las palabras</p>
            </div>
          ) : currentWord ? (
            <div className="space-y-6">
              <div className="text-center">
                <label className="block text-gray-700 font-semibold text-base sm:text-lg mb-4">
                  Anagrama:
                </label>
                <div className="text-3xl sm:text-4xl font-bold text-[#093c92] tracking-wider mb-6">
                  {currentWord.anagram.toUpperCase()}
                </div>
              </div>

              <div>
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe la palabra correcta aquí..."
                  className={`h-14 sm:h-16 text-center text-lg sm:text-xl ${
                    isCorrect === true
                      ? 'border-green-500 bg-green-50'
                      : isCorrect === false
                      ? 'border-red-500 bg-red-50'
                      : ''
                  }`}
                  disabled={submitting || isCorrect === true}
                  autoComplete="off"
                />
                {isCorrect === true && (
                  <p className="text-center text-green-600 font-semibold text-lg sm:text-xl mt-4">
                    ✅ ¡Correcto!
                  </p>
                )}
                {isCorrect === false && (
                  <p className="text-center text-red-600 font-semibold text-lg sm:text-xl mt-4">
                    ❌ Incorrecto. Intenta de nuevo.
                  </p>
                )}
              </div>

              <p className="text-center text-gray-600 text-sm sm:text-base">
                ⭐ Cada palabra correcta = 5 tokens
              </p>

              <Button
                onClick={verifyAnswer}
                disabled={submitting || isCorrect === true || !userAnswer.trim()}
                className="w-full h-12 sm:h-14 bg-[#093c92] hover:bg-[#072e73] text-white text-base sm:text-lg font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  '✓ Verificar Respuesta'
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Cargando palabras...</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}


