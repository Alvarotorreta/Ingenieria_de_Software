import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Loader2,
  Award,
  Target,
  ArrowRight,
  ArrowLeft,
  Clock,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EtapaIntroModal } from '@/components/EtapaIntroModal';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import { sessionsAPI, tabletConnectionsAPI, challengesAPI, teamActivityProgressAPI, academicAPI } from '@/services';
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
  persona_image_url?: string;
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
  const [showEtapaIntro, setShowEtapaIntro] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollPositionRef = useRef<number>(0);
  const isFetchingRef = useRef<boolean>(false);
  const lastActivityIdRef = useRef<number | null>(null);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    
    loadGameState(connId, true);

    intervalRef.current = setInterval(() => {
      if (!isFetchingRef.current) {
        loadGameState(connId, false);
      }
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


  const loadGameState = async (connId: string, isInitialLoad: boolean = false) => {
    if (isFetchingRef.current) {
      return;
    }
    
    isFetchingRef.current = true;
    
    try {
      const statusData = await tabletConnectionsAPI.getStatus(connId);
      
      setTeam(statusData.team);
      setGameSessionId(statusData.game_session.id);

      const gameData: GameSession = await sessionsAPI.getById(statusData.game_session.id);
      
      const sessionId = statusData.game_session.id;

      // Verificar si debemos mostrar la intro de la etapa
      if (gameData.current_stage_number === 2) {
        const introKey = `tablet_etapa_intro_${sessionId}_2`;
        const hasSeenIntro = localStorage.getItem(introKey);
        if (!hasSeenIntro) {
          setShowEtapaIntro(true);
        }
      }

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

      if (currentStageNumber === 2 && currentActivityId) {
        const normalizedActivityName = currentActivityName.toLowerCase().trim();
        if (normalizedActivityName.includes('bubble') || 
            normalizedActivityName.includes('mapa') || 
            normalizedActivityName.includes('mapa mental') ||
            normalizedActivityName.includes('bubble map') ||
            normalizedActivityName.includes('bubblemap')) {
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

      setCurrentActivityId(currentActivityId);

      let currentSessionStageId = sessionStageId;
      if (!currentSessionStageId && currentActivityId) {
        try {
          const stages = await sessionsAPI.getSessionStages(statusData.game_session.id);
          
          const stagesArray = Array.isArray(stages) ? stages : [];
          const stage2 = stagesArray.find((s: any) => s.stage_number === 2);
          if (stage2) {
            currentSessionStageId = stage2.id;
            setSessionStageId(stage2.id);
          }
        } catch (error) {
          // Error loading session stages
        }
      }

      if (currentActivityId && statusData.team.id && currentSessionStageId) {
        await loadProgress(
          statusData.team.id,
          currentActivityId,
          currentSessionStageId,
          statusData.game_session.id,
          isInitialLoad
        );
      }

      if (currentActivityId && lastActivityIdRef.current !== currentActivityId) {
        lastActivityIdRef.current = currentActivityId;
        startTimer(currentActivityId, statusData.game_session.id);
      }

      setLoading(false);
    } catch (error: any) {
      toast.error('Error de conexión: ' + (error.message || 'Error desconocido'));
      setLoading(false);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const loadProgress = async (teamId: number, activityId: number, stageId: number, gameSessionId: number, forceUpdateStep: boolean = false) => {
    try {
      const progressList = await teamActivityProgressAPI.list({
        team: teamId,
        activity: activityId,
        session_stage: stageId,
      });
      
      const progress = Array.isArray(progressList) ? progressList[0] : null;


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
            
            if (challenges.length === 0 || pendingTopicId !== topic.id) {
              await loadChallenges(topic.id);
            }
            
            setSelectedChallenge(challenge as Challenge);
            setPendingChallengeId(null);
            
            // Cambiar al paso de desafíos si hay desafío confirmado
            if (forceUpdateStep || currentStep === 'topic') {
              setCurrentStep('challenge');
            }
          } else {
            setSelectedChallenge(challenge as Challenge);
            setPendingChallengeId(null);
          }
        } else if (progress.selected_topic) {
          const topic = typeof progress.selected_topic === 'object' 
            ? progress.selected_topic 
            : { id: progress.selected_topic };
          setPendingTopicId(topic.id);
          setSelectedTopic(null);
          setSelectedChallenge(null);
          
          if (challenges.length === 0 || pendingTopicId !== topic.id) {
            await loadChallenges(topic.id);
          }
        } else {
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
      // Error loading progress
    }
  };

  const loadTopics = async (gameSessionId: number) => {
    try {
      // Obtener información de la sesión para obtener la facultad
      const sessionData = await sessionsAPI.getById(gameSessionId);

      if (!sessionData.course) {
        toast.error('Error: No se pudo obtener la información del curso');
        return;
      }

      // Obtener course para obtener la facultad
      const courseData = await academicAPI.getCourseById(sessionData.course);

      if (!courseData.career) {
        toast.error('Error: No se pudo obtener la información de la carrera');
        return;
      }

      // Obtener la carrera para obtener el ID de la facultad
      const careerData = await academicAPI.getCareerById(courseData.career);

      if (!careerData.faculty) {
        toast.error('Error: No se pudo obtener la información de la facultad');
        return;
      }

      const facultyId = careerData.faculty;

      // Obtener temas filtrados por facultad
      const topicsList = await challengesAPI.getTopics({ faculty: facultyId });
      
      const topicsArray = Array.isArray(topicsList) ? topicsList : [];
      setTopics(topicsArray);
    } catch (error: any) {
      toast.error('Error al cargar temas: ' + (error.message || 'Error desconocido'));
    }
  };

  const loadChallenges = async (topicId: number) => {
    if (challenges.length > 0 && pendingTopicId === topicId) {
      return;
    }
    
    try {
      const challengesList = await challengesAPI.getChallenges({ topic: topicId });
      const challengesArray = Array.isArray(challengesList) ? challengesList : [];
      setChallenges(challengesArray);
    } catch (error: any) {
      throw error;
    }
  };

  const handleTopicSelect = async (topic: Topic) => {
    if (selectedChallenge) {
      toast.error('Ya has confirmado un desafío. No puedes cambiar el tema.');
      return;
    }

    if (!team || !currentActivityId || !sessionStageId) {
      toast.error('Error: Faltan datos necesarios');
      return;
    }

    setPendingTopicId(topic.id);
    setCurrentStep('challenge');
    
    Promise.all([
      teamActivityProgressAPI.selectTopic({
        team: team.id,
        activity: currentActivityId,
        session_stage: sessionStageId,
        topic: topic.id,
      }).catch(() => {}),
      loadChallenges(topic.id).catch((error: any) => {
        toast.error('Error al cargar desafíos: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
        setCurrentStep('topic');
        setPendingTopicId(null);
      })
    ]);
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

  useEffect(() => {
    if (pendingChallengeId !== null) {
      const restoreScroll = () => {
        const savedPosition = scrollPositionRef.current;
        if (savedPosition !== undefined && savedPosition !== null) {
          window.scrollTo({ top: savedPosition, behavior: 'instant' });
          document.documentElement.scrollTop = savedPosition;
          if (document.body) {
            document.body.scrollTop = savedPosition;
          }
        }
      };

      restoreScroll();
      requestAnimationFrame(() => {
        restoreScroll();
        setTimeout(() => restoreScroll(), 100);
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
      const formData = new FormData();
      formData.append('team', team.id.toString());
      formData.append('activity', currentActivityId.toString());
      formData.append('session_stage', sessionStageId.toString());
      formData.append('challenge', pendingChallengeId.toString());
      if (pendingTopicId) {
        formData.append('topic', pendingTopicId.toString());
      }

      const challengeResponse = await teamActivityProgressAPI.selectChallenge(formData);

      let challenge = challenges.find((c) => c.id === pendingChallengeId);
      if (!challenge && challengeResponse?.selected_challenge) {
        challenge = challengeResponse.selected_challenge as Challenge;
      }
      
      if (challenge) {
        const challengeImageUrl = challengeResponse?.selected_challenge?.persona_image_url || challenge.persona_image_url;
        
        setChallenges(prevChallenges => {
          return prevChallenges.map(c => 
            c.id === challenge.id
              ? { ...c, persona_image_url: challengeImageUrl }
              : c
          );
        });
        
        setSelectedChallenge({
          ...challenge,
          persona_image_url: challengeImageUrl
        });
        setPendingChallengeId(null);
        
        if (challengeResponse?.selected_topic) {
          setSelectedTopic(challengeResponse.selected_topic as Topic);
          setPendingTopicId(null);
        } else if (pendingTopicId) {
          const topic = topics.find((t) => t.id === pendingTopicId);
          if (topic) {
            setSelectedTopic(topic);
          }
          setPendingTopicId(null);
        }
        
        toast.success('✓ Desafío y tema confirmados exitosamente');
        
        if (connectionId) {
          setTimeout(() => {
            loadGameState(connectionId, false);
          }, 500);
        }
      } else {
        toast.error('Error: No se pudo encontrar el desafío confirmado');
      }
    } catch (error: any) {
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
      const timerData = await sessionsAPI.getActivityTimer(gameSessionId);
      
      if (timerData.error || !timerData.timer_duration) {
        return;
      }

      const timerDuration = timerData.timer_duration;
      const startTime = timerData.started_at
        ? new Date(timerData.started_at).getTime()
        : new Date(timerData.current_time).getTime();

      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, timerDuration - elapsed);

      if (remaining <= 0) {
        setTimerRemaining('00:00');
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
        }
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);
    } catch (error) {
      // Error starting timer
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              initial={{ x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080) }}
              animate={{ y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 flex items-center justify-between flex-wrap gap-4"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg"
              style={{ backgroundColor: getTeamColorHex(team.color) }}
            >
              {team.color.charAt(0).toUpperCase()}
            </motion.div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">{team.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600">Equipo {team.color}</p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#093c92] to-blue-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2 shadow-lg"
          >
            <Award className="w-4 h-4 sm:w-5 sm:h-5" /> {team.tokens_total || 0} Tokens
          </motion.div>
        </motion.div>

        {/* Temporizador */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-yellow-50/95 backdrop-blur-sm border-2 border-yellow-400/80 text-yellow-900 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-center shadow-lg"
        >
          <p className="font-bold text-sm sm:text-base flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" /> Tiempo restante: <span className="text-yellow-800 font-black">{timerRemaining}</span>
          </p>
        </motion.div>

        {/* Contenedor Principal */}
        <div>
          <AnimatePresence mode="wait">
            {currentStep === 'topic' ? (
              <motion.div
                key="topic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12"
              >
                <div className="text-center mb-8 sm:mb-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.8 }}
                    className="inline-block mb-5 sm:mb-6"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-purple-200/50">
                      <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white stroke-[2.5]" />
                    </div>
                  </motion.div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#093c92] mb-3 drop-shadow-sm"
                  >
                    Elige tu Temática
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 text-base sm:text-lg md:text-xl font-medium"
                  >
                    ¿Sobre qué quieren emprender?
                  </motion.p>
                </div>

                <div className={`grid gap-4 sm:gap-6 mb-6 sm:mb-8 ${
                  topics.length === 3 
                    ? 'grid-cols-1 sm:grid-cols-3' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {topics.map((topic, index) => {
                    const isSelected = selectedTopic?.id === topic.id;
                    const isPending = pendingTopicId === topic.id;

                    return (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                        whileHover={{ scale: 1.05, y: -8 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => !selectedChallenge && !submitting && handleTopicSelect(topic)}
                        className={`h-full flex flex-col p-4 sm:p-6 md:p-8 rounded-2xl cursor-pointer border-3 transition-all text-center relative overflow-hidden ${
                          isSelected
                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-2xl ring-4 ring-green-300/50'
                            : isPending
                            ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-xl ring-4 ring-yellow-300/50'
                            : selectedChallenge
                            ? 'opacity-50 cursor-not-allowed border-gray-200 bg-gray-50'
                            : 'border-blue-200 bg-white hover:border-blue-400 hover:shadow-2xl hover:ring-4 hover:ring-blue-200/50 active:scale-95 shadow-lg'
                        }`}
                      >
                        {/* Efecto de brillo en hover */}
                        {!isSelected && !selectedChallenge && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                          />
                        )}
                        
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 flex-shrink-0"
                        >
                          {topic.icon || '📚'}
                        </motion.div>
                        <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#093c92] mb-2 sm:mb-3 flex-shrink-0">{topic.name}</h3>
                        {topic.description && (
                          <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4 flex-1 min-h-[3rem] sm:min-h-[3.5rem] line-clamp-3 leading-relaxed">{topic.description}</p>
                        )}
                        {!topic.description && (
                          <div className="flex-1 min-h-[3rem] sm:min-h-[3.5rem]"></div>
                        )}
                        {!isSelected && !selectedChallenge && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-auto pt-2 flex-shrink-0"
                          >
                            <p className="text-blue-600 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-blue-50 px-3 py-1.5 sm:py-2 rounded-full">
                              <span className="text-base">👆</span> Toca para ver desafíos
                            </p>
                          </motion.div>
                        )}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="mt-auto pt-2 flex-shrink-0"
                          >
                            <div className="bg-gradient-to-br from-green-500 to-green-600 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto shadow-lg ring-4 ring-green-200/50">
                              <Check className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white stroke-[3]" />
                            </div>
                            <p className="text-green-700 font-bold mt-2 sm:mt-3 text-xs sm:text-sm md:text-base">✓ Confirmado</p>
                          </motion.div>
                        )}
                        {isPending && !isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-auto pt-2 flex-shrink-0"
                          >
                            <p className="text-yellow-700 font-semibold text-xs sm:text-sm bg-yellow-50 px-3 py-1 rounded-full">Vista previa</p>
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12"
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

                  // La imagen viene directamente del backend - simplemente usarla
                  const challengeImageUrl = challenge.persona_image_url;

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
                              {challengeImageUrl ? (
                                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0 border-3 border-white shadow-lg">
                                    <img 
                                      src={challengeImageUrl} 
                                      alt={personaName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center flex-shrink-0`}>
                                    <span className="text-white text-2xl sm:text-3xl">👤</span>
                                  </div>
                                )}
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
                    const savedPosition = scrollPositionRef.current;
                    if (savedPosition !== undefined && savedPosition !== null) {
                      window.scrollTo({ top: savedPosition, behavior: 'instant' });
                      document.documentElement.scrollTop = savedPosition;
                      if (document.body) {
                        document.body.scrollTop = savedPosition;
                      }
                    }
                  }}
                  onAnimationComplete={() => {
                    const savedPosition = scrollPositionRef.current;
                    if (savedPosition !== undefined && savedPosition !== null) {
                      requestAnimationFrame(() => {
                        window.scrollTo({ top: savedPosition, behavior: 'instant' });
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

      {/* Modal de Introducción de Etapa */}
      <EtapaIntroModal
        etapaNumero={2}
        isOpen={showEtapaIntro}
        onClose={() => {
          setShowEtapaIntro(false);
          if (gameSessionId) {
            localStorage.setItem(`tablet_etapa_intro_${gameSessionId}_2`, 'true');
          }
        }}
      />

      {/* Música de fondo */}
      <BackgroundMusic storageKey="tablet_backgroundMusicEnabled" />
    </div>
  );
}

