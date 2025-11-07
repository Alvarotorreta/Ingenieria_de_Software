import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, Clock, ArrowRight, Users, CheckCircle2, FileText, Eye, X, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GroupBadge } from '@/components/GroupBadge';
import api from '@/services/api';
import { toast } from 'sonner';

interface Team {
  id: number;
  name: string;
  color: string;
}

interface TeamPitch {
  team: Team;
  progress: {
    id: number;
    pitch_intro_problem: string | null;
    pitch_solution: string | null;
    pitch_closing: string | null;
    status: string;
    progress_percentage: number;
  } | null;
}

interface GameSession {
  id: number;
  room_code: string;
  current_activity: number | null;
  current_activity_name: string | null;
}

export function ProfesorFormularioPitch() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teamsWithPitch, setTeamsWithPitch] = useState<TeamPitch[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [currentSessionStage, setCurrentSessionStage] = useState<any>(null);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [allTeamsCompleted, setAllTeamsCompleted] = useState(false);
  const [previewTeam, setPreviewTeam] = useState<TeamPitch | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerStartTimeRef = useRef<number | null>(null);
  const timerDurationRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionId) {
      loadGameControl();
      intervalRef.current = setInterval(() => {
        loadGameControl();
      }, 5000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (timerSyncIntervalRef.current) clearInterval(timerSyncIntervalRef.current);
      };
    }
  }, [sessionId]);

  const loadGameControl = async () => {
    if (!sessionId) return;

    try {
      const sessionResponse = await api.get(`/sessions/game-sessions/${sessionId}/`);
      const sessionData: GameSession = sessionResponse.data;
      setGameSession(sessionData);

      const currentStageNumber = sessionData.current_stage_number || 1;
      if (currentStageNumber !== 4) {
        if (currentStageNumber === 3) {
          window.location.replace(`/profesor/etapa3/prototipo/${sessionId}/`);
        } else if (currentStageNumber === 2) {
          window.location.replace(`/profesor/etapa2/seleccionar-tema/${sessionId}/`);
        } else {
          window.location.replace(`/profesor/etapa1/personalizacion/${sessionId}/`);
        }
        return;
      }

      if (sessionData.current_activity) {
        const activityResponse = await api.get(`/challenges/activities/${sessionData.current_activity}/`);
        setCurrentActivity(activityResponse.data);

        const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${sessionId}`);
        const stagesData = stagesResponse.data.results || stagesResponse.data;
        const sessionStage = Array.isArray(stagesData)
          ? stagesData.find((s: any) => s.stage_number === 4)
          : null;

        if (sessionStage) {
          setCurrentSessionStage(sessionStage);
          await loadTeamsPitch(sessionId, sessionData.current_activity, sessionStage.id);
          startTimer(sessionData.current_activity, parseInt(sessionId));
        }
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

  const loadTeamsPitch = async (gameSessionId: string, activityId: number, sessionStageId: number) => {
    try {
      const teamsResponse = await api.get(`/sessions/game-sessions/${gameSessionId}/teams/`);
      const teams: Team[] = teamsResponse.data;

      const teamsWithProgress: TeamPitch[] = await Promise.all(
        teams.map(async (team) => {
          try {
            const progressResponse = await api.get(
              `/sessions/team-activity-progress/?team=${team.id}&activity=${activityId}&session_stage=${sessionStageId}`
            );
            const progressData = progressResponse.data;
            const progressArray = Array.isArray(progressData) ? progressData : progressData.results || [];
            const progress = progressArray[0] || null;

            return {
              team,
              progress,
            };
          } catch (error) {
            return {
              team,
              progress: null,
            };
          }
        })
      );

      setTeamsWithPitch(teamsWithProgress);
      const allCompleted = teamsWithProgress.every(
        (item) => item.progress && item.progress.status === 'completed'
      );
      setAllTeamsCompleted(allCompleted);
    } catch (error) {
      console.error('Error loading teams pitch:', error);
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

      timerDurationRef.current = timerData.timer_duration;
      timerStartTimeRef.current = timerData.started_at
        ? new Date(timerData.started_at).getTime()
        : new Date(timerData.current_time).getTime();

      const updateTimer = () => {
        if (timerStartTimeRef.current && timerDurationRef.current) {
          const now = Date.now();
          const elapsed = Math.floor((now - timerStartTimeRef.current) / 1000);
          const remaining = Math.max(0, timerDurationRef.current - elapsed);

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
        }
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);

      timerSyncIntervalRef.current = setInterval(async () => {
        try {
          const syncResponse = await api.get(`/sessions/game-sessions/${gameSessionId}/activity_timer/`);
          const syncData = syncResponse.data;
          if (syncData.started_at && syncData.timer_duration) {
            timerStartTimeRef.current = new Date(syncData.started_at).getTime();
            timerDurationRef.current = syncData.timer_duration;
          }
        } catch (error) {
          console.error('Error syncing timer:', error);
        }
      }, 5000);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const handleNextActivity = async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const response = await api.post(`/sessions/game-sessions/${sessionId}/next_activity/`);

      if (response.data.stage_completed) {
        navigate(`/profesor/resultados/${sessionId}/?stage_id=${response.data.stage_id}`);
      } else {
        // Verificar si la siguiente actividad es de presentación
        const sessionResponse = await api.get(`/sessions/game-sessions/${sessionId}/`);
        const sessionData = sessionResponse.data;
        
        // Si estamos en Etapa 4 y la siguiente actividad es de presentación, redirigir
        if (sessionData.current_stage_number === 4) {
          const currentActivityName = sessionData.current_activity_name?.toLowerCase() || '';
          if (currentActivityName.includes('presentacion') || currentActivityName.includes('presentación')) {
            navigate(`/profesor/etapa4/presentacion-pitch/${sessionId}`);
            return;
          }
        }
        
        // Por defecto, recargar la página
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error advancing activity:', error);
      toast.error('Error al avanzar: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  const handlePreview = (teamPitch: TeamPitch) => {
    setPreviewTeam(teamPitch);
  };

  const handleClosePreview = () => {
    setPreviewTeam(null);
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

  const getStatusBadge = (status: string, progress: number) => {
    if (status === 'completed') {
      return <Badge className="bg-green-500 text-white">✓ Completado</Badge>;
    } else if (status === 'in_progress') {
      return <Badge className="bg-yellow-500 text-white">{progress}%</Badge>;
    } else {
      return <Badge className="bg-gray-400 text-white">⏳ Pendiente</Badge>;
    }
  };

  if (loading && !gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#093c92] mb-2 flex items-center gap-2">
              <FileText className="w-6 h-6 sm:w-7 sm:h-7" />
              Formulario de Pitch
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Código de sala: <span className="font-semibold">{gameSession?.room_code}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => navigate('/profesor/panel')} variant="outline" className="flex items-center gap-2">
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Panel</span>
              <span className="sm:hidden">Volver</span>
            </Button>
          </div>
        </motion.div>

        {/* Stage Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-4 sm:mb-6 text-center"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl mx-auto mb-4">
            <span className="text-4xl sm:text-5xl">📢</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#093c92] mb-2">
            Etapa 4: Comunicación
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-4">
            {currentActivity?.name || 'Formulario de Pitch'}
          </p>

          {/* Timer */}
          {timerRemaining !== '--:--' && (
            <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 px-4 py-2 rounded-xl font-semibold text-sm sm:text-base inline-flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> Tiempo restante: {timerRemaining}
            </div>
          )}
        </motion.div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {teamsWithPitch.map((teamPitch) => {
            const hasPitch = teamPitch.progress !== null;
            const isCompleted = teamPitch.progress?.status === 'completed';
            const progress = teamPitch.progress?.progress_percentage || 0;

            return (
              <motion.div
                key={teamPitch.team.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                      style={{ backgroundColor: getTeamColorHex(teamPitch.team.color) }}
                    >
                      {teamPitch.team.color.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-[#093c92]">{teamPitch.team.name}</h3>
                      <p className="text-xs text-gray-600">Equipo {teamPitch.team.color}</p>
                    </div>
                  </div>
                  {getStatusBadge(teamPitch.progress?.status || 'pending', progress)}
                </div>

                {hasPitch && (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isCompleted ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-xs text-gray-600">
                        <strong>Intro Problema:</strong>{' '}
                        {teamPitch.progress?.pitch_intro_problem ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-gray-600">
                        <strong>Solución:</strong>{' '}
                        {teamPitch.progress?.pitch_solution ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-gray-600">
                        <strong>Cierre:</strong>{' '}
                        {teamPitch.progress?.pitch_closing ? '✓' : '✗'}
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePreview(teamPitch)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Pitch
                    </Button>
                  </>
                )}

                {!hasPitch && (
                  <div className="text-center text-gray-500 text-sm py-4">
                    Aún no ha completado el formulario
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Next Activity Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleNextActivity}
            disabled={loading || !allTeamsCompleted}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Avanzando...
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5 mr-2" />
                Avanzar a Siguiente Actividad
              </>
            )}
          </Button>
        </motion.div>

        {/* Preview Modal */}
        {previewTeam && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleClosePreview}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-2xl font-bold text-[#093c92]">
                    Pitch de {previewTeam.team.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Equipo {previewTeam.team.color}</p>
                </div>
                <Button onClick={handleClosePreview} variant="ghost" size="sm" className="hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {previewTeam.progress ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg text-[#093c92] mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5" /> Introducción del Problema
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap min-h-[100px] border border-gray-200">
                      {previewTeam.progress.pitch_intro_problem || (
                        <span className="text-gray-400 italic">No completado</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg text-[#093c92] mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5" /> Solución
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap min-h-[100px] border border-gray-200">
                      {previewTeam.progress.pitch_solution || (
                        <span className="text-gray-400 italic">No completado</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg text-[#093c92] mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Cierre
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap min-h-[100px] border border-gray-200">
                      {previewTeam.progress.pitch_closing || (
                        <span className="text-gray-400 italic">No completado</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">Este equipo aún no ha completado el formulario de pitch.</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

