import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  Clock,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Upload,
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

interface TeamProgress {
  team: Team;
  progress: {
    id: number;
    status: string;
    prototype_image_url?: string;
    completed_at?: string;
  } | null;
}

interface GameSession {
  id: number;
  room_code: string;
  status: string;
  current_activity?: number;
  current_stage?: number;
  current_stage_number?: number;
  current_activity_name?: string | null;
}

export function ProfesorPrototipo() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [teamsWithProgress, setTeamsWithProgress] = useState<TeamProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerStartTimeRef = useRef<number | null>(null);
  const timerDurationRef = useRef<number | null>(null);

  useEffect(() => {
    if (sessionId) {
      loadGameControl();

      // Auto-refresh cada 3 segundos
      intervalRef.current = setInterval(() => {
        loadGameControl();
      }, 3000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        if (timerSyncIntervalRef.current) {
          clearInterval(timerSyncIntervalRef.current);
        }
      };
    }
  }, [sessionId]);

  const loadGameControl = async () => {
    if (!sessionId) return;

    try {
      const sessionResponse = await api.get(`/sessions/game-sessions/${sessionId}/`);
      const gameData: GameSession = sessionResponse.data;
      setGameSession(gameData);

      // Verificar que estamos en la etapa correcta
      const currentStageNumber = gameData.current_stage_number || 1;
      if (currentStageNumber !== 3) {
        // Redirigir a la etapa actual
        if (currentStageNumber === 4) {
          const currentActivityName = gameData.current_activity_name?.toLowerCase() || '';
          if (currentActivityName.includes('pitch') && currentActivityName.includes('formulario')) {
            window.location.replace(`/profesor/etapa4/formulario-pitch/${sessionId}/`);
          } else if (currentActivityName.includes('pitch') && currentActivityName.includes('presentacion')) {
            window.location.replace(`/profesor/etapa4/presentacion-pitch/${sessionId}/`);
          } else {
            window.location.replace(`/profesor/etapa4/formulario-pitch/${sessionId}/`);
          }
        } else if (currentStageNumber === 2) {
          window.location.replace(`/profesor/etapa2/seleccionar-tema/${sessionId}/`);
        } else if (currentStageNumber === 1) {
          window.location.replace(`/profesor/etapa1/personalizacion/${sessionId}/`);
        } else {
          window.location.replace(`/profesor/panel`);
        }
        return;
      }

      if (gameData.current_activity && !timerIntervalRef.current) {
        await startTimer(gameData.current_activity, parseInt(sessionId));
      }

      await loadTeamsPrototypes();
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading game control:', error);
      if (error.response?.status === 401) {
        navigate('/profesor/login');
      } else {
        toast.error('Error de conexión: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
      }
      setLoading(false);
    }
  };

  const loadTeamsPrototypes = async () => {
    if (!sessionId) return;

    try {
      const teamsResponse = await api.get(`/sessions/game-sessions/${sessionId}/teams/`);
      const teams = teamsResponse.data;

      const sessionResponse = await api.get(`/sessions/game-sessions/${sessionId}/`);
      const sessionData = sessionResponse.data;

      if (!sessionData.current_stage) {
        return;
      }

      // Obtener session_stage para la etapa actual (Etapa 3: Creatividad)
      const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${sessionId}`);
      const stagesData = stagesResponse.data;
      const sessionStages = Array.isArray(stagesData) ? stagesData : stagesData.results || [];

      // Buscar el session_stage de la Etapa 3 (Creatividad)
      const sessionStage = sessionStages.find((s: any) => s.stage_number === 3) || 
                          sessionStages.find((s: any) => s.stage === sessionData.current_stage);

      if (!sessionStage) {
        console.warn('⚠️ No se encontró session_stage para Etapa 3');
        return;
      }

      const activityResponse = await api.get(`/challenges/activities/${sessionData.current_activity}/`);
      const activity = activityResponse.data;

      const progressPromises = teams.map(async (team: Team) => {
        try {
          let progressResponse = await api.get(
            `/sessions/team-activity-progress/?team=${team.id}&activity=${activity.id}&session_stage=${sessionStage.id}`
          );

          if (!progressResponse.ok) {
            progressResponse = await api.get(
              `/sessions/team-activity-progress/?team=${team.id}&activity=${activity.id}`
            );
          }

          const progressData = progressResponse.data;
          const progressArray = Array.isArray(progressData) ? progressData : progressData.results || [];

          let progress = null;
          if (progressArray.length > 0) {
            progress = progressArray.find((p: any) => p.session_stage === sessionStage.id) ||
                      progressArray.find((p: any) => {
                        return p.stage_name && p.stage_name.toLowerCase().includes('creatividad');
                      }) ||
                      progressArray[0];
          }

          return { team, progress };
        } catch (error) {
          console.error(`Error al obtener progreso para equipo ${team.name}:`, error);
          return { team, progress: null };
        }
      });

      const teamsWithProgressData = await Promise.all(progressPromises);
      setTeamsWithProgress(teamsWithProgressData);
    } catch (error: any) {
      console.error('Error loading teams prototypes:', error);
      toast.error('Error al cargar prototipos: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
    }
  };

  const syncTimer = async (gameSessionId: number) => {
    try {
      const response = await api.get(`/sessions/game-sessions/${gameSessionId}/activity_timer/`);
      const data = response.data;

      if (data.started_at && data.timer_duration) {
        timerStartTimeRef.current = new Date(data.started_at).getTime();
        timerDurationRef.current = data.timer_duration;
      }
    } catch (error) {
      console.error('Error sincronizando timer:', error);
    }
  };

  const startTimer = async (activityId: number, gameSessionId: number) => {
    try {
      await syncTimer(gameSessionId);

      if (timerSyncIntervalRef.current) {
        clearInterval(timerSyncIntervalRef.current);
      }

      timerSyncIntervalRef.current = setInterval(() => {
        syncTimer(gameSessionId);
      }, 5000);

      const updateTimer = () => {
        if (!timerStartTimeRef.current || !timerDurationRef.current) return;

        const now = Date.now();
        const elapsed = Math.floor((now - timerStartTimeRef.current) / 1000);
        const remaining = Math.max(0, timerDurationRef.current - elapsed);

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        setTimerRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

        if (remaining === 0 && timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
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

    setAdvancing(true);
    try {
      const response = await api.post(`/sessions/game-sessions/${sessionId}/next_activity/`);

      if (response.data.stage_completed) {
        navigate(`/profesor/resultados/${sessionId}/?stage_id=${response.data.stage_id}`);
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Error advancing activity:', error);
      toast.error('Error al avanzar: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
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

  const getStatusBadge = (status: string | undefined) => {
    if (!status) {
      return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pendiente</Badge>;
    }

    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">✓ Completado</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-800">📷 Prototipo subido</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">⏳ Pendiente</Badge>;
    }
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
              🧱 Etapa 3: Creatividad
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Código de sala: <span className="font-semibold">{gameSession.room_code}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleNextActivity}
              disabled={advancing}
              className="w-full sm:w-auto"
            >
              {advancing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Avanzando...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Continuar
                </>
              )}
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
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-2xl text-4xl sm:text-5xl">
              🧱
            </div>
          </motion.div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#093c92] mb-2">
            Prototipos de Lego
          </h2>
          <p className="text-gray-600 text-base sm:text-lg mb-4">
            Los equipos están construyendo y subiendo fotos de sus prototipos físicos.
          </p>

          {/* Temporizador */}
          {timerRemaining !== '--:--' && (
            <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 px-4 py-2 rounded-xl font-semibold text-sm sm:text-base inline-flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> Tiempo restante: {timerRemaining}
            </div>
          )}
        </motion.div>

        {/* Grid de Equipos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {teamsWithProgress.map(({ team, progress }, index) => {
            const hasImage = progress?.prototype_image_url && progress.prototype_image_url.trim() !== '';
            const imageUrl = progress?.prototype_image_url || '';

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  {/* Header del Equipo */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-100">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-md"
                      style={{ backgroundColor: getTeamColorHex(team.color) }}
                    >
                      {team.color.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm sm:text-base text-[#093c92]">{team.name}</h3>
                      <p className="text-xs text-gray-600">Equipo {team.color}</p>
                    </div>
                  </div>

                  {/* Imagen del Prototipo */}
                  <div className="mb-4">
                    {hasImage ? (
                      <div className="relative group">
                        <img
                          src={imageUrl.startsWith('/') ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}${imageUrl}` : imageUrl}
                          alt={`Prototipo ${team.name}`}
                          className="w-full h-48 sm:h-64 object-contain rounded-lg bg-gray-50 p-2 border-2 border-gray-200"
                          onError={(e) => {
                            console.error('Error cargando imagen del prototipo:', imageUrl);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                          onLoad={() => {
                            console.log('✅ Imagen del prototipo cargada:', imageUrl);
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 sm:h-64 bg-gray-50 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm text-center px-4">Aún no ha subido el prototipo</p>
                      </div>
                    )}
                  </div>

                  {/* Estado */}
                  <div className="flex justify-center">
                    {getStatusBadge(progress?.status)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {teamsWithProgress.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 text-center"
          >
            <p className="text-gray-600 text-lg">No hay equipos disponibles</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

