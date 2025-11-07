import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Play,
  Award,
  ClipboardList,
  Gamepad2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { toast } from 'sonner';

interface Student {
  id: number;
  full_name: string;
}

interface Team {
  id: number;
  name: string;
  color: string;
  students_count: number;
  students?: Student[];
}

interface Personalization {
  id?: number;
  team: number;
  team_name?: string;
  team_members_know_each_other?: boolean | null;
}

interface ActivityProgress {
  id?: number;
  team: number;
  status: string;
  response_data?: {
    type?: string;
    correct_answers?: number;
    total_words?: number;
    tokens_earned?: number;
    answers?: Array<{ word: string; answer: string }>;
  };
  progress_percentage?: number;
}

interface GameSession {
  id: number;
  room_code: string;
  status: string;
  current_activity_name?: string;
  current_activity?: number;
  current_stage_number?: number;
  started_at?: string;
}

export function ProfesorPresentacion() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [personalizations, setPersonalizations] = useState<Record<number, Personalization>>({});
  const [activityProgress, setActivityProgress] = useState<Record<number, ActivityProgress>>({});
  const [loading, setLoading] = useState(true);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [advancing, setAdvancing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sessionId) {
      loadGameControl();

      // Auto-refresh cada 5 segundos
      intervalRef.current = setInterval(() => {
        loadGameControl();
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
  }, [sessionId]);

  const loadGameControl = async () => {
    if (!sessionId) return;

    try {
      // Obtener información de la sesión
      const sessionResponse = await api.get(`/sessions/game-sessions/${sessionId}/`);
      const sessionData: GameSession = sessionResponse.data;

      // Verificar que estamos en Etapa 1
      if (sessionData.current_stage_number !== 1) {
        determineAndRedirect(sessionData);
        return;
      }

      // Verificar actividad actual
      const currentActivityName = sessionData.current_activity_name?.toLowerCase() || '';
      if (!currentActivityName.includes('presentacion') && !currentActivityName.includes('presentación')) {
        // Redirigir a la actividad correcta
        if (currentActivityName.includes('personaliz')) {
          window.location.href = `/profesor/etapa1/personalizacion/${sessionId}/`;
        } else {
          window.location.href = `/profesor/lobby/${sessionId}`;
        }
        return;
      }

      setGameSession(sessionData);

      // Obtener equipos
      const teamsResponse = await api.get(`/sessions/teams/?game_session=${sessionId}`);
      const teamsData: Team[] = teamsResponse.data.results || teamsResponse.data;
      setTeams(teamsData);

      // Obtener session_stage
      const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${sessionId}`);
      const stagesData = stagesResponse.data.results || stagesResponse.data;
      const sessionStageId = stagesData.length > 0 ? stagesData[0].id : null;

      // Obtener personalizaciones y progreso de actividad para todos los equipos
      const fetchedPersonalizations: Record<number, Personalization> = {};
      const fetchedProgress: Record<number, ActivityProgress> = {};

      for (const team of teamsData) {
        // Obtener personalización
        const persResponse = await api.get(`/sessions/team-personalizations/?team=${team.id}`);
        const persResults = Array.isArray(persResponse.data.results)
          ? persResponse.data.results
          : persResponse.data;
        if (persResults.length > 0) {
          fetchedPersonalizations[team.id] = persResults[0];
        }

        // Obtener progreso de actividad
        if (sessionData.current_activity && sessionStageId) {
          const progressResponse = await api.get(
            `/sessions/team-activity-progress/?team=${team.id}&activity=${sessionData.current_activity}&session_stage=${sessionStageId}`
          );
          const progressResults = Array.isArray(progressResponse.data.results)
            ? progressResponse.data.results
            : progressResponse.data;
          if (progressResults.length > 0) {
            fetchedProgress[team.id] = progressResults[0];
          }
        }
      }

      setPersonalizations(fetchedPersonalizations);
      setActivityProgress(fetchedProgress);

      // Iniciar temporizador si hay actividad actual
      if (sessionData.current_activity && !timerIntervalRef.current) {
        startTimer(sessionData.current_activity, sessionData.id);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading game control:', error);
      if (error.response?.status === 401) {
        navigate('/profesor/login');
      } else {
        toast.error('Error al cargar la sesión');
      }
      setLoading(false);
    }
  };

  const startTimer = async (activityId: number, gameSessionId: number) => {
    try {
      const timerResponse = await api.get(`/sessions/game-sessions/${gameSessionId}/activity_timer/`);
      const timerData = timerResponse.data;

      if (timerData.error || !timerData.timer_duration) return;

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

  const determineAndRedirect = (sessionData: GameSession) => {
    const currentStageNumber = sessionData.current_stage_number || 0;
    const currentActivityName = sessionData.current_activity_name?.toLowerCase() || '';

    if (currentStageNumber === 1) {
      if (currentActivityName.includes('personaliz')) {
        window.location.href = `/profesor/etapa1/personalizacion/${sessionId}/`;
      } else if (currentActivityName.includes('presentaci')) {
        // Ya estamos aquí
        return;
      }
    } else if (currentStageNumber === 2) {
      if (currentActivityName.includes('tema') || currentActivityName.includes('seleccionar')) {
        window.location.href = `/profesor/etapa2/seleccionar-tema/${sessionId}/`;
      } else if (currentActivityName.includes('desafío') || currentActivityName.includes('desafio')) {
                        window.location.href = `/profesor/etapa2/bubble-map/${sessionId}/`;
      } else if (currentActivityName.includes('bubble') || currentActivityName.includes('mapa')) {
        window.location.href = `/profesor/etapa2/bubble-map/${sessionId}/`;
      }
    } else if (currentStageNumber === 3) {
      window.location.href = `/profesor/etapa3/prototipo/${sessionId}/`;
    } else if (currentStageNumber === 4) {
      window.location.href = `/profesor/etapa4/formulario-pitch/${sessionId}/`;
    } else if (sessionData.status === 'finished' || sessionData.status === 'completed') {
      window.location.href = `/profesor/resultados/${sessionId}/?stage_id=${currentStageNumber}`;
    } else {
      navigate('/profesor/panel');
    }
  };

  const handleNextActivity = async () => {
    if (!sessionId) return;
    if (!confirm('¿Avanzar a la siguiente actividad? Todos los equipos deben haber completado la actividad actual.')) {
      return;
    }

    setAdvancing(true);
    try {
      const response = await api.post(`/sessions/game-sessions/${sessionId}/next_activity/`);
      const data = response.data;

      if (data.stage_completed) {
        toast.success(`¡${data.message}`, { duration: 2000 });
        setTimeout(() => {
          window.location.replace(`/profesor/resultados/${sessionId}/?stage_id=${data.stage_id}`);
        }, 1500);
      } else {
        const nextActivityName = data.current_activity_name?.toLowerCase() || '';
        toast.success(`¡Avanzando a la actividad de ${nextActivityName}!`, { duration: 2000 });
        setTimeout(() => {
          determineAndRedirect(data);
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al avanzar a la siguiente actividad');
    } finally {
      setAdvancing(false);
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

  const getShortName = (fullName: string) => {
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    let lastName = '';
    if (nameParts.length === 2) {
      lastName = nameParts[1];
    } else if (nameParts.length >= 3) {
      lastName = nameParts[nameParts.length - 2];
    }
    return lastName ? `${firstName} ${lastName}`.trim() : firstName || fullName;
  };

  const getInitials = (fullName: string) => {
    const nameParts = fullName.trim().split(/\s+/);
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || '';
    const lastInitial = nameParts[nameParts.length - 1]?.[0]?.toUpperCase() || '';
    return firstInitial + (lastInitial && lastInitial !== firstInitial ? lastInitial : '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error al cargar la sesión.</p>
          <Button onClick={() => navigate('/profesor/panel')}>Volver al Panel</Button>
        </div>
      </div>
    );
  }

  const completedTeams = teams.filter((team) => {
    const progress = activityProgress[team.id];
    return progress && progress.status === 'completed';
  }).length;

  const inProgressTeams = teams.filter((team) => {
    const progress = activityProgress[team.id];
    return progress && progress.status !== 'completed' && progress.status !== 'pending';
  }).length;

  const totalTeams = teams.length;
  const allTeamsCompleted = totalTeams > 0 && completedTeams === totalTeams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#093c92] flex items-center gap-2">
              <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7" />
              <span className="hidden sm:inline">Control de Actividad</span>
              <span className="sm:hidden">Actividad</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Sesión: <span className="font-semibold">{gameSession.room_code}</span>
            </p>
          </div>
          <Button onClick={() => navigate('/profesor/panel')} variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver al Panel</span>
            <span className="sm:hidden">Volver</span>
          </Button>
        </div>

        {/* Información de la Etapa y Actividad */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
          <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#f757ac] mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-2">Etapa 1: Trabajo en Equipo</h2>
          <p className="text-gray-700 text-base sm:text-lg mb-4">
            Actividad Actual: <span className="font-semibold">Presentación / Minijuego</span>
          </p>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            Los equipos están jugando el minijuego de anagramas o presentándose según si se conocen
          </p>

          {/* Temporizador */}
          <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 p-3 sm:p-4 rounded-lg inline-flex items-center gap-2">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            <p className="font-semibold text-base sm:text-lg">Tiempo restante: {timerRemaining}</p>
          </div>

          {/* Estadísticas de progreso */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200">
              <p className="text-3xl sm:text-4xl font-bold text-[#093c92]">{completedTeams}</p>
              <p className="text-sm sm:text-base text-gray-700">Equipos Listos</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200">
              <p className="text-3xl sm:text-4xl font-bold text-yellow-800">{inProgressTeams}</p>
              <p className="text-sm sm:text-base text-gray-700">En Progreso</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-3xl sm:text-4xl font-bold text-gray-700">{totalTeams}</p>
              <p className="text-sm sm:text-base text-gray-700">Total Equipos</p>
            </div>
          </div>
        </div>

        {/* Sección de Equipos */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4">
            <Users className="inline-block w-6 h-6 mr-2" /> Estado de Equipos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {teams.map((team) => {
              const personalization = personalizations[team.id] || null;
              const progress = activityProgress[team.id] || null;
              const teamKnowsEachOther = personalization?.team_members_know_each_other;

              const isCompleted = progress && progress.status === 'completed';
              const statusText = isCompleted ? 'Listo' : progress ? 'En Progreso' : 'Pendiente';
              const statusColor = isCompleted
                ? 'bg-green-100 text-green-800'
                : progress
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-600';

              // Determinar tipo de actividad
              let activityType = 'unknown';
              let activityDetails = '';

              if (teamKnowsEachOther === true) {
                // Equipo que se conoce → minijuego de anagramas
                activityType = 'anagram';
                if (progress) {
                  const responseData = progress.response_data || {};
                  const correctAnswers = responseData.correct_answers || 0;
                  const totalWords = responseData.total_words || 3;
                  const tokensEarned = responseData.tokens_earned || 0;
                  const progressPercentage = progress.progress_percentage || 0;

                  activityDetails = (
                    <div className="mt-3 text-sm text-gray-700 space-y-1">
                      <p>
                        <span className="font-medium">Palabras correctas:</span>{' '}
                        <strong>{correctAnswers}/{totalWords}</strong>
                      </p>
                      <p>
                        <span className="font-medium">Tokens ganados:</span>{' '}
                        <strong className="text-green-600">{tokensEarned} tokens</strong>
                      </p>
                      <p>
                        <span className="font-medium">Progreso:</span> <strong>{progressPercentage}%</strong>
                      </p>
                    </div>
                  );
                } else {
                  activityDetails = (
                    <p className="mt-3 text-sm text-gray-500 italic">Aún no ha iniciado el minijuego</p>
                  );
                }
              } else if (teamKnowsEachOther === false) {
                // Equipo que NO se conoce → actividad de presentación
                activityType = 'presentation';
                activityDetails = (
                  <p className="mt-3 text-sm text-gray-700">
                    {isCompleted ? (
                      <span className="text-green-600">✅ Presentación completada</span>
                    ) : (
                      <span className="text-gray-600">En proceso de presentación</span>
                    )}
                  </p>
                );
              } else {
                // Aún no se ha definido
                activityType = 'pending';
                activityDetails = <p className="mt-3 text-sm text-gray-500 italic">Aún no ha iniciado la actividad</p>;
              }

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-xl shadow-md border-l-4 p-4"
                  style={{ borderLeftColor: getTeamColorHex(team.color) }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: getTeamColorHex(team.color) }}
                      >
                        {team.color.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-base text-[#093c92]">{team.name}</h4>
                        <p className="text-xs text-gray-600">{team.students_count} estudiantes</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor}`}>
                      {statusText}
                    </span>
                  </div>

                  <div className="mt-3">
                    <h5 className="font-semibold text-sm text-gray-700 mb-2">
                      {activityType === 'anagram' ? (
                        <>🎮 Minijuego - Anagramas</>
                      ) : activityType === 'presentation' ? (
                        <>👋 Presentación - Hablar</>
                      ) : (
                        <>⏳ Esperando</>
                      )}
                    </h5>
                    {activityDetails}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Botón Siguiente Actividad */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-center">
          <Button
            onClick={handleNextActivity}
            disabled={!allTeamsCompleted || advancing}
            className={`w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold ${
              allTeamsCompleted
                ? 'bg-gradient-to-r from-[#093c92] to-[#1e5bb8] hover:from-[#072e73] hover:to-[#164a9a] text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {advancing ? (
              <>
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                Avanzando...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Siguiente Actividad
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}


