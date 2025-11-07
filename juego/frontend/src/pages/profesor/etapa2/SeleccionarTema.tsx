import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, Clock, ArrowRight, Users, BookOpen, CheckCircle2, Target
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
  tokens_total: number;
  faculty?: number;
}

interface Topic {
  id: number;
  name: string;
  description: string;
  icon_name?: string;
}

interface ActivityProgress {
  id: number;
  team: number;
  activity: number;
  session_stage: number;
  status: string;
  selected_topic?: Topic | number;
}

interface Challenge {
  id: number;
  title: string;
  icon?: string;
  persona_name?: string;
  persona_age?: number;
  persona_story?: string;
  difficulty_level: string;
}

interface TeamProgress {
  team: Team;
  topic?: Topic;
  challenge?: Challenge;
  topicStatus: 'completed' | 'pending';
  challengeStatus: 'completed' | 'pending';
}

export function ProfesorSeleccionarTema() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsProgress, setTeamsProgress] = useState<TeamProgress[]>([]);
  const [gameSession, setGameSession] = useState<any>(null);
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [currentSessionStage, setCurrentSessionStage] = useState<any>(null);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [allTopicsSelected, setAllTopicsSelected] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionId) {
      navigate('/profesor/panel');
      return;
    }

    loadGameControl();
    intervalRef.current = setInterval(loadGameControl, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [sessionId, navigate]);

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

  const loadGameControl = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/profesor/login');
        return;
      }

      const sessionResponse = await api.get(`/sessions/game-sessions/${sessionId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessionData = sessionResponse.data;
      setGameSession(sessionData);

      if (sessionData.status === 'finished' || sessionData.status === 'completed') {
        toast.info('El juego ha finalizado. Redirigiendo al panel...');
        setTimeout(() => navigate('/profesor/panel'), 2000);
        return;
      }

      if (sessionData.status === 'lobby') {
        toast.info('El juego está en el lobby. Redirigiendo...');
        setTimeout(() => navigate(`/profesor/lobby/${sessionId}`), 2000);
        return;
      }

      const currentStageNumber = sessionData.current_stage_number;
      const currentActivityId = sessionData.current_activity;
      const currentActivityName = sessionData.current_activity_name?.toLowerCase() || '';

      // Redirection logic if not in Stage 2 or not topic selection activity
      if (currentStageNumber !== 2) {
        toast.info('El juego no está en la Etapa 2. Redirigiendo...');
        setTimeout(() => navigate(`/profesor/panel`), 2000);
        return;
      }

      // La actividad de tema/desafío es la misma ahora
      const isTopicActivity = currentActivityName.includes('tema') || 
        currentActivityName.includes('desafio') || 
        currentActivityName.includes('desafío') ||
        (currentActivityName.includes('seleccionar'));

      if (!isTopicActivity && currentActivityId) {
        // Not topic/challenge activity, redirect based on activity name
        if (currentActivityName.includes('bubble') || currentActivityName.includes('mapa')) {
          setTimeout(() => navigate(`/profesor/etapa2/bubble-map/${sessionId}`), 1500);
        }
        return;
      }

      // If no current activity in Stage 2, it means stage is completed, redirect to results
      if (!currentActivityId && currentStageNumber === 2) {
        toast.info('Etapa 2 completada. Redirigiendo a resultados...');
        setTimeout(() => navigate(`/profesor/resultados/${sessionId}`), 2000);
        return;
      }

      // Fetch current activity details
      if (currentActivityId) {
        const activityResponse = await api.get(`/challenges/activities/${currentActivityId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentActivity(activityResponse.data);
      }

      // Fetch current session stage
      const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const stages = stagesResponse.data.results || stagesResponse.data;
      const stage2 = stages.find((s: any) => s.stage_number === 2);
      setCurrentSessionStage(stage2);

      // Fetch teams
      const teamsResponse = await api.get(`/sessions/game-sessions/${sessionId}/teams/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedTeams: Team[] = teamsResponse.data;
      setTeams(fetchedTeams);

      // Load progress for each team
      if (stage2 && currentActivityId) {
        await loadTeamsProgress(fetchedTeams, currentActivityId, stage2.id);
      }

      // Start timer
      if (currentActivityId) {
        startTimer(currentActivityId, parseInt(sessionId));
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading game control:', error);
      toast.error('Error al cargar el control del juego: ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  const loadTeamsProgress = async (teamsList: Team[], activityId: number, stageId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Todo está en la misma actividad (seleccionar tema/desafío)
      const progressPromises = teamsList.map(async (team) => {
        let topic: Topic | undefined;
        let challenge: Challenge | undefined;
        let topicStatus: 'completed' | 'pending' = 'pending';
        let challengeStatus: 'completed' | 'pending' = 'pending';

        // Get topic and challenge from the current activity (they're stored together)
        try {
          const progressResponse = await api.get(
            `/sessions/team-activity-progress/?team=${team.id}&activity=${activityId}&session_stage=${stageId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const progressData = progressResponse.data;
          const progress = Array.isArray(progressData) ? progressData[0] : progressData.results?.[0];

          if (progress) {
            // Get topic
            if (progress.selected_topic) {
              if (typeof progress.selected_topic === 'object') {
                topic = progress.selected_topic as Topic;
              } else {
                try {
                  const topicResponse = await api.get(`/challenges/topics/${progress.selected_topic}/`);
                  topic = topicResponse.data;
                } catch {
                  topic = { id: progress.selected_topic, name: 'Tema seleccionado' } as Topic;
                }
              }
              // Si hay tema, está pendiente o completado según el status
              topicStatus = progress.status === 'completed' ? 'completed' : 'pending';
            }

            // Get challenge from the same progress (they're stored together)
            if (progress.selected_challenge) {
              if (typeof progress.selected_challenge === 'object') {
                challenge = progress.selected_challenge as Challenge;
              } else {
                try {
                  const challengeResponse = await api.get(`/challenges/challenges/${progress.selected_challenge}/`);
                  challenge = challengeResponse.data;
                } catch {
                  challenge = { id: progress.selected_challenge, title: 'Desafío seleccionado' } as Challenge;
                }
              }
              // Si hay desafío, está completado (porque el desafío solo se guarda cuando se confirma)
              challengeStatus = progress.status === 'completed' ? 'completed' : 'pending';
            }
          }
        } catch (error) {
          console.error(`Error loading progress for team ${team.id}:`, error);
        }

        return {
          team,
          topic,
          challenge,
          topicStatus,
          challengeStatus,
        } as TeamProgress;
      });

      const progressList = await Promise.all(progressPromises);
      setTeamsProgress(progressList);

      // Check if all teams have selected topics and challenges
      const allTopicsSelected = progressList.every((tp) => tp.topicStatus === 'completed');
      const allChallengesSelected = progressList.every((tp) => tp.challengeStatus === 'completed');
      setAllTopicsSelected(allTopicsSelected && allChallengesSelected);
    } catch (error) {
      console.error('Error loading teams progress:', error);
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
        console.error('Error al obtener información del temporizador:', timerData.error);
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

  const handleNextActivity = async () => {
    if (!sessionId) return;
    setLoading(true);
    
    // Detener el polling mientras se avanza
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.post(
        `/sessions/game-sessions/${sessionId}/next_activity/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;

      console.log('📊 Respuesta de next_activity:', data);

      if (data.stage_completed) {
        toast.success('¡Etapa 2 completada! Redirigiendo a resultados...');
        setLoading(false);
        setTimeout(() => navigate(`/profesor/resultados/${sessionId}`), 1500);
      } else {
        // Verificar el nombre de la actividad para redirigir correctamente
        const nextActivityName = data.current_activity_name?.toLowerCase() || '';
        const currentOrder = data.current_activity_order_number || 0;
        
        console.log('📊 Siguiente actividad:', {
          name: nextActivityName,
          order: currentOrder,
          activityId: data.current_activity_id
        });
        
        // Siempre ir directo a bubble map (saltando ver-desafio)
        // En Etapa 2: orden 1 = Seleccionar Tema, orden 2 = Ver Desafío (se salta), orden 3 = Bubble Map
        const isBubbleMap = currentOrder === 3 || 
                           nextActivityName.includes('bubble') || 
                           nextActivityName.includes('mapa') ||
                           nextActivityName.includes('mapa mental') ||
                           nextActivityName.includes('bubblemap');
        
        if (isBubbleMap) {
          toast.success('¡Avanzando a Bubble Map!');
          setLoading(false);
          // Redirigir inmediatamente sin delay
          navigate(`/profesor/etapa2/bubble-map/${sessionId}`);
        } else {
          // Si por alguna razón no es bubble map, mostrar error y recargar
          console.warn('⚠️ La siguiente actividad no es bubble map:', {
            name: nextActivityName,
            order: currentOrder,
            activityId: data.current_activity_id
          });
          toast.warning(`La actividad no cambió correctamente. Actividad actual: ${nextActivityName}. Recargando...`);
          setLoading(false);
          setTimeout(() => {
            loadGameControl();
          }, 1000);
        }
      }
    } catch (error: any) {
      console.error('❌ Error en next_activity:', error);
      toast.error('Error al avanzar a la siguiente actividad: ' + (error.response?.data?.error || error.message));
      // Reanudar polling en caso de error
      intervalRef.current = setInterval(loadGameControl, 5000);
      setLoading(false);
    }
  };

  if (loading && teamsProgress.length === 0) {
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
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-1">
              Etapa 2: Empatía
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Actividad Actual: {currentActivity?.name || 'Seleccionar Tema'}
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 px-4 py-2 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> Tiempo restante: {timerRemaining}
          </div>
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
            <p className="text-2xl sm:text-3xl font-bold text-[#093c92]">{teams.length}</p>
            <p className="text-sm sm:text-base text-gray-600">Equipos Totales</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {teamsProgress.filter((tp) => tp.topicStatus === 'completed').length}
            </p>
            <p className="text-sm sm:text-base text-gray-600">Temas Seleccionados</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center">
            <Target className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-purple-600">
              {teamsProgress.filter((tp) => tp.challengeStatus === 'completed').length}
            </p>
            <p className="text-sm sm:text-base text-gray-600">Desafíos Seleccionados</p>
          </div>
        </motion.div>

        {/* Equipos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4 sm:mb-6 text-center">
            <Users className="inline-block w-6 h-6 mr-2" /> Estado de los Equipos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {teamsProgress.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 text-sm sm:text-base">Cargando estado de los equipos...</p>
              </div>
            ) : (
              teamsProgress.map((teamProgress, index) => (
                <motion.div
                  key={teamProgress.team.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 sm:p-6 rounded-xl shadow-md border-l-4 bg-gray-50"
                  style={{
                    borderLeftColor: getTeamColorHex(teamProgress.team.color),
                  }}
                >
                  <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-base sm:text-lg font-bold shadow-md"
                      style={{ backgroundColor: getTeamColorHex(teamProgress.team.color) }}
                    >
                      {teamProgress.team.color.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm sm:text-base text-[#093c92]">{teamProgress.team.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">Equipo {teamProgress.team.color}</p>
                    </div>
                  </div>

                  {/* Tema */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" /> Tema:
                      </span>
                      <Badge
                        className={`text-xs ${
                          teamProgress.topicStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {teamProgress.topicStatus === 'completed' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {teamProgress.topicStatus === 'completed' ? 'Seleccionado' : 'Pendiente'}
                      </Badge>
                    </div>
                    {teamProgress.topic ? (
                      <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                        <p className="text-xs sm:text-sm font-semibold text-[#093c92]">{teamProgress.topic.name}</p>
                        {teamProgress.topic.description && (
                          <p className="text-xs text-gray-600 mt-1">{teamProgress.topic.description}</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500 italic">Aún no ha seleccionado</p>
                    )}
                  </div>

                  {/* Desafío */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4" /> Desafío:
                      </span>
                      <Badge
                        className={`text-xs ${
                          teamProgress.challengeStatus === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {teamProgress.challengeStatus === 'completed' ? (
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {teamProgress.challengeStatus === 'completed' ? 'Seleccionado' : 'Pendiente'}
                      </Badge>
                    </div>
                    {teamProgress.challenge ? (
                      <div className="bg-purple-50 p-2 sm:p-3 rounded-lg space-y-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Nombre del Desafío:</p>
                          <p className="text-xs sm:text-sm font-semibold text-purple-800">{teamProgress.challenge.title}</p>
                        </div>
                        {teamProgress.challenge.persona_story && (
                          <div>
                            <p className="text-xs font-semibold text-gray-700 mb-1">Historia:</p>
                            <p className="text-xs text-gray-600 line-clamp-3">{teamProgress.challenge.persona_story}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-500 italic">Aún no ha seleccionado</p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Botón Siguiente Actividad */}
        {allTopicsSelected && teamsProgress.every((tp) => tp.challengeStatus === 'completed') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Button
              onClick={handleNextActivity}
              disabled={loading}
              className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#f757ac] to-pink-600 hover:from-[#e6498a] hover:to-[#d13a7a] text-white rounded-full shadow-2xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                  Cargando...
                </>
              ) : (
                <>
                  Siguiente Actividad
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}




