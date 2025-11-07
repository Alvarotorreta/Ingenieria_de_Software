import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Award,
  Coins,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Users,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GroupBadge } from '@/components/GroupBadge';
import { Confetti } from '@/components/Confetti';
import api from '@/services/api';
import { toast } from 'sonner';

// Función para corregir problemas de encoding de tildes y caracteres especiales
const fixEncoding = (text: string | null | undefined): string => {
  if (!text) return '';
  return text
    .replace(/EmpatÃa/g, 'Empatía')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã/g, 'í')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã'/g, 'í')
    .replace(/Ã"/g, 'í')
    .replace(/Ã¿/g, 'ÿ')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã"/g, 'Í')
    .replace(/Ã"/g, 'Ó')
    .replace(/Ãš/g, 'Ú')
    .replace(/Ã'/g, 'Á')
    .replace(/Ã±/g, 'Ñ');
};

interface TeamResult {
  team_id: number;
  team_name: string;
  team_color: string;
  tokens_stage: number;
  tokens_total: number;
  activities_progress: Array<{
    activity_name: string;
    status: string;
  }>;
}

interface StageResults {
  stage_number: number;
  stage_name: string;
  teams_results: TeamResult[];
}

interface GameSession {
  id: number;
  room_code: string;
  status: string;
  current_stage_number?: number;
}

export function ProfesorResultadosEtapa1() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [results, setResults] = useState<StageResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stageId = searchParams.get('stage_id');

  useEffect(() => {
    if (sessionId) {
      loadResults();

      // Auto-refresh cada 5 segundos
      intervalRef.current = setInterval(() => {
        loadResults();
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [sessionId, stageId]);

  const loadResults = async () => {
    if (!sessionId) return;

    try {
      // Obtener información de la sesión
      const sessionResponse = await api.get(`/sessions/game-sessions/${sessionId}/`);
      const sessionData: GameSession = sessionResponse.data;
      setGameSession(sessionData);

      // Obtener resultados de la etapa
      let resultsUrl = `/sessions/game-sessions/${sessionId}/stage_results/`;
      if (stageId) {
        resultsUrl += `?stage_id=${stageId}`;
      }

      const resultsResponse = await api.get(resultsUrl);
      const resultsData: StageResults = resultsResponse.data;
      setResults(resultsData);

      // Iniciar timer si hay actividad actual
      if (sessionData.current_activity) {
        startTimer(sessionData.current_activity, parseInt(sessionId));
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading results:', error);
      if (error.response?.status === 401) {
        navigate('/profesor/login');
      } else {
        toast.error('Error al cargar los resultados');
      }
      setLoading(false);
    }
  };

  const startTimer = async (activityId: number, gameSessionId: number) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    try {
      const timerResponse = await api.get(`/sessions/game-sessions/${gameSessionId}/activity_timer/`);
      const timerData = timerResponse.data;

      if (timerData.error || !timerData.timer_duration) {
        return;
      }

      const timerDuration = timerData.timer_duration;
      const startTime = timerData.started_at
        ? new Date(timerData.started_at).getTime()
        : new Date(timerData.current_time).getTime();

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
        }
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const handleNextStage = async () => {
    if (!sessionId || !results) return;

    // Si estamos en etapa 4, ir directamente a reflexión
    if (results.stage_number === 4) {
      setAdvancing(true);
      try {
        // Marcar que el profesor está en reflexión
        await api.post(`/sessions/game-sessions/${sessionId}/start_reflection/`);
        toast.success('Redirigiendo a reflexión...');
        navigate(`/profesor/reflexion/${sessionId}`);
      } catch (error: any) {
        console.error('Error iniciando reflexión:', error);
        toast.error('Error al iniciar reflexión. Redirigiendo de todas formas...');
        navigate(`/profesor/reflexion/${sessionId}`);
      } finally {
        setAdvancing(false);
      }
      return;
    }

    if (!confirm('¿Avanzar a la siguiente etapa? Esto iniciará la siguiente etapa del juego.')) {
      return;
    }

    setAdvancing(true);
    try {
      const response = await api.post(`/sessions/game-sessions/${sessionId}/next_stage/`);
      const data = response.data;

      toast.success(`¡Avanzando a ${data.message}!`, { duration: 2000 });
      setTimeout(() => {
        const nextStage = data.next_stage_number || 2;
        if (nextStage === 2) {
          window.location.replace(`/profesor/etapa2/seleccionar-tema/${sessionId}/`);
        } else if (nextStage === 3) {
          window.location.replace(`/profesor/etapa3/prototipo/${sessionId}/`);
        } else if (nextStage === 4) {
          window.location.replace(`/profesor/etapa4/formulario-pitch/${sessionId}/`);
        } else {
          window.location.replace(`/profesor/etapa1/personalizacion/${sessionId}/`);
        }
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al avanzar a la siguiente etapa');
    } finally {
      setAdvancing(false);
    }
  };

  const handleFinalizeSession = async () => {
    if (!sessionId) return;

    if (!confirm('¿Estás seguro de que deseas finalizar esta sesión? Se desconectarán todas las tablets.')) {
      return;
    }

    try {
      await api.post(`/sessions/game-sessions/${sessionId}/end/`);
      toast.success('Sesión finalizada correctamente');
      setTimeout(() => {
        navigate('/profesor/panel');
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al finalizar la sesión');
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

  const getStageIcon = (stageNumber: number) => {
    switch (stageNumber) {
      case 1:
        return '👥'; // Trabajo en Equipo
      case 2:
        return '💡'; // Empatía
      case 3:
        return '🧱'; // Creatividad
      case 4:
        return '📢'; // Comunicación
      default:
        return '🏆';
    }
  };

  const getStageGradient = (stageNumber: number) => {
    switch (stageNumber) {
      case 1:
        return 'from-blue-400 to-cyan-500';
      case 2:
        return 'from-purple-400 to-pink-500';
      case 3:
        return 'from-orange-400 to-red-500';
      case 4:
        return 'from-green-400 to-teal-500';
      default:
        return 'from-yellow-400 to-orange-500';
    }
  };

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 sm:w-7 sm:h-7 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 sm:w-7 sm:h-7 text-orange-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!gameSession || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error al cargar los resultados.</p>
          <Button onClick={() => navigate('/profesor/panel')}>Volver al Panel</Button>
        </div>
      </div>
    );
  }

  // Ordenar equipos por tokens totales (mayor a menor)
  const teamsOrdered = [...results.teams_results].sort((a, b) => b.tokens_total - a.tokens_total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
      <Confetti active={!!results} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#093c92] mb-2 flex items-center gap-2">
              <Trophy className="w-6 h-6 sm:w-7 sm:h-7" />
              Resultados de la Etapa
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Código de sala: <span className="font-semibold">{gameSession.room_code}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleFinalizeSession}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              Finalizar Sala
            </Button>
            <Button onClick={() => navigate('/profesor/panel')} variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Panel</span>
              <span className="sm:hidden">Volver</span>
            </Button>
          </div>
        </motion.div>

        {/* Información de la Etapa */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-4 sm:mb-6 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="inline-block mb-4 sm:mb-6"
          >
            <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${getStageGradient(results.stage_number)} rounded-full flex items-center justify-center shadow-2xl`}>
              <span className="text-4xl sm:text-5xl">{getStageIcon(results.stage_number)}</span>
            </div>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#093c92] mb-2">
            Etapa {results.stage_number}: {fixEncoding(results.stage_name) || `Etapa ${results.stage_number}`}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-4">
            Resultados finales de la etapa
          </p>

          {/* Temporizador */}
          {timerRemaining !== '--:--' && (
            <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 px-4 py-2 rounded-xl font-semibold text-sm sm:text-base inline-flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> Tiempo restante: {timerRemaining}
            </div>
          )}
        </motion.div>

        {/* Estadísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-[#093c92] mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-[#093c92]">{teamsOrdered.length}</p>
            <p className="text-sm sm:text-base text-gray-600">Equipos Totales</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <Coins className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600 mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
              {teamsOrdered.reduce((sum, team) => sum + team.tokens_stage, 0)}
            </p>
            <p className="text-sm sm:text-base text-gray-600">Tokens en esta Etapa</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              {teamsOrdered.reduce((sum, team) => sum + team.tokens_total, 0)}
            </p>
            <p className="text-sm sm:text-base text-gray-600">Tokens Totales</p>
          </div>
        </motion.div>

        {/* Clasificación de Equipos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4 sm:mb-6 text-center">
            <Users className="inline-block w-6 h-6 mr-2" /> Clasificación de Equipos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {teamsOrdered.map((teamResult, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              const rankMedal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}°`;

              return (
                <motion.div
                  key={teamResult.team_id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`p-4 sm:p-6 rounded-xl shadow-md border-l-4 ${
                    isTopThree
                      ? rank === 1
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-xl scale-105'
                        : rank === 2
                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 shadow-lg'
                        : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 shadow-lg'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                  style={{
                    borderLeftColor: isTopThree
                      ? rank === 1
                        ? '#fbbf24'
                        : rank === 2
                        ? '#c0c0c0'
                        : '#cd7f32'
                      : getTeamColorHex(teamResult.team_color),
                  }}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-md"
                        style={{ backgroundColor: getTeamColorHex(teamResult.team_color) }}
                      >
                        {teamResult.team_color.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-[#093c92]">
                          {fixEncoding(teamResult.team_name)}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {getMedalIcon(index)}
                      <div className="text-2xl sm:text-3xl font-bold text-gray-600">
                        {rankMedal}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Tokens en esta etapa</span>
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                        <span className="text-sm sm:text-base font-bold text-[#093c92]">
                          +{teamResult.tokens_stage}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">Tokens totales</span>
                      <div className="flex items-center gap-1">
                        <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                        <span className="text-sm sm:text-base font-bold text-gray-800">
                          {teamResult.tokens_total}
                        </span>
                      </div>
                    </div>
                  </div>

                  {teamResult.activities_progress && teamResult.activities_progress.length > 0 && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                        Actividades completadas:
                      </p>
                      <div className="space-y-1 sm:space-y-2">
                        {teamResult.activities_progress.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className="flex items-center justify-between text-xs sm:text-sm"
                          >
                            <span className="text-gray-600 truncate flex-1">{fixEncoding(activity.activity_name)}</span>
                            <Badge
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${
                                activity.status === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {activity.status === 'completed' ? (
                                <CheckCircle2 className="w-3 h-3 inline mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 inline mr-1" />
                              )}
                              {activity.status === 'completed' ? 'Completada' : 'Pendiente'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Botón Siguiente Etapa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={handleNextStage}
            disabled={advancing}
            className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#f757ac] to-pink-600 hover:from-[#e6498a] hover:to-[#d13a7a] text-white rounded-full shadow-2xl"
          >
            {advancing ? (
              <>
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                Avanzando...
              </>
            ) : (
              <>
                {results.stage_number === 4 ? (
                  '🧠 Ir a Reflexión'
                ) : (
                  `➡️ Avanzar a Etapa ${results.stage_number + 1}`
                )}
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
