import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, Clock, ArrowRight, Users, CheckCircle2, Eye, X, Sparkles, Lightbulb, XCircle, Target, UserCircle, ZoomIn, ZoomOut, RotateCcw, Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GroupBadge } from '@/components/GroupBadge';
import { EtapaIntroModal } from '@/components/EtapaIntroModal';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import { sessionsAPI, challengesAPI, teamBubbleMapsAPI, teamPersonalizationsAPI, teamActivityProgressAPI } from '@/services';
import { toast } from 'sonner';
import { isDevMode } from '@/utils/devMode';
import { useGameStateRedirect } from '@/hooks/useGameStateRedirect';

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total: number;
}

// Nueva estructura de datos basada en Figma
interface Answer {
  id: number;
  text: string;
}

interface Question {
  id: number;
  question: string;
  answers: Answer[];
  isOptional: boolean;
}

interface BubbleMapData {
  central: {
    personName: string;
    profileImage?: string;
  };
  questions: Question[];
}

interface BubbleMap {
  id: number;
  team: number;
  map_data: BubbleMapData | {
    // Compatibilidad con estructura antigua
    nodes?: any[];
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
  
  // Redirigir automáticamente si el juego está en otro estado
  useGameStateRedirect();
  
  const [loading, setLoading] = useState(true);
  const [teamsWithMaps, setTeamsWithMaps] = useState<TeamWithMap[]>([]);
  const [gameSession, setGameSession] = useState<any>(null);
  const [currentActivity, setCurrentActivity] = useState<any>(null);
  const [currentSessionStage, setCurrentSessionStage] = useState<any>(null);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [allTeamsCompleted, setAllTeamsCompleted] = useState(false);
  const [previewMap, setPreviewMap] = useState<{ team: Team; bubbleMap: BubbleMap } | null>(null);
  const [showEtapaIntro, setShowEtapaIntro] = useState(false);
  const [previewCanvasSize, setPreviewCanvasSize] = useState({ width: 1000, height: 1000 });
  const [previewViewportSize, setPreviewViewportSize] = useState({ width: 0, height: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [personalizations, setPersonalizations] = useState<Record<number, { team_name?: string }>>({});
  const [teamChallenges, setTeamChallenges] = useState<Record<number, { persona_name?: string; persona_image_url?: string }>>({});
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const previewCanvasRef = useRef<HTMLDivElement | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerStartTimeRef = useRef<number | null>(null);
  const timerDurationRef = useRef<number | null>(null);
  const hasUserScrolledRef = useRef<boolean>(false);
  const initialScrollCenteredRef = useRef<boolean>(false);

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

  // Calcular tamaño del canvas del preview cuando se abre el modal (ajustar para que quepa completo)
  useEffect(() => {
    if (!previewMap) {
      // Resetear cuando se cierra el modal
      previewContainerRef.current = null;
      previewCanvasRef.current = null;
      setPreviewViewportSize({ width: 0, height: 0 });
      setPreviewCanvasSize({ width: 1000, height: 1000 });
      setZoomLevel(1);
      return;
    }

    const updatePreviewSize = () => {
      const container = previewContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width || container.clientWidth || container.offsetWidth;
      const containerHeight = rect.height || container.clientHeight || container.offsetHeight;

      if (containerWidth > 0 && containerHeight > 0) {
        // Guardar el tamaño del viewport (contenedor scrollable)
        setPreviewViewportSize({ width: containerWidth, height: containerHeight });
        
        // Calcular el tamaño del canvas para que quepa completamente en el viewport
        // Dejar un padding de 40px en cada lado
        const padding = 40;
        const availableWidth = containerWidth - (padding * 2);
        const availableHeight = containerHeight - (padding * 2);
        
        // El canvas base es 1000x1000, pero lo ajustamos para que quepa completamente
        const baseCanvasSize = 1000;
        const scaleX = availableWidth / baseCanvasSize;
        const scaleY = availableHeight / baseCanvasSize;
        // Usar el menor de los dos para que quepa en ambas dimensiones
        const scale = Math.min(scaleX, scaleY);
        
        // Calcular el tamaño ajustado (siempre debe quedar dentro del viewport)
        const width = baseCanvasSize * scale;
        const height = baseCanvasSize * scale;
        
        setPreviewCanvasSize({ width, height });
        setZoomLevel(1); // Resetear zoom cuando se calcula el tamaño
      }
    };

    // Ejecutar después de que el DOM se actualice, con múltiples intentos
    const timeouts = [
      setTimeout(updatePreviewSize, 50),
      setTimeout(updatePreviewSize, 100),
      setTimeout(updatePreviewSize, 200),
      setTimeout(updatePreviewSize, 400),
      setTimeout(updatePreviewSize, 600),
      setTimeout(updatePreviewSize, 800),
      setTimeout(updatePreviewSize, 1000)
    ];

    // También escuchar cambios de tamaño
    window.addEventListener('resize', updatePreviewSize);
    
    // Usar ResizeObserver para detectar cambios en el contenedor
    let resizeObserver: ResizeObserver | null = null;
    if (previewContainerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        setTimeout(updatePreviewSize, 10);
      });
      resizeObserver.observe(previewContainerRef.current);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('resize', updatePreviewSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [previewMap]);

  // Centrar el scroll solo una vez cuando se abre el modal (no cuando cambian las dimensiones)
  useEffect(() => {
    if (!previewMap) {
      // Resetear cuando se cierra el modal
      hasUserScrolledRef.current = false;
      initialScrollCenteredRef.current = false;
      return;
    }

    // Si ya se centró inicialmente, no volver a centrar
    if (initialScrollCenteredRef.current) return;

    const centerScroll = () => {
      const container = previewContainerRef.current;
      if (!container) return;

      // Si el usuario ya hizo scroll, no centrar
      if (hasUserScrolledRef.current) return;

      const scrollHeight = container.scrollHeight;
      const scrollWidth = container.scrollWidth;
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;

      if (scrollHeight > 0 && containerHeight > 0 && scrollHeight > containerHeight) {
        container.scrollTop = (scrollHeight - containerHeight) / 2;
      }

      if (scrollWidth > 0 && containerWidth > 0 && scrollWidth > containerWidth) {
        container.scrollLeft = (scrollWidth - containerWidth) / 2;
      }

      // Marcar como centrado inicialmente
      initialScrollCenteredRef.current = true;
    };

    const waitForContainer = () => {
      if (!previewContainerRef.current) return false;
      const container = previewContainerRef.current;
      return container.scrollHeight > 0 && container.scrollWidth > 0;
    };

    // Solo intentar centrar una vez con delays cortos
    const timeouts: NodeJS.Timeout[] = [];
    for (let delay of [50, 100, 200, 400, 600]) {
      timeouts.push(setTimeout(() => {
        if (waitForContainer() && !hasUserScrolledRef.current) {
          centerScroll();
        }
      }, delay));
    }

    // Listener para detectar scroll manual del usuario
    const container = previewContainerRef.current;
    const handleScroll = () => {
      if (!hasUserScrolledRef.current) {
        hasUserScrolledRef.current = true;
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      timeouts.forEach(clearTimeout);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [previewMap]);

  // Funciones de zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3)); // Máximo 3x
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Mínimo 0.5x
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    // Centrar el scroll después de resetear
    const container = previewContainerRef.current;
    if (container) {
      const scrollHeight = container.scrollHeight;
      const scrollWidth = container.scrollWidth;
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;
      
      if (scrollHeight > containerHeight) {
        container.scrollTop = (scrollHeight - containerHeight) / 2;
      }
      if (scrollWidth > containerWidth) {
        container.scrollLeft = (scrollWidth - containerWidth) / 2;
      }
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

  const loadGameControl = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/profesor/login');
        return;
      }

      const sessionData = await sessionsAPI.getById(sessionId);
      setGameSession(sessionData);

      // Verificar si debemos mostrar la intro de la etapa
      if (sessionData.current_stage_number === 2) {
        const introKey = `etapa_intro_${sessionId}_2`;
        const hasSeenIntro = localStorage.getItem(introKey);
        if (!hasSeenIntro) {
          setShowEtapaIntro(true);
        }
      }

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
        const activityData = await challengesAPI.getActivityById(currentActivityId);
        setCurrentActivity(activityData);
      }

      // Fetch current session stage
      const stages = await sessionsAPI.getSessionStages(Number(sessionId));
      const stagesList = Array.isArray(stages) ? stages : [stages];
      const stage2 = stagesList.find((s: any) => s.stage_number === 2);
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
      const teams = await sessionsAPI.getTeams(sessionId);
      const teamsArray: Team[] = Array.isArray(teams) ? teams : [teams];

      // Fetch personalizations for all teams
      const persMap: Record<number, { team_name?: string }> = {};
      for (const team of teamsArray) {
        try {
          const persList = await teamPersonalizationsAPI.list({ team: team.id });
          const persResults = Array.isArray(persList) ? persList : [persList];
          if (persResults.length > 0 && persResults[0].team_name) {
            persMap[team.id] = { team_name: persResults[0].team_name };
          }
        } catch (error) {
          console.error(`Error loading personalization for team ${team.id}:`, error);
        }
      }
      setPersonalizations(persMap);

      // Fetch bubble maps and challenges for each team
      const teamsWithMapsPromises = teamsArray.map(async (team) => {
        try {
          const mapList = await teamBubbleMapsAPI.list({
            team: team.id,
            session_stage: sessionStageId
          });
          const mapArray = Array.isArray(mapList) ? mapList : [mapList];
          const bubbleMap = mapArray[0] || null;
          
          // Cargar desafío seleccionado para este equipo
          try {
            const progressList = await teamActivityProgressAPI.list({
              team: team.id,
              session_stage: sessionStageId
            });
            const progressArray = Array.isArray(progressList) ? progressList : [progressList];
            const progress = progressArray[0];
            
            if (progress?.selected_challenge) {
              let challenge = typeof progress.selected_challenge === 'object' 
                ? progress.selected_challenge 
                : { id: progress.selected_challenge };
              
              // Si solo viene el ID, cargar desde la API
              if (!challenge.persona_name || !challenge.persona_image_url) {
                challenge = await challengesAPI.getChallengeById(challenge.id);
              }
              
              setTeamChallenges(prev => ({
                ...prev,
                [team.id]: {
                  persona_name: challenge.persona_name,
                  persona_image_url: challenge.persona_image_url
                }
              }));
            }
          } catch (error) {
            console.error(`Error loading challenge for team ${team.id}:`, error);
          }
          
          return { team, bubbleMap };
        } catch (error) {
          console.error(`Error loading bubble map for team ${team.id}:`, error);
          return { team, bubbleMap: null };
        }
      });

      const teamsWithMaps = await Promise.all(teamsWithMapsPromises);
      setTeamsWithMaps(teamsWithMaps);

      // Check if all teams have completed
      const allCompleted = teamsWithMaps.every(({ bubbleMap }) => {
        const status = getBubbleMapStatus(bubbleMap);
        return status.status === 'completed';
      });
      setAllTeamsCompleted(allCompleted);
    } catch (error) {
      console.error('Error loading bubble maps:', error);
    }
  };

  const syncTimer = async (gameSessionId: number) => {
    try {
      const timerData = await sessionsAPI.getActivityTimer(gameSessionId);

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

  const handleNextActivity = async (skipRequirements: boolean = false) => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const data = await sessionsAPI.nextActivity(sessionId);

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
      return { text: 'Pendiente', class: 'bg-yellow-100 text-yellow-800', status: 'pending' };
    }
    
    // Nueva estructura: preguntas y respuestas
    if ('questions' in (bubbleMap.map_data || {})) {
      const data = bubbleMap.map_data as BubbleMapData;
      const questions = data.questions || [];
      
      if (questions.length === 0) {
        return { text: 'Pendiente', class: 'bg-yellow-100 text-yellow-800', status: 'pending' };
      }
      
      // Obtener las 5 preguntas obligatorias (las que no son opcionales)
      const mandatoryQuestions = questions.filter(q => !q.isOptional);
      
      // Considerar completado si tiene al menos 5 preguntas obligatorias y cada una tiene al menos 2 respuestas
      const hasMinimumContent = mandatoryQuestions.length >= 5 && mandatoryQuestions.every(q => q.answers.length >= 2);
      if (hasMinimumContent) {
        return { text: 'Completado', class: 'bg-green-100 text-green-800', status: 'completed' };
      }
      
      return { text: 'En Progreso', class: 'bg-blue-100 text-blue-800', status: 'in_progress' };
    }
    
    // Estructura antigua (compatibilidad)
    const nodes = (bubbleMap.map_data as any)?.nodes || [];
    if (nodes.length === 0) {
      return { text: 'Pendiente', class: 'bg-yellow-100 text-yellow-800', status: 'pending' };
    }
    if (nodes.length >= 11) {
      return { text: 'Completado', class: 'bg-green-100 text-green-800', status: 'completed' };
    }
    return { text: 'En Progreso', class: 'bg-blue-100 text-blue-800', status: 'in_progress' };
  };

  if (loading && teamsWithMaps.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo animado - Igual que Panel.tsx */}
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

      <BackgroundMusic />

      <div className="relative z-10 p-3 sm:p-4 flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-3 sm:gap-4">
          {/* Botón Continuar - Arriba */}
          <div className="w-full mb-2 sm:mb-3 z-20 flex justify-center gap-2 flex-shrink-0">
            {allTeamsCompleted && (
              <Button
                onClick={() => handleNextActivity(false)}
                disabled={loading}
                className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold bg-gradient-to-r from-[#093c92] to-[#f757ac] hover:from-[#072e73] hover:to-[#e6498a] text-white shadow-lg hover:shadow-xl transition-all rounded-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Avanzando...
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </>
                )}
              </Button>
            )}
            {/* Botón Dev - Solo en modo desarrollo */}
            {isDevMode() && (
              <Button
                onClick={() => handleNextActivity(true)}
                disabled={loading}
                className="px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all rounded-xl"
                title="Modo Dev: Avanzar sin requisitos"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                    Avanzando...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Dev
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-4 sm:p-5 flex-shrink-0"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#093c92] to-[#f757ac] rounded-xl flex items-center justify-center shadow-lg">
                  <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-1">
                    Bubble Map
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    Sala: <span className="font-bold text-[#093c92]">{gameSession?.room_code || '---'}</span>
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/profesor/panel')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-2 hover:bg-gray-50 w-full sm:w-auto"
              >
                <XCircle className="w-4 h-4" />
                Volver al Panel
              </Button>
            </div>
          </motion.div>

          {/* Información de Etapa */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-[#093c92] via-[#1e5bb8] to-[#093c92] text-white rounded-xl p-4 sm:p-5 flex-shrink-0 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 flex-shrink-0">
                  <Target className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold mb-1">Etapa 2: Empatía</h2>
                  <p className="text-sm sm:text-base opacity-90">
                    {currentActivity?.name || 'Bubble Map'}
                  </p>
                </div>
              </div>
              {timerRemaining !== '--:--' && (
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 border-2 border-white/30 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white animate-pulse" />
                    <span className="text-white font-bold text-sm sm:text-base">{timerRemaining}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Estadísticas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-shrink-0"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-4 sm:p-5 text-center shadow-lg"
              >
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[#093c92] mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-1">
                  {teamsWithMaps.length}
                </div>
                <div className="text-xs sm:text-sm text-blue-800 font-semibold">Equipos Totales</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-4 sm:p-5 text-center shadow-lg"
              >
                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-green-700 mb-1">
                  {teamsWithMaps.filter(({ bubbleMap }) => getBubbleMapStatus(bubbleMap).status === 'completed').length}
                </div>
                <div className="text-xs sm:text-sm text-green-800 font-semibold">Bubble Maps Completados</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-4 sm:p-5 text-center shadow-lg"
              >
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-purple-700 mb-1">
                  {teamsWithMaps.reduce((total, { bubbleMap }) => {
                    if (!bubbleMap) return total;
                    if ('questions' in (bubbleMap.map_data || {})) {
                      const data = bubbleMap.map_data as BubbleMapData;
                      const questions = data.questions || [];
                      return total + questions.reduce((sum, q) => sum + q.answers.length, 0);
                    }
                    const nodes = (bubbleMap.map_data as any)?.nodes || [];
                    return total + nodes.length;
                  }, 0)}
                </div>
                <div className="text-xs sm:text-sm text-purple-800 font-semibold">Total de Respuestas</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Equipos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-4 sm:p-5 flex-shrink-0"
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#093c92] to-[#f757ac] rounded-lg flex items-center justify-center shadow-md">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#093c92]">
                Equipos <span className="text-gray-500 font-normal text-base sm:text-lg">({teamsWithMaps.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {teamsWithMaps.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 text-sm sm:text-base">Cargando estado de los equipos...</p>
                </div>
              ) : (
                teamsWithMaps.map(({ team, bubbleMap }, index) => {
                  const status = getBubbleMapStatus(bubbleMap);
                  const teamColor = getTeamColorHex(team.color);
                  const isCompleted = status.status === 'completed';
                  
                  // Obtener estadísticas según la estructura
                  let totalAnswers = 0;
                  let totalQuestions = 0;
                  if (bubbleMap && 'questions' in (bubbleMap.map_data || {})) {
                    const data = bubbleMap.map_data as BubbleMapData;
                    totalQuestions = data.questions?.length || 0;
                    totalAnswers = data.questions?.reduce((sum, q) => sum + q.answers.length, 0) || 0;
                  } else {
                    const nodes = (bubbleMap?.map_data as any)?.nodes || [];
                    totalAnswers = nodes.length;
                  }

                  return (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${
                        isCompleted ? 'border-green-400' : 'border-gray-200'
                      }`}
                    >
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-md"
                              style={{ backgroundColor: teamColor }}
                            >
                              {team.color.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-bold text-[#093c92] text-base sm:text-lg">
                                {personalizations[team.id]?.team_name 
                                  ? `Equipo ${personalizations[team.id].team_name}` 
                                  : team.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600">
                                Equipo {team.color}
                              </p>
                            </div>
                          </div>
                          {isCompleted && (
                            <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-green-500 flex-shrink-0" />
                          )}
                        </div>

                        <div className="mb-3 sm:mb-4">
                          <Badge className={`text-xs sm:text-sm font-semibold ${status.class}`}>
                            {status.text}
                          </Badge>
                        </div>

                        {totalAnswers > 0 || totalQuestions > 0 ? (
                          <div className="space-y-2 sm:space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs sm:text-sm">
                                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                {totalQuestions} {totalQuestions === 1 ? 'pregunta' : 'preguntas'} • {totalAnswers} {totalAnswers === 1 ? 'respuesta' : 'respuestas'}
                              </Badge>
                              <Badge 
                                className="text-xs sm:text-sm text-white border-0"
                                style={{ backgroundColor: teamColor }}
                              >
                                {team.tokens_total || 0} tokens
                              </Badge>
                            </div>
                            {bubbleMap && (totalAnswers > 0 || totalQuestions > 0) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full rounded-lg border-2 hover:bg-gray-50"
                                onClick={() => setPreviewMap({ team, bubbleMap })}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Bubble Map
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-lg p-4 sm:p-5 text-center">
                            <p className="text-gray-400 text-sm sm:text-base italic">
                              Aún no ha creado burbujas
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
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
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-6xl w-full max-h-[95vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <GroupBadge 
                    name={previewMap.team.name} 
                    color={getTeamColorHex(previewMap.team.color)} 
                    size="large"
                  />
                </div>
                <div className="flex items-center gap-2">
                  {/* Controles de zoom */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleZoomOut}
                      className="h-8 w-8 rounded"
                      disabled={zoomLevel <= 0.5}
                      title="Alejar"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-xs font-medium px-2 min-w-[3rem] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleZoomIn}
                      className="h-8 w-8 rounded"
                      disabled={zoomLevel >= 3}
                      title="Acercar"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleZoomReset}
                      className="h-8 w-8 rounded"
                      title="Restablecer zoom"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
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
              </div>

              {/* Bubble Map Preview - nuevo diseño basado en Figma */}
              <div 
                className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border-4 mb-4 shadow-lg"
                style={{ 
                  borderColor: getTeamColorHex(previewMap.team.color),
                  minHeight: '600px',
                  height: '70vh',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Contenedor scrollable */}
                <div className="flex-1 overflow-auto p-6">
                {(() => {
                  // Determinar si es nueva estructura o antigua
                  const mapData = previewMap.bubbleMap.map_data;
                  const isNewStructure = mapData && 'questions' in mapData;
                  
                  if (isNewStructure) {
                    const data = mapData as BubbleMapData;
                    const questions = data.questions || [];
                    const personName = data.central?.personName || 'Persona';
                    let profileImageRaw = data.central?.profileImage || '';
                    
                    // Si no hay imagen en los datos guardados, usar la del desafío seleccionado
                    if (!profileImageRaw && teamChallenges[previewMap.team.id]) {
                      profileImageRaw = teamChallenges[previewMap.team.id].persona_image_url || '';
                      // Si no hay nombre en los datos guardados, usar el del desafío
                      if (!data.central?.personName && teamChallenges[previewMap.team.id].persona_name) {
                        // Nota: personName ya se estableció arriba, pero podemos actualizarlo si es necesario
                      }
                    }
                    
                    // Construir URL completa si es relativa
                    const getImageUrl = (imageSrc: string): string => {
                      if (!imageSrc) return '';
                      if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
                        return imageSrc;
                      }
                      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                      const baseUrl = apiBaseUrl.replace('/api', '');
                      return `${baseUrl}${imageSrc.startsWith('/') ? '' : '/'}${imageSrc}`;
                    };
                    const profileImage = getImageUrl(profileImageRaw);
                    
                    return (
                      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Header con persona */}
                        <div className="p-6 bg-gradient-to-r from-[#f757ac] to-pink-500 text-white rounded-t-2xl">
                          <div className="flex items-center gap-4">
                            {profileImage ? (
                              <img 
                                src={profileImage}
                                alt={personName}
                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white shadow-lg ${profileImage ? 'hidden' : ''}`}>
                              <UserCircle className="w-12 h-12 text-white" />
                            </div>
                            <div>
                              <h1 className="text-2xl font-bold">{personName}</h1>
                              <p className="text-pink-100">Perfil de Usuario</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Lista de preguntas y respuestas */}
                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                          {questions.map((question, questionIndex) => (
                            <div
                              key={question.id}
                              className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200"
                            >
                              {/* Pregunta */}
                              <h3 className="text-lg font-bold text-[#093c92] flex items-center gap-2 mb-3">
                                <span className="bg-[#093c92] text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">
                                  {questionIndex + 1}
                                </span>
                                {question.question}
                              </h3>

                              {/* Respuestas */}
                              <div className="space-y-2 ml-9">
                                {question.answers.map((answer, answerIndex) => (
                                  <div key={answer.id} className="flex items-center gap-2">
                                    <span className="text-gray-500 text-sm">{answerIndex + 1}.</span>
                                    <div className="flex-1 bg-white px-3 py-2 rounded-lg border border-purple-200 text-sm">
                                      {answer.text}
                                    </div>
                                  </div>
                                ))}
                                {question.answers.length === 0 && (
                                  <p className="text-gray-400 text-sm italic ml-9">Sin respuestas</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                    
                    // Usar el tamaño calculado dinámicamente
                    const previewWidth = previewCanvasSize.width;
                    const previewHeight = previewCanvasSize.height;
                    const previewCenterX = previewWidth / 2;
                    const previewCenterY = previewHeight / 2;
                    const previewCentralRadius = 50;
                    const previewQuestionRadius = 40;
                    const previewDynamicRadius = Math.min(previewWidth, previewHeight) * 0.20; // Mismo que tablets en modo normal
                    
                    const getQuestionPosition = (index: number, total: number) => {
                      const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
                      return {
                        x: previewCenterX + previewDynamicRadius * Math.cos(angle),
                        y: previewCenterY + previewDynamicRadius * Math.sin(angle),
                        angle
                      };
                    };
                    
                    const getAnswerPosition = (answerIndex: number, totalAnswers: number, questionX: number, questionY: number, questionAngle: number) => {
                      // Usar la misma lógica que las tablets (modo normal)
                      const radius = 250;
                      // Ajustar el spread angular según el número de respuestas igual que tablets
                      let angleSpread: number;
                      if (totalAnswers === 1) {
                        angleSpread = 0;
                      } else if (totalAnswers === 2) {
                        angleSpread = 0.5;
                      } else if (totalAnswers === 3) {
                        angleSpread = 0.45;
                      } else if (totalAnswers === 4) {
                        angleSpread = 0.4;
                      } else {
                        angleSpread = 0.35;
                      }
                      const angleOffset = (answerIndex - (totalAnswers - 1) / 2) * angleSpread;
                      const angle = questionAngle + angleOffset;
                      return {
                        x: questionX + radius * Math.cos(angle),
                        y: questionY + radius * Math.sin(angle)
                      };
                    };
                    
                    const getAnswerBubbleRadius = (answerCount: number) => {
                      // Usar la misma lógica que las tablets (modo normal)
                      const totalBubbles = Math.min(answerCount + 1, 4);
                      switch(totalBubbles) {
                        case 1: return 38;
                        case 2: return 34;
                        case 3: return 32;
                        case 4: return 30;
                        default: return 30;
                      }
                    };
                    
                    return (
                      <div 
                        className="relative bg-gradient-to-br from-gray-50 to-white"
                        style={{ 
                          width: previewWidth, 
                          height: previewHeight,
                          minWidth: previewWidth,
                          minHeight: previewHeight,
                          flexShrink: 0
                        }}
                      >
                        {/* SVG para líneas */}
                        <svg 
                          className="absolute pointer-events-none" 
                          style={{ 
                            left: -300,
                            top: -300,
                            width: previewWidth + 600,
                            height: previewHeight + 600,
                            zIndex: 0 
                          }}
                        >
                          {/* Líneas del centro a las preguntas */}
                          {questions.map((question, index) => {
                            const questionPos = getQuestionPosition(index, questions.length);
                            return (
                              <line
                                key={`line-center-${question.id}`}
                                x1={previewCenterX + 300}
                                y1={previewCenterY + 300}
                                x2={questionPos.x + 300}
                                y2={questionPos.y + 300}
                                stroke="#f757ac"
                                strokeWidth="3"
                                opacity="0.3"
                              />
                            );
                          })}
                          
                          {/* Líneas de preguntas a respuestas */}
                          {questions.map((question, questionIndex) => {
                            const questionPos = getQuestionPosition(questionIndex, questions.length);
                            return (
                              <g key={`question-lines-${question.id}`}>
                                {question.answers.map((answer, answerIndex) => {
                                  const totalItems = question.answers.length < 5 ? question.answers.length + 1 : question.answers.length;
                                  const answerPos = getAnswerPosition(answerIndex, totalItems, questionPos.x, questionPos.y, questionPos.angle);
                                  return (
                                    <line
                                      key={`line-answer-${question.id}-${answer.id}`}
                                      x1={questionPos.x + 300}
                                      y1={questionPos.y + 300}
                                      x2={answerPos.x + 300}
                                      y2={answerPos.y + 300}
                                      stroke="#a855f7"
                                      strokeWidth="2"
                                      opacity="0.4"
                                    />
                                  );
                                })}
                              </g>
                            );
                          })}
                        </svg>
                        
                        {/* Burbuja central */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", duration: 0.6 }}
                          className="absolute"
                          style={{ 
                            left: previewCenterX,
                            top: previewCenterY,
                            width: previewCentralRadius * 2,
                            height: previewCentralRadius * 2,
                            marginLeft: -previewCentralRadius,
                            marginTop: -previewCentralRadius,
                            zIndex: 10 
                          }}
                        >
                          <div 
                            className="w-full h-full rounded-full shadow-2xl flex flex-col items-center justify-center text-white transition-transform relative overflow-visible p-1"
                            style={{ background: 'linear-gradient(135deg, #f757ac 0%, #d946a0 100%)' }}
                          >
                            <div className="w-full h-full rounded-full overflow-hidden bg-white p-1">
                              {profileImage ? (
                                <img
                                  src={profileImage}
                                  alt={personName}
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => {
                                    console.error('Error loading profile image:', profileImage);
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-full ${profileImage ? 'hidden' : ''}`}>
                                <UserCircle className="w-full h-full text-gray-400" />
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full shadow-xl whitespace-nowrap"
                            style={{ background: '#f757ac' }}
                          >
                            <span className="text-white font-semibold">{personName}</span>
                          </div>
                        </motion.div>
                        
                        {/* Burbujas de preguntas y respuestas */}
                        {questions.map((question, questionIndex) => {
                          const questionPos = getQuestionPosition(questionIndex, questions.length);
                          
                          return (
                            <div key={question.id}>
                              {/* Burbuja de pregunta */}
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ 
                                  type: "spring", 
                                  duration: 0.5,
                                  delay: questionIndex * 0.1 
                                }}
                                className="absolute"
                                style={{ 
                                  left: questionPos.x,
                                  top: questionPos.y,
                                  width: previewQuestionRadius * 2,
                                  height: previewQuestionRadius * 2,
                                  marginLeft: -previewQuestionRadius,
                                  marginTop: -previewQuestionRadius,
                                  zIndex: 5
                                }}
                              >
                                <div
                                  className={`w-full h-full rounded-full ${question.isOptional ? 'bg-amber-500' : 'bg-[#093c92]'} shadow-2xl flex items-center justify-center text-white relative`}
                                >
                                  <span className="text-xs text-center px-3 leading-tight" style={{ hyphens: 'auto', wordBreak: 'break-word' }}>
                                    {question.question}
                                  </span>
                                </div>
                              </motion.div>
                              
                              {/* Burbujas de respuestas */}
                              {question.answers.map((answer, answerIndex) => {
                                const totalItems = question.answers.length < 5 ? question.answers.length + 1 : question.answers.length;
                                const answerPos = getAnswerPosition(answerIndex, totalItems, questionPos.x, questionPos.y, questionPos.angle);
                                const answerRadius = getAnswerBubbleRadius(question.answers.length);
                                
                                return (
                                  <motion.div
                                    key={answer.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ 
                                      type: "spring", 
                                      duration: 0.4,
                                      delay: questionIndex * 0.1 + answerIndex * 0.05
                                    }}
                                    className="absolute"
                                    style={{ 
                                      left: answerPos.x,
                                      top: answerPos.y,
                                      width: answerRadius * 2,
                                      height: answerRadius * 2,
                                      marginLeft: -answerRadius,
                                      marginTop: -answerRadius,
                                      zIndex: 4
                                    }}
                                  >
                                    <div
                                      className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-500 shadow-lg flex items-center justify-center text-white"
                                    >
                                      <span 
                                        className="text-xs text-center px-2 leading-tight"
                                        style={{ 
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          wordBreak: 'break-word',
                                          hyphens: 'auto'
                                        }}
                                      >
                                        {answer.text}
                                      </span>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else {
                    // Estructura antigua (compatibilidad)
                    const nodes = (mapData as any)?.nodes || [];
                    const edges = (mapData as any)?.edges || [];
                    
                    return (
                      <div className="relative" style={{ width: previewCanvasSize.width, height: previewCanvasSize.height }}>
                        {/* SVG para líneas conectoras */}
                        {edges.length > 0 && (
                          <svg 
                            className="absolute inset-0 w-full h-full pointer-events-none" 
                            style={{ zIndex: 1 }}
                          >
                            {edges.map((edge: any) => {
                              const fromNode = nodes.find((n: any) => n.id === edge.from);
                              const toNode = nodes.find((n: any) => n.id === edge.to);
                              
                              if (!fromNode || !toNode) return null;
                              
                              const getNodeCenter = (node: any) => {
                                const sizeMap = {
                                  small: { diameter: 80 },
                                  medium: { diameter: 120 },
                                  large: { diameter: 160 }
                                };
                                const size = sizeMap[node.size || 'medium'];
                                const radius = size.diameter / 2;
                                const padding = 24;
                                
                                return {
                                  x: padding + node.x + radius,
                                  y: padding + node.y + radius
                                };
                              };
                              
                              const fromCenter = getNodeCenter(fromNode);
                              const toCenter = getNodeCenter(toNode);
                              
                              return (
                                <motion.line
                                  key={`edge-${edge.id}`}
                                  initial={{ pathLength: 0, opacity: 0 }}
                                  animate={{ pathLength: 1, opacity: 0.4 }}
                                  transition={{ duration: 0.5 }}
                                  x1={fromCenter.x}
                                  y1={fromCenter.y}
                                  x2={toCenter.x}
                                  y2={toCenter.y}
                                  stroke={getTeamColorHex(previewMap.team.color)}
                                  strokeWidth="3"
                                  strokeDasharray="8,4"
                                />
                              );
                            })}
                          </svg>
                        )}

                        {/* Burbujas */}
                        <div style={{ zIndex: 2, position: 'relative' }}>
                          {nodes.map((node: any, index: number) => {
                            const sizeStyles = {
                              small: { diameter: '80px', fontSize: 'text-[10px]', padding: 'px-2 py-2', lineHeight: 'leading-tight' },
                              medium: { diameter: '120px', fontSize: 'text-xs', padding: 'px-3 py-3', lineHeight: 'leading-tight' },
                              large: { diameter: '160px', fontSize: 'text-sm', padding: 'px-4 py-4', lineHeight: 'leading-tight' }
                            };
                            const nodeSize = node.size || 'medium';
                            const sizeStyle = sizeStyles[nodeSize];

                            return (
                              <motion.div
                                key={node.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`absolute ${sizeStyle.padding} ${sizeStyle.fontSize} ${sizeStyle.lineHeight} rounded-full text-white font-semibold shadow-xl flex items-center justify-center`}
                                style={{
                                  left: `${node.x}px`,
                                  top: `${node.y}px`,
                                  width: sizeStyle.diameter,
                                  height: sizeStyle.diameter,
                                  backgroundColor: '#3b82f6',
                                }}
                                title={node.text}
                              >
                                <span className="text-center px-2 break-words line-clamp-2" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                  {node.text}
                                </span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                })()}
                </div>
              </div>

              <div className="text-center p-4 border-t bg-gray-50">
                <Badge variant="outline" className="text-base px-6 py-2">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {(() => {
                    const mapData = previewMap.bubbleMap.map_data;
                    if (mapData && 'questions' in mapData) {
                      const data = mapData as BubbleMapData;
                      const totalAnswers = data.questions?.reduce((sum, q) => sum + q.answers.length, 0) || 0;
                      return `${data.questions?.length || 0} preguntas • ${totalAnswers} respuestas`;
                    }
                    const nodes = (mapData as any)?.nodes || [];
                    return `${nodes.length} ideas totales`;
                  })()}
                </Badge>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Modal de Introducción de Etapa */}
      <EtapaIntroModal
        etapaNumero={2}
        isOpen={showEtapaIntro}
        onClose={() => {
          setShowEtapaIntro(false);
          if (sessionId) {
            localStorage.setItem(`etapa_intro_${sessionId}_2`, 'true');
          }
        }}
      />
    </div>
  );
}

