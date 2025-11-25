import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, Loader2, CheckCircle2, XCircle, Gamepad2, Coins, Hand, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EtapaIntroModal } from '@/components/EtapaIntroModal';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import { toast } from 'sonner';
import { tabletConnectionsAPI, sessionsAPI, teamPersonalizationsAPI } from '@/services';

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
  const [showEtapaIntro, setShowEtapaIntro] = useState(false);
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
      let statusData;
      try {
        statusData = await tabletConnectionsAPI.getStatus(connId);
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error('Conexión no encontrada. Por favor reconecta.');
          setTimeout(() => {
            navigate('/tablet/join');
          }, 3000);
        }
        return;
      }
      setTeam(statusData.team);

      // Verificar estado del juego
      const gameData = await sessionsAPI.getById(statusData.game_session.id);
      const sessionId = statusData.game_session.id;
      setGameSessionId(sessionId);

      // Verificar si debemos mostrar la intro de la etapa
      if (gameData.current_stage_number === 1) {
        const introKey = `tablet_etapa_intro_${sessionId}_1`;
        const hasSeenIntro = localStorage.getItem(introKey);
        if (!hasSeenIntro) {
          setShowEtapaIntro(true);
        }
      }

      // Verificar si el juego ha finalizado o está en lobby
      // Si la sesión finaliza, redirigir al join (excepto en reflexión)
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
          try {
            const persList = await teamPersonalizationsAPI.list({ team: statusData.team.id });
            const persResults = Array.isArray(persList) ? persList : [persList];
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
          } catch (error) {
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
      try {
        const persList = await teamPersonalizationsAPI.list({ team: statusData.team.id });
        const persResults = Array.isArray(persList) ? persList : [persList];
        if (persResults.length > 0) {
          const existingPers = persResults[0];
          setPersonalization(existingPers);
          setTeamName(existingPers.team_name || '');
          setKnowEachOther(existingPers.team_members_know_each_other);
          setSubmitted(true);
        }
      } catch (error) {
        console.error('Error loading personalization:', error);
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
      const timerData = await sessionsAPI.getActivityTimer(gameSessionId);
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
        timeExpiredRef.current = true;
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
          timeExpiredRef.current = true;
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
      await teamPersonalizationsAPI.createOrUpdate({
        team: team.id,
        team_name: teamName.trim(),
        team_members_know_each_other: knowEachOther,
      });

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
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Fondo animado igual que Panel */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Efectos de partículas adicionales */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              }}
              animate={{
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 p-3 sm:p-4">
        <div className="max-w-6xl mx-auto relative z-20">
        {/* Header Mejorado */}
        <div className="bg-white rounded-xl shadow-xl p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0"
                style={{ backgroundColor: getTeamColorHex(team.color) }}
              >
                {team.color.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">{team.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Equipo {team.color}</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-3 py-1.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 flex-shrink-0 shadow-sm">
              <Coins className="w-4 h-4" />
              <span>{team.tokens_total || 0}</span>
            </div>
          </div>
        </div>

        {/* Formulario Mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-4 sm:p-6"
        >
          {/* Título y Descripción */}
          <div className="mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-2">
              1. Personalización del Equipo
            </h2>
            <p className="text-gray-600 text-sm">
              Define el nombre de tu equipo y si ya se conocen entre ustedes
            </p>
          </div>

          {/* Temporizador Mejorado */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 mb-4 sm:mb-5">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-yellow-700" />
              <span className="text-yellow-800 font-semibold text-sm sm:text-base">
                Tiempo restante: <span className="font-bold">{timerRemaining}</span>
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Campo Nombre del Equipo */}
            <div className="space-y-2">
              <Label htmlFor="teamName" className="text-[#093c92] font-semibold text-sm">
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
                className="h-11 sm:h-12 text-sm sm:text-base border-2 focus:border-[#093c92]"
              />
            </div>

            {/* Pregunta sobre conocimiento */}
            <div className="space-y-3">
              <Label className="text-[#093c92] font-semibold text-sm sm:text-base block">
                ¿Los miembros del equipo ya se conocen?
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  onClick={() => !submitted && !submitting && setKnowEachOther(true)}
                  disabled={submitted || submitting}
                  whileHover={!submitted && !submitting ? { scale: 1.02 } : {}}
                  whileTap={!submitted && !submitting ? { scale: 0.98 } : {}}
                  className={`p-4 sm:p-5 rounded-xl border-2 transition-all text-center font-semibold text-sm sm:text-base flex flex-col items-center justify-center gap-2 ${
                    knowEachOther === true
                      ? 'bg-[#093c92] text-white border-[#093c92] shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#093c92] hover:bg-blue-50'
                  } ${submitted || submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Hand className={`w-8 h-8 sm:w-10 sm:h-10 ${knowEachOther === true ? 'text-white' : 'text-[#093c92]'}`} />
                  <span>Ya nos conocemos</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => !submitted && !submitting && setKnowEachOther(false)}
                  disabled={submitted || submitting}
                  whileHover={!submitted && !submitting ? { scale: 1.02 } : {}}
                  whileTap={!submitted && !submitting ? { scale: 0.98 } : {}}
                  className={`p-4 sm:p-5 rounded-xl border-2 transition-all text-center font-semibold text-sm sm:text-base flex flex-col items-center justify-center gap-2 ${
                    knowEachOther === false
                      ? 'bg-[#093c92] text-white border-[#093c92] shadow-lg'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-[#093c92] hover:bg-blue-50'
                  } ${submitted || submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <UserPlus className={`w-8 h-8 sm:w-10 sm:h-10 ${knowEachOther === false ? 'text-white' : 'text-[#093c92]'}`} />
                  <span>No nos conocemos</span>
                </motion.button>
              </div>
            </div>

            {/* Botón Entregar Mejorado */}
            <Button
              type="submit"
              disabled={submitted || submitting}
              className="w-full h-12 sm:h-14 bg-[#093c92] hover:bg-[#072e73] text-white text-sm sm:text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
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

      {/* Modal de Introducción de Etapa */}
      <EtapaIntroModal
        etapaNumero={1}
        isOpen={showEtapaIntro}
        onClose={() => {
          setShowEtapaIntro(false);
          // Guardar en localStorage que se vio la intro
          if (gameSessionId) {
            localStorage.setItem(`tablet_etapa_intro_${gameSessionId}_1`, 'true');
          }
        }}
      />

      {/* Música de fondo */}
      <BackgroundMusic storageKey="tablet_backgroundMusicEnabled" />
    </div>
  );
}

