import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, Loader2, CheckCircle2, XCircle, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total?: number;
}

interface Personalization {
  id?: number;
  team_name?: string;
  team_members_know_each_other?: boolean;
}

export function TabletPersonalizacion() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [personalization, setPersonalization] = useState<Personalization | null>(null);
  const [teamName, setTeamName] = useState('');
  const [knowEachOther, setKnowEachOther] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);
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
    loadTeamInfo(connId);

    // Polling cada 5 segundos
    intervalRef.current = setInterval(() => {
      loadTeamInfo(connId);
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

  // Reset timeExpired cuando cambia la actividad
  useEffect(() => {
    timeExpiredRef.current = false;
  }, [currentActivityId]);

  const loadTeamInfo = async (connId: string) => {
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
        toast.info('El juego no ha iniciado. Redirigiendo al lobby...');
        setTimeout(() => {
          navigate(`/tablet/lobby?connection_id=${connId}`);
        }, 2000);
        return;
      }

      // Verificar actividad actual
      const currentActivityName = gameData.current_activity_name?.toLowerCase() || '';
      const currentStageNumber = gameData.current_stage_number;

      if (currentStageNumber !== 1 || !currentActivityName.includes('personaliz')) {
        // Redirigir según la actividad actual
        if (currentStageNumber === 1 && currentActivityName.includes('presentaci')) {
          // Verificar si se conocen para redirigir a presentación o minijuego
          const persResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-personalizations/?team=${statusData.team.id}`
          );
          
          if (persResponse.ok) {
            const persData = await persResponse.json();
            const persResults = Array.isArray(persData.results) ? persData.results : (Array.isArray(persData) ? persData : []);
            if (persResults.length > 0) {
              const personalization = persResults[0];
              const knowsEachOther = personalization.team_members_know_each_other;
              
              // Si se conocen → minijuego, si no se conocen → presentación
              if (knowsEachOther === true) {
                window.location.href = `/tablet/etapa1/minijuego/?connection_id=${connId}`;
              } else {
                window.location.href = `/tablet/etapa1/presentacion/?connection_id=${connId}`;
              }
            } else {
              // Si no hay personalización, redirigir a presentación por defecto
              window.location.href = `/tablet/etapa1/presentacion/?connection_id=${connId}`;
            }
          } else {
            // Si no se puede obtener personalización, redirigir a presentación por defecto
            window.location.href = `/tablet/etapa1/presentacion/?connection_id=${connId}`;
          }
        } else {
          window.location.href = `/tablet/lobby?connection_id=${connId}`;
        }
        return;
      }

      setCurrentActivityId(gameData.current_activity);

      // Obtener personalización existente
      const persResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-personalizations/?team=${statusData.team.id}`
      );

      if (persResponse.ok) {
        const persData = await persResponse.json();
        const persResults = Array.isArray(persData.results) ? persData.results : (Array.isArray(persData) ? persData : []);
        if (persResults.length > 0) {
          const existingPers = persResults[0];
          setPersonalization(existingPers);
          setTeamName(existingPers.team_name || '');
          setKnowEachOther(existingPers.team_members_know_each_other);
          setSubmitted(true);
        }
      }

      // Iniciar temporizador solo si no está ya iniciado o si cambió la actividad
      if (gameData.current_activity) {
        if (gameData.current_activity !== currentActivityId) {
          // Si cambió la actividad, resetear el estado de tiempo agotado
          timeExpiredRef.current = false;
          // Limpiar intervalo anterior si existe
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
          startTimer(gameData.current_activity, statusData.game_session.id);
        } else if (!timerIntervalRef.current) {
          // Si no hay intervalo pero es la misma actividad, iniciar
          startTimer(gameData.current_activity, statusData.game_session.id);
        }
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading team info:', error);
      toast.error('Error de conexión: ' + (error.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  const startTimer = async (activityId: number, gameSessionId: number) => {
    // Si ya hay un intervalo corriendo, no iniciar otro
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

      // Verificar si el tiempo ya expiró antes de iniciar el intervalo
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, timerDuration - elapsed);

      if (remaining <= 0) {
        setTimerRemaining('00:00');
        // Solo mostrar la notificación una vez si aún no se ha mostrado
        if (!timeExpiredRef.current) {
          timeExpiredRef.current = true;
          toast.error('⏱️ ¡Tiempo agotado!', {
            duration: 5000,
          });
        }
        return; // No iniciar el intervalo si ya expiró
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
          
          // Solo mostrar la notificación una vez
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error('Por favor ingresa un nombre para el equipo');
      return;
    }

    if (knowEachOther === null) {
      toast.error('Por favor selecciona si se conocen o no');
      return;
    }

    if (!team || !connectionId) return;

    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-personalizations/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            team: team.id,
            team_name: teamName.trim(),
            team_members_know_each_other: knowEachOther,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar personalización');
      }

      toast.success('✓ Personalización guardada exitosamente');
      setSubmitted(true);
      
      // Recargar información del equipo
      setTimeout(() => {
        loadTeamInfo(connectionId);
      }, 1000);
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
              1. Personalización del Equipo
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              Define el nombre de tu equipo y si ya se conocen entre ustedes
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-[#093c92] font-semibold text-sm sm:text-base">
                Nombre del Equipo
              </Label>
              <Input
                id="teamName"
                type="text"
                placeholder="Ej: Los Emprendedores, Los Innovadores..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                maxLength={100}
                required
                disabled={submitted || submitting}
                className="h-12 sm:h-14 text-base sm:text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#093c92] font-semibold text-sm sm:text-base">
                ¿Los miembros del equipo ya se conocen?
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => !submitted && !submitting && setKnowEachOther(true)}
                  disabled={submitted || submitting}
                  className={`p-6 rounded-xl border-3 transition-all text-center font-semibold text-base sm:text-lg ${
                    knowEachOther === true
                      ? 'bg-[#093c92] text-white border-[#093c92] shadow-lg'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#093c92] hover:bg-gray-50'
                  } ${submitted || submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="text-4xl block mb-2">👋</span>
                  Ya nos conocemos
                </button>
                <button
                  type="button"
                  onClick={() => !submitted && !submitting && setKnowEachOther(false)}
                  disabled={submitted || submitting}
                  className={`p-6 rounded-xl border-3 transition-all text-center font-semibold text-base sm:text-lg ${
                    knowEachOther === false
                      ? 'bg-[#093c92] text-white border-[#093c92] shadow-lg'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#093c92] hover:bg-gray-50'
                  } ${submitted || submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="text-4xl block mb-2">👥</span>
                  No nos conocemos
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitted || submitting}
              className="w-full h-12 sm:h-14 bg-[#093c92] hover:bg-[#072e73] text-white text-base sm:text-lg font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : submitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  ✓ Entregado
                </>
              ) : (
                'Entregar Personalización'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

