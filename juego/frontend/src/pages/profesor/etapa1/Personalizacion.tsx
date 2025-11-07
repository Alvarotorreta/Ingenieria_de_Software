import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, Loader2, CheckCircle2, XCircle, ArrowRight, Play } from 'lucide-react';
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
  created_at?: string;
  updated_at?: string;
}

interface GameSession {
  id: number;
  room_code: string;
  status: string;
  current_activity_name?: string;
  current_stage_number?: number;
  started_at?: string;
}

export function ProfesorPersonalizacion() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [personalizations, setPersonalizations] = useState<Record<number, Personalization>>({});
  const [loading, setLoading] = useState(true);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [advancing, setAdvancing] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
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
        // Redirigir a la vista correcta según la etapa
        determineAndRedirect(sessionData);
        return;
      }

      // Verificar actividad actual
      const currentActivityName = sessionData.current_activity_name?.toLowerCase() || '';
      if (!currentActivityName.includes('personaliz')) {
        // Redirigir a la actividad correcta
        if (currentActivityName.includes('presentaci')) {
          window.location.href = `/profesor/etapa1/presentacion/${sessionId}/`;
        } else {
          window.location.href = `/profesor/lobby/${sessionId}`;
        }
        return;
      }

      setGameSession(sessionData);

      // Obtener equipos
      const teamsResponse = await api.get(`/sessions/teams/?game_session=${sessionId}`);
      const teamsData = teamsResponse.data.results || teamsResponse.data;
      setTeams(Array.isArray(teamsData) ? teamsData : []);

      // Obtener personalizaciones de todos los equipos
      const persMap: Record<number, Personalization> = {};
      for (const team of teamsData) {
        try {
          const persResponse = await api.get(`/sessions/team-personalizations/?team=${team.id}`);
          const persData = persResponse.data.results || persResponse.data;
          const persResults = Array.isArray(persData) ? persData : [];
          if (persResults.length > 0) {
            persMap[team.id] = persResults[0];
          }
        } catch (error) {
          console.error(`Error loading personalization for team ${team.id}:`, error);
        }
      }
      setPersonalizations(persMap);

      // Iniciar temporizador
      if (sessionData.current_activity && !timerIntervalRef.current) {
        startTimer(sessionData.current_activity, parseInt(sessionId));
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

  const startTimer = async (activityId: number, sessionId: number) => {
    try {
      const timerResponse = await api.get(`/sessions/game-sessions/${sessionId}/activity_timer/`);
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
          // No mostrar notificación al profesor, solo actualizar el display
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

    if (currentStageNumber === 2) {
      if (currentActivityName.includes('tema') || currentActivityName.includes('seleccionar') || currentActivityName.includes('desafio') || currentActivityName.includes('desafío')) {
        window.location.href = `/profesor/etapa2/seleccionar-tema/${sessionId}/`;
      } else if (currentActivityName.includes('bubble') || currentActivityName.includes('mapa')) {
        window.location.href = `/profesor/etapa2/bubble-map/${sessionId}/`;
      }
    } else if (currentStageNumber === 3) {
      if (currentActivityName.includes('prototipo')) {
        window.location.href = `/profesor/etapa3/prototipo/${sessionId}/`;
      }
    } else if (currentStageNumber === 4) {
      if (currentActivityName.includes('pitch')) {
        if (currentActivityName.includes('formulario')) {
          window.location.href = `/profesor/etapa4/formulario-pitch/${sessionId}/`;
        } else if (currentActivityName.includes('presentacion')) {
          window.location.href = `/profesor/etapa4/presentacion-pitch/${sessionId}/`;
        }
      }
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
        toast.success(`¡${data.message}!`);
        setTimeout(() => {
          window.location.href = `/profesor/resultados/${sessionId}/?stage_id=${data.stage_id}`;
        }, 1500);
      } else {
        const nextActivityName = data.current_activity_name;
        toast.success(`¡Avanzando a ${nextActivityName}!`);

        if (nextActivityName === 'Presentación' || nextActivityName.toLowerCase().includes('presentacion')) {
          setTimeout(() => {
            window.location.href = `/profesor/etapa1/presentacion/${sessionId}/`;
          }, 1500);
        } else {
          setTimeout(() => {
            loadGameControl();
          }, 1500);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al avanzar a la siguiente actividad');
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
          <p className="text-xl mb-4">Error al cargar la sesión</p>
          <Button onClick={() => navigate('/profesor/panel')}>Volver al Panel</Button>
        </div>
      </div>
    );
  }

  // Calcular estadísticas
  const completedCount = teams.filter(team => {
    const pers = personalizations[team.id];
    return pers && pers.team_name && pers.team_name.trim() !== '' && pers.team_members_know_each_other !== null;
  }).length;

  const inProgressCount = teams.length - completedCount;
  const allCompleted = completedCount === teams.length && teams.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-2">
                Personalización del Equipo
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Código de Sala: <span className="font-bold text-[#093c92]">{gameSession.room_code}</span>
              </p>
            </div>
            <Button
              onClick={() => navigate('/profesor/panel')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Volver al Panel
            </Button>
          </div>

          {/* Información de Etapa */}
          <div className="bg-gradient-to-r from-[#093c92] to-[#1e5bb8] text-white rounded-xl p-4 sm:p-6 mb-4">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl mb-3">👥</div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">Etapa 1: Trabajo en Equipo</h2>
              <p className="text-sm sm:text-base opacity-90">
                Actividad Actual: {gameSession.current_activity_name || 'Personalización'}
              </p>
            </div>
          </div>

          {/* Temporizador */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 text-center mb-4">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-700" />
              <p className="text-yellow-800 font-semibold text-base sm:text-lg">
                ⏱️ Tiempo restante: <span className="font-bold">{timerRemaining}</span>
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-1">
                {completedCount}
              </div>
              <div className="text-sm sm:text-base text-green-800 font-semibold">Completados</div>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-yellow-700 mb-1">
                {inProgressCount}
              </div>
              <div className="text-sm sm:text-base text-yellow-800 font-semibold">En Progreso</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 text-center">
              <div className="text-3xl sm:text-4xl font-bold text-blue-700 mb-1">
                {teams.length}
              </div>
              <div className="text-sm sm:text-base text-blue-800 font-semibold">Total Equipos</div>
            </div>
          </div>
        </div>

        {/* Equipos */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4 sm:mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            Equipos ({teams.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teams.map((team) => {
              const pers = personalizations[team.id];
              const isCompleted = pers && pers.team_name && pers.team_name.trim() !== '' && pers.team_members_know_each_other !== null;
              const status = isCompleted ? 'completed' : (pers ? 'in-progress' : 'pending');
              const statusText = isCompleted ? 'Listo' : (pers ? 'En Progreso' : 'Pendiente');

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gray-50 rounded-xl p-4 sm:p-5 shadow-lg border-l-4 ${
                    isCompleted ? 'border-green-500' : 'border-gray-300'
                  }`}
                  style={{ borderLeftColor: isCompleted ? '#28a745' : getTeamColorHex(team.color) }}
                >
                  {/* Header del equipo */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-md"
                        style={{ backgroundColor: getTeamColorHex(team.color) }}
                      >
                        {team.color.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-gray-800">{team.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {team.students_count} estudiantes
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                        status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {statusText}
                    </div>
                  </div>

                  {/* Detalles de personalización */}
                  <div className="space-y-3">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-700">📝 Personalización</h4>
                    {pers ? (
                      <>
                        <div>
                          <span className="text-xs sm:text-sm text-gray-600">Nombre del Equipo:</span>
                          <p className="text-sm sm:text-base font-semibold text-gray-800 mt-1">
                            {pers.team_name || (
                              <span className="text-gray-400 italic">No definido</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm text-gray-600">¿Se conocen?:</span>
                          <p className="text-sm sm:text-base font-semibold mt-1">
                            {pers.team_members_know_each_other !== null ? (
                              pers.team_members_know_each_other ? (
                                <span className="text-green-700">✅ Sí, ya se conocen</span>
                              ) : (
                                <span className="text-red-700">❌ No se conocen</span>
                              )
                            ) : (
                              <span className="text-gray-400 italic">No indicado</span>
                            )}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 italic">Aún no ha iniciado la personalización</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Botón de siguiente actividad */}
        {allCompleted && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 text-center">
            <Button
              onClick={handleNextActivity}
              disabled={advancing}
              className="bg-gradient-to-r from-[#093c92] to-[#1e5bb8] hover:from-[#072e73] hover:to-[#164a9a] text-white px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold"
            >
              {advancing ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                  Avanzando...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Avanzar a Siguiente Actividad
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

