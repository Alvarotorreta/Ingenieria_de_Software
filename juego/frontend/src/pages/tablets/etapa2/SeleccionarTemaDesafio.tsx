import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Loader2,
  Award,
  Target,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { toast } from 'sonner';

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total?: number;
}

interface Topic {
  id: number;
  name: string;
  icon?: string;
  description?: string;
}

interface Challenge {
  id: number;
  title: string;
  icon?: string;
  persona_name?: string;
  persona_age?: number;
  persona_story?: string;
  description?: string;
}

interface GameSession {
  id: number;
  status: string;
  current_activity?: number;
  current_activity_name?: string;
  current_stage_number?: number;
  course?: number;
}

type Step = 'topic' | 'challenge';

export function TabletSeleccionarTemaDesafio() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<Step>('topic');
  const [topics, setTopics] = useState<Topic[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [pendingTopicId, setPendingTopicId] = useState<number | null>(null);
  const [pendingChallengeId, setPendingChallengeId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);
  const [sessionStageId, setSessionStageId] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeExpiredRef = useRef<boolean>(false);
  const scrollPositionRef = useRef<number>(0);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    loadGameState(connId, true); // Carga inicial

    intervalRef.current = setInterval(() => {
      loadGameState(connId, false); // Polling periódico, no forzar cambio de paso
    }, 3000); // Polling más frecuente para detectar cambios más rápido

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [searchParams, navigate]);

  useEffect(() => {
    timeExpiredRef.current = false;
  }, [currentActivityId]);

  const loadGameState = async (connId: string, isInitialLoad: boolean = false) => {
    try {
      const statusResponse = await api.get(
        `/sessions/tablet-connections/status/?connection_id=${connId}`
      );

      const statusData = statusResponse.data;
      setTeam(statusData.team);
      setGameSessionId(statusData.game_session.id);

      const gameResponse = await api.get(
        `/sessions/game-sessions/${statusData.game_session.id}/`
      );

      const gameData: GameSession = gameResponse.data;

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

      const currentActivityName = gameData.current_activity_name?.toLowerCase() || '';
      const currentStageNumber = gameData.current_stage_number;
      const currentActivityId = gameData.current_activity;

      // Verificar si la actividad cambió a bubble map (ANTES de verificar la etapa)
      // Esto es crítico para detectar cambios inmediatamente
      if (currentStageNumber === 2 && currentActivityId) {
        const normalizedActivityName = currentActivityName.toLowerCase().trim();
        console.log('📊 Tablet - Verificando actividad:', {
          name: normalizedActivityName,
          activityId: currentActivityId,
          stage: currentStageNumber
        });
        
        if (normalizedActivityName.includes('bubble') || 
            normalizedActivityName.includes('mapa') || 
            normalizedActivityName.includes('mapa mental') ||
            normalizedActivityName.includes('bubble map') ||
            normalizedActivityName.includes('bubblemap')) {
          console.log('✅ Tablet - Redirigiendo a bubble-map');
          window.location.href = `/tablet/etapa2/bubble-map/?connection_id=${connId}`;
          return;
        }
      }

      if (currentStageNumber !== 2) {
        // El profesor avanzó a otra etapa, redirigir según la etapa
        if (currentStageNumber === 3) {
          const normalizedName = currentActivityName;
          if (normalizedName.includes('prototipo') || normalizedName.includes('lego')) {
            window.location.href = `/tablet/etapa3/prototipo/?connection_id=${connId}`;
          } else {
            window.location.href = `/tablet/etapa3/resultados/?connection_id=${connId}`;
          }
        } else if (currentStageNumber === 4) {
          const normalizedName = currentActivityName;
          if (normalizedName.includes('formulario') || normalizedName.includes('pitch')) {
            window.location.href = `/tablet/etapa4/formulario-pitch/?connection_id=${connId}`;
          } else {
            window.location.href = `/tablet/lobby?connection_id=${connId}`;
          }
        } else {
          window.location.href = `/tablet/lobby?connection_id=${connId}`;
        }
        return;
      }

      if (currentStageNumber === 2 && (!currentActivityName || currentActivityName.includes('resultados'))) {
        window.location.href = `/tablet/etapa2/resultados/?connection_id=${connId}`;
        return;
      }

      setCurrentActivityId(gameData.current_activity);

      // Obtener session_stage de Etapa 2
      let currentSessionStageId = sessionStageId;
      if (!currentSessionStageId && gameData.current_activity) {
        try {
          const stagesResponse = await api.get(
            `/sessions/session-stages/?game_session=${statusData.game_session.id}`
          );
          const stagesData = stagesResponse.data;
          const stages = stagesData.results || stagesData;
          const stage2 = stages.find((s: any) => s.stage_number === 2);
          if (stage2) {
            currentSessionStageId = stage2.id;
            setSessionStageId(stage2.id);
          }
        } catch (error) {
          console.error('Error loading session stages:', error);
        }
      }

      // Cargar progreso existente (solo en la carga inicial o si hay desafío confirmado)
      if (gameData.current_activity && statusData.team.id && currentSessionStageId) {
        // Esperar un momento para asegurar que sessionStageId esté disponible
        await new Promise(resolve => setTimeout(resolve, 300));
        await loadProgress(
          statusData.team.id,
          gameData.current_activity,
          currentSessionStageId,
          statusData.game_session.id,
          isInitialLoad // Solo forzar cambio de paso en la carga inicial
        );
      }

      // Iniciar temporizador
      if (gameData.current_activity) {
        startTimer(gameData.current_activity, statusData.game_session.id);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading game state:', error);
      toast.error('Error de conexión: ' + (error.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  const loadProgress = async (teamId: number, activityId: number, stageId: number, gameSessionId: number, forceUpdateStep: boolean = false) => {
    try {
      const progressResponse = await api.get(
        `/sessions/team-activity-progress/?team=${teamId}&activity=${activityId}&session_stage=${stageId}`
      );

      const progressData = progressResponse.data;
      const progress = Array.isArray(progressData) ? progressData[0] : progressData.results?.[0];

      console.log('📊 Progress loaded:', {
        hasProgress: !!progress,
        selectedTopic: progress?.selected_topic,
        selectedChallenge: progress?.selected_challenge,
        status: progress?.status
      });

      if (progress) {
        // Si hay desafío seleccionado, entonces el tema también está confirmado
        if (progress.selected_challenge) {
          const challenge = typeof progress.selected_challenge === 'object' 
            ? progress.selected_challenge 
            : { id: progress.selected_challenge };
          
          // Si hay tema seleccionado, marcarlo como confirmado y cargar desafíos
          if (progress.selected_topic) {
            const topic = typeof progress.selected_topic === 'object' 
              ? progress.selected_topic 
              : { id: progress.selected_topic };
            setSelectedTopic(topic as Topic);
            setPendingTopicId(null); // Limpiar pendingTopicId ya que está confirmado
            
            // Cargar desafíos primero para que el desafío seleccionado esté en la lista
            await loadChallenges(topic.id);
            
            // Ahora establecer el desafío seleccionado
            setSelectedChallenge(challenge as Challenge);
            setPendingChallengeId(null); // Limpiar pendingChallengeId ya que está confirmado
            
            // Cambiar al paso de desafíos si hay desafío confirmado
            if (forceUpdateStep || currentStep === 'topic') {
              setCurrentStep('challenge');
            }
          } else {
            // Si hay desafío pero no tema, algo está mal, pero igual establecer el desafío
            setSelectedChallenge(challenge as Challenge);
            setPendingChallengeId(null);
          }
        } else if (progress.selected_topic) {
          // Si solo hay tema pero no desafío, mantenerlo como pendiente
          const topic = typeof progress.selected_topic === 'object' 
            ? progress.selected_topic 
            : { id: progress.selected_topic };
          setPendingTopicId(topic.id);
          setSelectedTopic(null); // Asegurar que no esté marcado como seleccionado
          setSelectedChallenge(null); // Asegurar que no haya desafío seleccionado
          
          // Cargar desafíos pero NO cambiar automáticamente al paso de desafíos
          // El usuario debe navegar manualmente desde temas a desafíos
          await loadChallenges(topic.id);
          // NO cambiar automáticamente a 'challenge' - siempre quedarse en 'topic'
          // Solo si hay desafío confirmado se cambia a 'challenge'
        } else {
          // No hay tema ni desafío seleccionado, asegurar que estemos en el paso de temas
          setSelectedTopic(null);
          setSelectedChallenge(null);
          setPendingTopicId(null);
          setPendingChallengeId(null);
          if (forceUpdateStep) {
            setCurrentStep('topic');
          }
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const loadTopics = async (gameSessionId: number) => {
    try {
      // Obtener información de la sesión para obtener la facultad
      const sessionResponse = await api.get(`/sessions/game-sessions/${gameSessionId}/`);
      const sessionData = sessionResponse.data;

      // Obtener course para obtener la facultad
      const courseResponse = await api.get(`/academic/courses/${sessionData.course}/`);
      const courseData = courseResponse.data;

      if (!courseData.career) {
        toast.error('Error: No se pudo obtener la información de la carrera');
        return;
      }

      // Obtener la carrera para obtener el ID de la facultad
      const careerResponse = await api.get(`/academic/careers/${courseData.career}/`);
      const careerData = careerResponse.data;

      if (!careerData.faculty) {
        toast.error('Error: No se pudo obtener la información de la facultad');
        return;
      }

      const facultyId = careerData.faculty;

      // Obtener temas filtrados por facultad
      const topicsResponse = await api.get(`/challenges/topics/?faculty=${facultyId}`);
      const topicsData = topicsResponse.data;
      const topicsList = topicsData.results || topicsData;
      setTopics(topicsList);
    } catch (error: any) {
      console.error('Error loading topics:', error);
      toast.error('Error al cargar temas: ' + (error.message || 'Error desconocido'));
    }
  };

  const loadChallenges = async (topicId: number) => {
    try {
      const challengesResponse = await api.get(`/challenges/challenges/?topic=${topicId}`);
      const challengesData = challengesResponse.data;
      const challengesList = challengesData.results || challengesData;
      setChallenges(challengesList);
    } catch (error: any) {
      console.error('Error loading challenges:', error);
      toast.error('Error al cargar desafíos: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
    }
  };

  const handleTopicSelect = async (topic: Topic) => {
    // Solo permitir cambiar tema si no hay desafío confirmado
    if (selectedChallenge) {
      toast.error('Ya has confirmado un desafío. No puedes cambiar el tema.');
      return;
    }

    if (!team || !currentActivityId || !sessionStageId) {
      toast.error('Error: Faltan datos necesarios');
      return;
    }

    // Establecer el tema pendiente
    setPendingTopicId(topic.id);
    
    // Guardar el tema en el backend como pendiente (para que el profesor lo vea)
    try {
      await api.post('/sessions/team-activity-progress/select_topic/', {
        team: team.id,
        activity: currentActivityId,
        session_stage: sessionStageId,
        topic: topic.id,
      });
    } catch (error: any) {
      console.error('Error saving topic:', error);
      // No mostrar error al usuario, solo loguear
      // El tema se guardará cuando se confirme el desafío
    }
    
    // Cargar desafíos del tema seleccionado
    try {
      await loadChallenges(topic.id);
      
      // Cambiar al paso de desafíos
      setCurrentStep('challenge');
    } catch (error: any) {
      toast.error('Error al cargar desafíos: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
      setPendingTopicId(null);
    }
  };

  const handleChallengeSelect = (challenge: Challenge, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (selectedChallenge) {
      toast.error('Ya has confirmado un desafío. No puedes cambiarlo.');
      return;
    }
    // Guardar posición del scroll antes de cambiar el estado
    scrollPositionRef.current = window.scrollY || document.documentElement.scrollTop || window.pageYOffset;
    setPendingChallengeId(challenge.id);
  };

  // Efecto para mantener la posición del scroll cuando cambia pendingChallengeId
  useEffect(() => {
    if (pendingChallengeId !== null) {
      // Usar múltiples requestAnimationFrame para asegurar que el scroll se mantenga
      // después de que el DOM se actualice completamente (incluyendo animaciones)
      const restoreScroll = () => {
        const savedPosition = scrollPositionRef.current;
        if (savedPosition !== undefined && savedPosition !== null) {
          window.scrollTo({
            top: savedPosition,
            behavior: 'instant'
          });
          // También restaurar en documentElement y body por compatibilidad
          document.documentElement.scrollTop = savedPosition;
          if (document.body) {
            document.body.scrollTop = savedPosition;
          }
        }
      };

      // Restaurar inmediatamente
      restoreScroll();
      
      // Restaurar después del primer frame de animación
      requestAnimationFrame(() => {
        restoreScroll();
        // Restaurar después de que la animación de altura termine
        setTimeout(() => {
          restoreScroll();
        }, 100);
      });
    }
  }, [pendingChallengeId]);

  const handleChallengeConfirm = async () => {
    if (!pendingChallengeId || !team || !currentActivityId || !sessionStageId) {
      toast.error('Error: Faltan datos necesarios');
      return;
    }

    setSubmitting(true);
    try {
      // Confirmar el desafío - el backend automáticamente guardará el tema del desafío
      const challengeResponse = await api.post('/sessions/team-activity-progress/select_challenge/', {
        team: team.id,
        activity: currentActivityId,
        session_stage: sessionStageId,
        challenge: pendingChallengeId,
        // El tema es opcional, el backend lo obtendrá del desafío
        ...(pendingTopicId && { topic: pendingTopicId }),
      });

      // El desafío puede venir en la respuesta o buscarlo en la lista
      let challenge = challenges.find((c) => c.id === pendingChallengeId);
      
      // Si no está en la lista, puede venir en la respuesta del backend
      if (!challenge && challengeResponse.data?.selected_challenge) {
        challenge = challengeResponse.data.selected_challenge as Challenge;
      }
      
      if (challenge) {
        setSelectedChallenge(challenge);
        setPendingChallengeId(null);
        
        // El tema viene del desafío o de la respuesta del backend
        if (challengeResponse.data?.selected_topic) {
          const topic = challengeResponse.data.selected_topic as Topic;
          setSelectedTopic(topic);
          setPendingTopicId(null);
        } else if (pendingTopicId) {
          // Si tenemos el pendingTopicId, usarlo
          const topic = topics.find((t) => t.id === pendingTopicId);
          if (topic) {
            setSelectedTopic(topic);
          }
          setPendingTopicId(null);
        }
        
        // Recargar el progreso para asegurar que se actualice correctamente
        if (team.id && currentActivityId && sessionStageId) {
          // Esperar un momento para que el backend procese y guarde
          await new Promise(resolve => setTimeout(resolve, 500));
          await loadProgress(team.id, currentActivityId, sessionStageId, gameSessionId || 0, true);
        }
        
        toast.success('✓ Desafío y tema confirmados exitosamente');
        
        // Reload game state to update UI después de un pequeño delay
        if (connectionId) {
          setTimeout(() => {
            loadGameState(connectionId, false);
          }, 1000);
        }
      } else {
        toast.error('Error: No se pudo encontrar el desafío confirmado');
      }
    } catch (error: any) {
      console.error('Error selecting challenge:', error);
      toast.error('Error al seleccionar desafío: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
    } finally {
      setSubmitting(false);
    }
  };

  const startTimer = async (activityId: number, gameSessionId: number) => {
    if (timerIntervalRef.current) {
      return;
    }

    try {
      const timerResponse = await api.get(
        `/sessions/game-sessions/${gameSessionId}/activity_timer/`
      );

      const timerData = timerResponse.data;
      if (timerData.error || !timerData.timer_duration) return;

      const timerDuration = timerData.timer_duration;
      const startTime = timerData.started_at
        ? new Date(timerData.started_at).getTime()
        : new Date(timerData.current_time).getTime();

      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, timerDuration - elapsed);

      if (remaining <= 0) {
        setTimerRemaining('00:00');
        if (!timeExpiredRef.current) {
          timeExpiredRef.current = true;
          toast.error('⏱️ ¡Tiempo agotado!', { duration: 5000 });
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
            toast.error('⏱️ ¡Tiempo agotado!', { duration: 5000 });
          }
        }
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  useEffect(() => {
    if (gameSessionId && currentStep === 'topic' && topics.length === 0) {
      loadTopics(gameSessionId);
    }
  }, [gameSessionId, currentStep]);

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
          <p className="text-xl mb-4">Error al cargar la información del equipo.</p>
          <Button onClick={() => navigate('/tablet/join')}>Volver a Conectar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 flex items-center justify-between flex-wrap gap-4">
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

      {/* Temporizador */}
      <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-center">
        <p className="font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> Tiempo restante: {timerRemaining}
        </p>
      </div>

      {/* Contenedor Principal */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {currentStep === 'topic' ? (
            <motion.div
              key="topic"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="inline-block mb-4"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                    <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                </motion.div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#093c92] mb-2">
                  Elige tu Temática
                </h1>
                <p className="text-gray-600 text-base sm:text-lg md:text-xl">
                  ¿Sobre qué quieren emprender?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {topics.map((topic, index) => {
                  const isSelected = selectedTopic?.id === topic.id;
                  const isPending = pendingTopicId === topic.id;

                  return (
                    <motion.div
                      key={topic.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => !selectedChallenge && !submitting && handleTopicSelect(topic)}
                      className={`p-6 sm:p-8 rounded-xl cursor-pointer border-4 transition-all text-center relative ${
                        isSelected
                          ? 'border-green-500 bg-green-50 shadow-2xl ring-4 ring-green-200'
                          : isPending
                          ? 'border-yellow-400 bg-yellow-50 shadow-xl ring-4 ring-yellow-200'
                          : selectedChallenge
                          ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                          : 'border-blue-300 bg-white hover:border-blue-500 hover:shadow-2xl hover:ring-4 hover:ring-blue-200 active:scale-95 shadow-lg'
                      }`}
                    >
                      <div className="text-5xl sm:text-6xl mb-4">{topic.icon || '📚'}</div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#093c92] mb-2">{topic.name}</h3>
                      {topic.description && (
                        <p className="text-sm sm:text-base text-gray-600 mb-4">{topic.description}</p>
                      )}
                      {!isSelected && !selectedChallenge && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4"
                        >
                          <p className="text-blue-600 font-semibold text-sm flex items-center justify-center gap-1">
                            <span>👆</span> Toca para ver desafíos
                          </p>
                        </motion.div>
                      )}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-4"
                        >
                          <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-green-700 font-semibold mt-2 text-sm">Confirmado</p>
                        </motion.div>
                      )}
                      {isPending && !isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-2"
                        >
                          <p className="text-yellow-700 font-semibold text-sm">Vista previa</p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="challenge"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <Target className="w-20 h-20 sm:w-24 sm:h-24 text-[#f757ac] mx-auto" />
                </motion.div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#093c92] mb-2">
                  El Desafío
                </h1>
                <p className="text-gray-600 text-base sm:text-lg md:text-xl mb-4">
                  Tema: <span className="font-semibold text-[#093c92]">
                    {pendingTopicId ? topics.find(t => t.id === pendingTopicId)?.name || '---' : 'No seleccionado'}
                  </span>
                </p>
                {!selectedChallenge && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentStep('topic');
                      setPendingChallengeId(null);
                      // Limpiar pendingTopicId para permitir seleccionar otro tema
                      setPendingTopicId(null);
                    }}
                    className="mb-4"
                    disabled={submitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Cambiar Tema
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {challenges.map((challenge, index) => {
                  const isSelected = selectedChallenge?.id === challenge.id;
                  const isPending = pendingChallengeId === challenge.id && !selectedChallenge;

                  // Usar icono del modelo
                  const icon = challenge.icon || '🎯';

                  // Colores de gradiente para cada desafío (rotando entre diferentes colores)
                  const gradientColors = [
                    'from-green-400 to-green-600',
                    'from-blue-400 to-blue-600',
                    'from-pink-400 via-purple-500 to-purple-600',
                    'from-yellow-400 to-orange-500',
                    'from-cyan-400 to-blue-500',
                    'from-red-400 to-pink-500',
                  ];
                  const gradientColor = gradientColors[index % gradientColors.length];

                  // Usar datos de persona del modelo
                  const personaName = challenge.persona_name;
                  const personaAge = challenge.persona_age;
                  const personaStory = challenge.persona_story;

                  return (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!selectedChallenge) {
                          // Guardar posición del scroll antes de seleccionar
                          scrollPositionRef.current = window.scrollY || document.documentElement.scrollTop || window.pageYOffset;
                          handleChallengeSelect(challenge, e);
                        }
                      }}
                      className={`h-full flex flex-col rounded-xl cursor-pointer overflow-hidden transition-all border-4 ${
                        isSelected
                          ? 'ring-4 ring-green-500 shadow-2xl border-green-500'
                          : isPending
                          ? 'ring-4 ring-yellow-400 shadow-xl border-yellow-400'
                          : 'border-blue-300 shadow-xl hover:border-blue-500 hover:shadow-2xl hover:ring-4 hover:ring-blue-200 active:scale-[0.98]'
                      }`}
                    >
                      {/* Top Section - Gradient with Icon and Title - FIXED HEIGHT */}
                      <div className={`bg-gradient-to-br ${gradientColor} p-6 text-white flex-shrink-0 h-40 flex flex-col items-center justify-center`}>
                        <div className="text-5xl mb-3">{icon}</div>
                        <h3 className="text-lg font-bold text-center leading-tight h-12 flex items-center justify-center">
                          {challenge.title}
                        </h3>
                      </div>

                      {/* Bottom Section - White background with description and persona - Flexible */}
                      <div className="bg-white p-4 flex-1 flex flex-col min-h-0">
                        {/* Description - Always visible */}
                        {challenge.description && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {challenge.description}
                            </p>
                          </div>
                        )}

                        {/* Persona Section - Always visible */}
                        {personaStory && personaName && (
                          <div className="border-t pt-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0`}>
                                <span className="text-white text-base">👤</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-semibold text-gray-800 text-sm">
                                    {personaName}
                                  </span>
                                  {personaAge && (
                                    <span className="text-sm text-gray-500">
                                      {personaAge} años
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 italic leading-relaxed">
                                  "{personaStory}"
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Espaciado flexible para igualar alturas - después de la historia de usuario */}
                        <div className="flex-1"></div>

                        {/* Selection Status - Fixed at bottom */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-4 pt-4 border-t text-center"
                          >
                            <div className="bg-green-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-green-700 font-semibold text-sm">Confirmado</p>
                          </motion.div>
                        )}
                        {isPending && !selectedChallenge && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-4 pt-4 border-t text-center"
                          >
                            <p className="text-yellow-700 font-semibold text-sm flex items-center justify-center gap-1">
                              <span>👆</span> Toca "Confirmar" abajo
                            </p>
                          </motion.div>
                        )}
                        {!isPending && !isSelected && !selectedChallenge && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 pt-4 border-t text-center"
                          >
                            <p className="text-blue-600 font-semibold text-sm flex items-center justify-center gap-1">
                              <span>👆</span> Toca para seleccionar
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {pendingChallengeId && !selectedChallenge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                  onAnimationStart={() => {
                    // Mantener posición del scroll cuando aparece el botón
                    const savedPosition = scrollPositionRef.current;
                    if (savedPosition !== undefined && savedPosition !== null) {
                      window.scrollTo({
                        top: savedPosition,
                        behavior: 'instant'
                      });
                      document.documentElement.scrollTop = savedPosition;
                      if (document.body) {
                        document.body.scrollTop = savedPosition;
                      }
                    }
                  }}
                  onAnimationComplete={() => {
                    // Restaurar posición después de la animación del botón
                    const savedPosition = scrollPositionRef.current;
                    if (savedPosition !== undefined && savedPosition !== null) {
                      requestAnimationFrame(() => {
                        window.scrollTo({
                          top: savedPosition,
                          behavior: 'instant'
                        });
                        document.documentElement.scrollTop = savedPosition;
                        if (document.body) {
                          document.body.scrollTop = savedPosition;
                        }
                      });
                    }
                  }}
                >
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleChallengeConfirm();
                    }}
                    disabled={submitting}
                    className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#f757ac] to-pink-600 hover:from-[#e6498a] hover:to-[#d13a7a] text-white rounded-full shadow-2xl"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                        Confirmando...
                      </>
                    ) : (
                      <>
                        Confirmar Desafío
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {selectedChallenge && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center p-6 sm:p-8 bg-green-50 border-2 border-green-300 rounded-xl"
                >
                  <p className="text-base sm:text-lg font-semibold text-green-800 mb-2">
                    ✓ Desafío confirmado exitosamente
                  </p>
                  <p className="text-sm sm:text-base text-gray-600">
                    Esperando a que el profesor avance a la siguiente actividad...
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

