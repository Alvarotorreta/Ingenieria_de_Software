import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, Clock, ArrowRight, Users, CheckCircle2, Eye, X, Sparkles
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
}

interface BubbleMap {
  id: number;
  team: number;
  map_data: {
    nodes: Array<{
      id: number;
      text: string;
      x?: number;
      y?: number;
    }>;
    edges?: any[];
  };
  created_at: string;
  updated_at: string;
}

interface TeamWithMap {
  team: Team;
  bubbleMap: BubbleMap | null;
}

export function ProfesorBubbleMap() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teamsWithMaps, setTeamsWithMaps] = useState<TeamWithMap[]>([]);
  const [gameSession, setGameSession] = useState<any>(null);
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [currentSessionStage, setCurrentSessionStage] = useState<any>(null);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [allTeamsCompleted, setAllTeamsCompleted] = useState(false);
  const [previewMap, setPreviewMap] = useState<{ team: Team; bubbleMap: BubbleMap } | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerStartTimeRef = useRef<number | null>(null);
  const timerDurationRef = useRef<number | null>(null);

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
      if (timerSyncIntervalRef.current) clearInterval(timerSyncIntervalRef.current);
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

      // Redirection logic if not in Stage 2 or not bubble map activity
      if (currentStageNumber !== 2) {
        toast.info('El juego no está en la Etapa 2. Redirigiendo...');
        setTimeout(() => navigate(`/profesor/panel`), 2000);
        return;
      }

      const isBubbleMapActivity = currentActivityName.includes('bubble') || 
        currentActivityName.includes('mapa') || 
        currentActivityName.includes('mapa mental');

      if (!isBubbleMapActivity && currentActivityId) {
        // Not bubble map activity, redirect based on activity name
        if (currentActivityName.includes('tema') || currentActivityName.includes('seleccionar')) {
          setTimeout(() => navigate(`/profesor/etapa2/seleccionar-tema/${sessionId}`), 2000);
        }
        setLoading(false);
        return;
      }

      // If no current activity in Stage 2, it means stage is completed, redirect to results
      if (!currentActivityId && currentStageNumber === 2) {
        toast.info('Etapa 2 completada. Redirigiendo a resultados...');
        setTimeout(() => navigate(`/profesor/resultados/${sessionId}`), 2000);
        setLoading(false);
        return;
      }

      // Si no hay actividad actual pero estamos en etapa 2, puede ser que aún no se haya iniciado
      if (!currentActivityId) {
        setLoading(false);
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

      if (stage2) {
        await loadBubbleMaps(stage2.id);
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

  const loadBubbleMaps = async (sessionStageId: number) => {
    try {
      const token = localStorage.getItem('authToken');
      
      // Fetch teams
      const teamsResponse = await api.get(`/sessions/game-sessions/${sessionId}/teams/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const teams: Team[] = teamsResponse.data;

      // Fetch bubble maps for each team
      const teamsWithMapsPromises = teams.map(async (team) => {
        try {
          const mapResponse = await api.get(
            `/sessions/team-bubble-maps/?team=${team.id}&session_stage=${sessionStageId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const mapData = mapResponse.data;
          const bubbleMap = Array.isArray(mapData) ? mapData[0] : mapData.results?.[0] || null;
          return { team, bubbleMap };
        } catch (error) {
          console.error(`Error loading bubble map for team ${team.id}:`, error);
          return { team, bubbleMap: null };
        }
      });

      const teamsWithMaps = await Promise.all(teamsWithMapsPromises);
      setTeamsWithMaps(teamsWithMaps);

      // Check if all teams have completed (have at least 5 nodes)
      const allCompleted = teamsWithMaps.every(({ bubbleMap }) => {
        if (!bubbleMap) return false;
        const nodes = bubbleMap.map_data?.nodes || [];
        return nodes.length >= 5;
      });
      setAllTeamsCompleted(allCompleted);
    } catch (error) {
      console.error('Error loading bubble maps:', error);
    }
  };

  const syncTimer = async (gameSessionId: number) => {
    try {
      const timerResponse = await api.get(`/sessions/game-sessions/${gameSessionId}/activity_timer/`);
      const timerData = timerResponse.data;

      if (timerData.error || !timerData.timer_duration) {
        setTimerRemaining('--:--');
        return;
      }

      const timerDuration = timerData.timer_duration;
      const startTime = timerData.started_at
        ? new Date(timerData.started_at).getTime()
        : new Date(timerData.current_time).getTime();

      // Actualizar referencias
      timerStartTimeRef.current = startTime;
      timerDurationRef.current = timerDuration;
      
      // Actualizar display inmediatamente
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, timerDuration - elapsed);
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      setTimerRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    } catch (error) {
      console.error('Error syncing timer:', error);
      setTimerRemaining('--:--');
    }
  };

  const startTimer = async (activityId: number, gameSessionId: number) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (timerSyncIntervalRef.current) {
      clearInterval(timerSyncIntervalRef.current);
      timerSyncIntervalRef.current = null;
    }

    try {
      // Sincronizar inicialmente
      await syncTimer(gameSessionId);

      if (!timerStartTimeRef.current || !timerDurationRef.current) {
        return;
      }

      const updateTimer = () => {
        if (!timerStartTimeRef.current || !timerDurationRef.current) return;

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
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);

      // Sincronizar periódicamente cada 5 segundos
      timerSyncIntervalRef.current = setInterval(() => {
        syncTimer(gameSessionId);
      }, 5000);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const handleNextActivity = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.post(
        `/sessions/game-sessions/${sessionId}/next_activity/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;

      if (data.stage_completed) {
        toast.success('¡Etapa 2 completada! Redirigiendo a resultados...');
        setTimeout(() => navigate(`/profesor/resultados/${sessionId}`), 1500);
      } else {
        toast.success('¡Avanzando a la siguiente actividad!');
        // Redirect based on the next activity name
        const nextActivityName = data.current_activity_name?.toLowerCase() || '';
        if (nextActivityName.includes('tema') || nextActivityName.includes('seleccionar')) {
          setTimeout(() => navigate(`/profesor/etapa2/seleccionar-tema/${sessionId}`), 1500);
        } else {
          // Fallback, reload current page
          setTimeout(() => loadGameControl(), 1500);
        }
      }
    } catch (error: any) {
      toast.error('Error al avanzar a la siguiente actividad: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getBubbleMapStatus = (bubbleMap: BubbleMap | null) => {
    if (!bubbleMap) {
      return { text: '⏳ Pendiente', class: 'bg-yellow-100 text-yellow-800', status: 'pending' };
    }
    const nodes = bubbleMap.map_data?.nodes || [];
    if (nodes.length === 0) {
      return { text: '⏳ Pendiente', class: 'bg-yellow-100 text-yellow-800', status: 'pending' };
    }
    if (nodes.length >= 5) {
      return { text: '✓ Completado', class: 'bg-green-100 text-green-800', status: 'completed' };
    }
    return { text: `📝 En Progreso (${nodes.length} burbujas)`, class: 'bg-blue-100 text-blue-800', status: 'in_progress' };
  };

  if (loading && teamsWithMaps.length === 0) {
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
              Actividad Actual: {currentActivity?.name || 'Bubble Map'}
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 px-4 py-2 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> Tiempo restante: {timerRemaining}
          </div>
        </motion.div>

        {/* Stage Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-4 sm:mb-6 text-center"
        >
          <div className="text-6xl mb-4">💭</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-2">Bubble Maps</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Los equipos están creando sus mapas mentales con ideas y conceptos relacionados al desafío.
          </p>
        </motion.div>

        {/* Teams Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6"
        >
          {teamsWithMaps.map(({ team, bubbleMap }, index) => {
            const status = getBubbleMapStatus(bubbleMap);
            const nodes = bubbleMap?.map_data?.nodes || [];
            const centralNode = nodes.length > 0 ? nodes[0] : null;
            const otherNodes = nodes.slice(1);

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-4"
                style={{ borderColor: getTeamColorHex(team.color) }}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md"
                        style={{ backgroundColor: getTeamColorHex(team.color) }}
                      >
                        {team.color.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#093c92] text-base sm:text-lg">{team.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Equipo {team.color}</p>
                      </div>
                    </div>
                    {bubbleMap && nodes.length > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setPreviewMap({ team, bubbleMap })}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver mapa
                      </Button>
                    )}
                  </div>

                  <div className="mb-4">
                    <Badge className={`text-xs ${status.class}`}>
                      {status.text}
                    </Badge>
                  </div>

                  {nodes.length > 0 ? (
                    <>
                      {centralNode && (
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-xl mb-3">
                          <p className="text-xs text-gray-500 mb-1">Idea Central:</p>
                          <p className="text-[#093c92] font-semibold text-sm sm:text-base">{centralNode.text}</p>
                        </div>
                      )}
                      
                      {/* Mini preview del mapa */}
                      <div 
                        className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 mb-4 overflow-hidden"
                        style={{ borderColor: `${getTeamColorHex(team.color)}40` }}
                      >
                        {/* Idea central en el centro */}
                        {centralNode && (
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            <div
                              className="px-4 py-3 rounded-xl shadow-lg text-center text-white text-xs sm:text-sm font-semibold"
                              style={{ backgroundColor: getTeamColorHex(team.color) }}
                            >
                              {centralNode.text}
                            </div>
                          </div>
                        )}

                        {/* Otras ideas distribuidas */}
                        {otherNodes.slice(0, 5).map((node, nodeIndex) => {
                          const angle = (nodeIndex * 360) / Math.min(otherNodes.length, 5);
                          const radius = 35;
                          const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                          const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                          
                          return (
                            <div
                              key={node.id}
                              className="absolute bg-white rounded-lg p-2 border text-xs shadow-md transform -translate-x-1/2 -translate-y-1/2"
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                borderColor: `${getTeamColorHex(team.color)}60`,
                                maxWidth: '80px',
                              }}
                            >
                              <p className="text-center text-gray-700 line-clamp-2">{node.text}</p>
                            </div>
                          );
                        })}

                        {/* Líneas conectoras */}
                        {centralNode && otherNodes.length > 0 && (
                          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                            {otherNodes.slice(0, 5).map((node, nodeIndex) => {
                              const angle = (nodeIndex * 360) / Math.min(otherNodes.length, 5);
                              const radius = 35;
                              const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                              const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                              
                              return (
                                <line
                                  key={node.id}
                                  x1="50%"
                                  y1="50%"
                                  x2={`${x}%`}
                                  y2={`${y}%`}
                                  stroke={getTeamColorHex(team.color)}
                                  strokeWidth="2"
                                />
                              );
                            })}
                          </svg>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {nodes.length} ideas
                        </Badge>
                        <Badge 
                          className="text-xs text-white border-0"
                          style={{ backgroundColor: getTeamColorHex(team.color) }}
                        >
                          {team.tokens_total || 0} tokens
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-center min-h-[200px] flex items-center justify-center">
                      <p className="text-gray-400 text-sm sm:text-base italic">
                        Aún no ha creado burbujas
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Next Activity Button */}
        {allTeamsCompleted && (
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

      {/* Modal de Vista Previa */}
      {previewMap && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewMap(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <GroupBadge 
                    name={previewMap.team.name} 
                    color={getTeamColorHex(previewMap.team.color)} 
                    size="large"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewMap(null)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Bubble Map Preview */}
              <div 
                className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-4 overflow-hidden mb-4"
                style={{ borderColor: getTeamColorHex(previewMap.team.color) }}
              >
                {(() => {
                  const nodes = previewMap.bubbleMap.map_data?.nodes || [];
                  const centralNode = nodes.length > 0 ? nodes[0] : null;
                  const otherNodes = nodes.slice(1);

                  return (
                    <>
                      {/* Idea central */}
                      {centralNode && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="px-8 py-6 rounded-2xl shadow-2xl text-center text-white"
                            style={{ backgroundColor: getTeamColorHex(previewMap.team.color) }}
                          >
                            <p className="text-lg sm:text-xl font-bold">{centralNode.text}</p>
                          </motion.div>
                        </div>
                      )}

                      {/* Ideas secundarias */}
                      {otherNodes.map((node, idx) => {
                        const angle = (idx * 360) / Math.max(otherNodes.length, 1);
                        const radius = 35;
                        const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                        const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                        return (
                          <motion.div
                            key={node.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="absolute bg-white rounded-xl shadow-lg p-3 sm:p-4 border-2 transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              borderColor: `${getTeamColorHex(previewMap.team.color)}80`,
                              maxWidth: '150px',
                            }}
                          >
                            <p className="text-xs sm:text-sm text-gray-700 text-center">{node.text}</p>
                          </motion.div>
                        );
                      })}

                      {/* Líneas conectoras */}
                      {centralNode && otherNodes.length > 0 && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          {otherNodes.map((node, idx) => {
                            const angle = (idx * 360) / Math.max(otherNodes.length, 1);
                            const radius = 35;
                            const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                            const y = 50 + radius * Math.sin((angle * Math.PI) / 180);

                            return (
                              <line
                                key={node.id}
                                x1="50%"
                                y1="50%"
                                x2={`${x}%`}
                                y2={`${y}%`}
                                stroke={getTeamColorHex(previewMap.team.color)}
                                strokeWidth="2"
                                opacity="0.3"
                              />
                            );
                          })}
                        </svg>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="text-center">
                <Badge variant="outline" className="text-base px-6 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {previewMap.bubbleMap.map_data?.nodes?.length || 0} ideas totales
                </Badge>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

