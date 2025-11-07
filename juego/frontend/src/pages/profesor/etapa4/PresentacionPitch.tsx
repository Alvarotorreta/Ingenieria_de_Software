import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, Clock, ArrowRight, ArrowUp, ArrowDown, Play, CheckCircle2, 
  FileText, Eye, X, Users, Trophy, Image as ImageIcon, Target, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { toast } from 'sonner';

interface Team {
  id: number;
  name: string;
  color: string;
}

interface SessionStage {
  id: number;
  presentation_order: number[] | null;
  current_presentation_team_id: number | null;
  presentation_state: string;
  presentation_timestamps?: Record<string, string>;
}

interface GameSession {
  id: number;
  room_code: string;
  current_stage_number?: number;
}

export function ProfesorPresentacionPitch() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<Team[]>([]);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [sessionStage, setSessionStage] = useState<SessionStage | null>(null);
  const [presentationOrder, setPresentationOrder] = useState<number[]>([]);
  const [currentPresentationTeamId, setCurrentPresentationTeamId] = useState<number | null>(null);
  const [presentationState, setPresentationState] = useState<string>('not_started');
  const [timerRemaining, setTimerRemaining] = useState<string>('03:00');
  const [currentTeamPrototype, setCurrentTeamPrototype] = useState<string | null>(null);
  const [currentTeamPitch, setCurrentTeamPitch] = useState<{
    intro_problem: string;
    solution: string;
    closing: string;
  } | null>(null);
  const [evaluationProgress, setEvaluationProgress] = useState<{
    completed: number;
    total: number;
  }>({ completed: 0, total: 0 });
  const [allEvaluations, setAllEvaluations] = useState<any[]>([]);
  const [showEvaluations, setShowEvaluations] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const localTimerSecondsRef = useRef<number>(180);
  const presentationStateRef = useRef<string>('not_started');
  const syncCounterRef = useRef<number>(0);

  useEffect(() => {
    if (sessionId) {
      loadGameControl();
      intervalRef.current = setInterval(() => {
        loadGameControl();
      }, 5000); // Cambiar a 5 segundos para reducir interferencia con el timer

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };
    }
  }, [sessionId]);

  // Polling específico para evaluaciones cuando está en estado 'evaluating'
  useEffect(() => {
    if (presentationState === 'evaluating' && currentPresentationTeamId && gameSession?.id) {
      const evalInterval = setInterval(() => {
        loadEvaluationProgress(currentPresentationTeamId);
      }, 2000); // Polling más frecuente para evaluaciones

      return () => clearInterval(evalInterval);
    }
  }, [presentationState, currentPresentationTeamId, gameSession]);

  // Calcular si todas las presentaciones están completadas
  const allPresentationsCompleted = presentationOrder.length > 0 && 
    !currentPresentationTeamId && 
    presentationState !== 'not_started';

  // Cargar todas las evaluaciones cuando todas las presentaciones estén completadas
  useEffect(() => {
    if (allPresentationsCompleted && gameSession?.id && !showEvaluations) {
      loadAllEvaluations();
    }
  }, [allPresentationsCompleted, gameSession, showEvaluations]);

  const loadGameControl = async () => {
    if (!sessionId) return;
    
    console.log('📥 Profesor - loadGameControl llamado con sessionId:', sessionId);

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

      const teamsResponse = await api.get(`/sessions/game-sessions/${sessionId}/teams/`);
      setTeams(teamsResponse.data);

      const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${sessionId}`);
      const stagesData = stagesResponse.data.results || stagesResponse.data;
      const stage4 = Array.isArray(stagesData)
        ? stagesData.find((s: any) => s.stage_number === 4)
        : null;

      if (stage4) {
        setSessionStage(stage4);
        
        // Si no hay orden de presentación, generarlo automáticamente
        if (!stage4.presentation_order || stage4.presentation_order.length === 0) {
          try {
            const orderResponse = await api.post(`/sessions/session-stages/${stage4.id}/generate_presentation_order/`);
            setPresentationOrder(orderResponse.data.presentation_order || []);
          } catch (error) {
            console.error('Error generating presentation order:', error);
            setPresentationOrder([]);
          }
        } else {
          setPresentationOrder(stage4.presentation_order);
        }
        
        setCurrentPresentationTeamId(stage4.current_presentation_team_id);
        const newPresentationState = stage4.presentation_state || 'not_started';
        setPresentationState(newPresentationState);
        presentationStateRef.current = newPresentationState; // Actualizar ref también

        if (stage4.current_presentation_team_id) {
          await loadPresentationContent(stage4.current_presentation_team_id);
          
          // Si hay un pitch en curso, obtener el tiempo restante del servidor y continuar el timer
          // IMPORTANTE: Usar stage4 directamente, no sessionStage (que aún no se ha actualizado)
          if (stage4.presentation_state === 'presenting') {
            // Obtener tiempo restante del servidor y continuar el timer
            // Esto es importante cuando se recarga la página durante una presentación
            console.log('🔍 Profesor - Estado: presenting, stage4.id:', stage4.id, 'timerInterval:', timerIntervalRef.current, 'currentState:', presentationStateRef.current);
            
            // SIEMPRE iniciar el timer si no hay uno activo (importante al recargar la página)
            if (!timerIntervalRef.current) {
              console.log('🔄 Profesor - Iniciando timer al cargar (hay pitch en curso, no hay timer activo)');
              await startPresentationTimer(stage4);
            } else {
              console.log('⏸️ Profesor - Timer ya está activo, no reiniciar');
            }
          } else {
            // Detener timer solo si realmente cambió el estado de 'presenting' a otro
            // Esto evita resetear el timer si el estado sigue siendo 'presenting'
            if (presentationStateRef.current === 'presenting' && newPresentationState !== 'presenting' && timerIntervalRef.current) {
              console.log('⏹️ Profesor - Deteniendo timer (estado cambió de presenting a', newPresentationState, ')');
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
              setTimerRemaining('03:00');
              localTimerSecondsRef.current = 180;
            }
          }
        }

        if (stage4.presentation_state === 'evaluating' && stage4.current_presentation_team_id) {
          await loadEvaluationProgress(stage4.current_presentation_team_id);
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

  const loadPresentationContent = async (teamId: number) => {
    try {
      // Obtener prototipo (Etapa 3)
      const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${sessionId}`);
      const stagesData = stagesResponse.data.results || stagesResponse.data;
      const stage3 = Array.isArray(stagesData)
        ? stagesData.find((s: any) => s.stage_number === 3)
        : null;

      if (stage3) {
        const activitiesResponse = await api.get('/challenges/activities/');
        const activities = activitiesResponse.data.results || activitiesResponse.data;
        const prototypeActivity = activities.find((a: any) => 
          a.stage === 3 && (a.name?.toLowerCase().includes('prototipo') || a.name?.toLowerCase().includes('lego'))
        );

        if (prototypeActivity) {
          const progressResponse = await api.get(
            `/sessions/team-activity-progress/?team=${teamId}&activity=${prototypeActivity.id}&session_stage=${stage3.id}`
          );
          const progressData = progressResponse.data;
          const progressArray = Array.isArray(progressData) ? progressData : progressData.results || [];
          const progress = progressArray[0];

          if (progress?.prototype_image_url) {
            let imageUrl = progress.prototype_image_url;
            if (imageUrl.startsWith('/')) {
              const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
              const baseUrl = apiBaseUrl.replace('/api', '');
              imageUrl = `${baseUrl}${imageUrl}`;
            }
            setCurrentTeamPrototype(imageUrl);
          }
        }
      }

      // Obtener pitch (Etapa 4)
      if (sessionStage) {
        const activitiesResponse = await api.get('/challenges/activities/');
        const activities = activitiesResponse.data.results || activitiesResponse.data;
        const pitchActivity = activities.find((a: any) => 
          a.stage === 4 && (a.name?.toLowerCase().includes('formulario') || a.name?.toLowerCase().includes('pitch'))
        );

        if (pitchActivity && sessionStage.id) {
          const progressResponse = await api.get(
            `/sessions/team-activity-progress/?team=${teamId}&activity=${pitchActivity.id}&session_stage=${sessionStage.id}`
          );
          const progressData = progressResponse.data;
          const progressArray = Array.isArray(progressData) ? progressData : progressData.results || [];
          const progress = progressArray[0];

          if (progress) {
            setCurrentTeamPitch({
              intro_problem: progress.pitch_intro_problem || '',
              solution: progress.pitch_solution || '',
              closing: progress.pitch_closing || '',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error loading presentation content:', error);
    }
  };

  const loadEvaluationProgress = async (presentingTeamId: number) => {
    try {
      if (!gameSession?.id) return;

      // Contar evaluaciones usando el endpoint de peer evaluations
      const otherTeams = teams.filter(t => t.id !== presentingTeamId);
      let completed = 0;

      console.log('📊 Cargando progreso de evaluaciones:', {
        presentingTeam: presentingTeamId,
        otherTeams: otherTeams.length,
        gameSession: gameSession?.id
      });

      for (const team of otherTeams) {
        try {
          const evalResponse = await api.get(
            `/sessions/peer-evaluations/?evaluator_team=${team.id}&evaluated_team=${presentingTeamId}&game_session=${gameSession?.id}`
          );
          const evalData = evalResponse.data;
          const evaluations = Array.isArray(evalData) ? evalData : evalData.results || [];
          
          console.log(`🔍 Evaluación equipo ${team.name} (${team.id}):`, {
            found: evaluations.length,
            evaluation: evaluations[0] || null
          });
          
          if (evaluations.length > 0) {
            completed++;
          }
        } catch (error) {
          console.error(`❌ Error checking evaluation for team ${team.id}:`, error);
        }
      }

      console.log('✅ Progreso de evaluaciones:', { completed, total: otherTeams.length });

      setEvaluationProgress({
        completed,
        total: otherTeams.length,
      });
    } catch (error) {
      console.error('❌ Error loading evaluation progress:', error);
    }
  };

  const startPresentationTimer = async (stage: SessionStage) => {
    console.log('🚀 Profesor - startPresentationTimer llamado con:', { 
      stage: stage?.id, 
      sessionStage: sessionStage?.id,
      currentTimer: timerIntervalRef.current,
      currentState: presentationStateRef.current
    });
    
    // Asegurarse de que el estado esté actualizado en el ref
    presentationStateRef.current = 'presenting';
    
    // Limpiar intervalo anterior si existe (como en el HTML)
    if (timerIntervalRef.current) {
      console.log('🧹 Profesor - Limpiando intervalo anterior');
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (!stage) {
      console.error('❌ Profesor - No se puede iniciar timer: stage faltante');
      return;
    }
    
    // Usar stage.id directamente, no sessionStage (que puede no estar actualizado)
    const stageId = stage.id;

    // Obtener el temporizador del servidor (como en el HTML)
    try {
      const timerResponse = await api.get(`/sessions/session-stages/${stageId}/presentation_timer/`);
      console.log('⏱️ Profesor - Respuesta del servidor:', timerResponse.data);
      
      if (timerResponse.data && !timerResponse.data.error) {
        // Verificar si el timer ya terminó
        const isFinished = timerResponse.data.is_finished === true;
        const serverRemaining = timerResponse.data.remaining_seconds ?? 180;
        
        if (isFinished || serverRemaining <= 0) {
          // El timer ya terminó, no iniciarlo
          console.log('⏹️ Profesor - Timer ya terminó en el servidor, no iniciar');
          localTimerSecondsRef.current = 0;
          setTimerRemaining('00:00');
          return; // No iniciar el intervalo
        }
        
        localTimerSecondsRef.current = serverRemaining;
        console.log('✅ Profesor - Tiempo restante del servidor:', serverRemaining, 'segundos');
      } else {
        // Fallback a 180 segundos si no se puede obtener del servidor
        console.warn('⚠️ Profesor - No se pudo obtener tiempo del servidor, usando 180 segundos');
        localTimerSecondsRef.current = 180;
      }
    } catch (error) {
      console.error('❌ Profesor - Error obteniendo temporizador del servidor:', error);
      localTimerSecondsRef.current = 180; // Fallback
    }

    // Actualizar display inicial
    const minutes = Math.floor(localTimerSecondsRef.current / 60);
    const seconds = localTimerSecondsRef.current % 60;
    setTimerRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    console.log('⏱️ Profesor - Timer iniciado con:', `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, 'state:', presentationStateRef.current);

    // Actualizar cada segundo (exactamente como en el HTML)
    // Guardar stageId en una variable para usarlo en el closure
    const stageIdForTimer = stageId;
    
    // Resetear contador de sincronización al iniciar
    syncCounterRef.current = 0;
    
    timerIntervalRef.current = setInterval(() => {
      // Verificar que el timer aún debería estar corriendo usando el ref (más actualizado)
      if (presentationStateRef.current !== 'presenting') {
        console.log('⏹️ Profesor - Timer se detuvo porque el estado cambió a:', presentationStateRef.current);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        return;
      }

      // Decrementar solo si es mayor a 0
      if (localTimerSecondsRef.current > 0) {
        localTimerSecondsRef.current--;
      }
      
      const minutes = Math.floor(localTimerSecondsRef.current / 60);
      const seconds = localTimerSecondsRef.current % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimerRemaining(timeString);
      
      // Log cada 10 segundos para debug
      if (localTimerSecondsRef.current > 0 && localTimerSecondsRef.current % 10 === 0) {
        console.log('⏱️ Profesor - Timer actualizado:', timeString, `(${localTimerSecondsRef.current}s restantes)`, 'intervalID:', timerIntervalRef.current);
      }

      if (localTimerSecondsRef.current <= 0) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        setTimerRemaining('00:00');
        console.log('⏱️ Profesor - Timer terminado');
        return;
      }
      
      syncCounterRef.current++;

      // Sincronizar con el servidor cada 5 segundos (como en el HTML)
      if (syncCounterRef.current % 5 === 0 && localTimerSecondsRef.current > 0) {
        // Usar una función async separada para no bloquear el intervalo
        (async () => {
          try {
            const timerResponse = await api.get(`/sessions/session-stages/${stageIdForTimer}/presentation_timer/`);
            if (timerResponse.data && !timerResponse.data.error) {
              const isFinished = timerResponse.data.is_finished === true;
              const serverRemaining = timerResponse.data.remaining_seconds ?? 0;
              
              // Si el servidor dice que terminó, detener el timer inmediatamente
              if (isFinished || serverRemaining <= 0) {
                console.log('⏹️ Profesor - Timer terminó en el servidor, deteniendo');
                if (timerIntervalRef.current) {
                  clearInterval(timerIntervalRef.current);
                  timerIntervalRef.current = null;
                }
                localTimerSecondsRef.current = 0;
                setTimerRemaining('00:00');
                return;
              }
              
              // Si hay una diferencia significativa (>2 segundos), sincronizar
              if (Math.abs(localTimerSecondsRef.current - serverRemaining) > 2) {
                console.log(`🔄 Profesor - Sincronizando: local=${localTimerSecondsRef.current}s, servidor=${serverRemaining}s`);
                localTimerSecondsRef.current = serverRemaining;
                const minutes = Math.floor(localTimerSecondsRef.current / 60);
                const seconds = localTimerSecondsRef.current % 60;
                setTimerRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
              }
            }
          } catch (error) {
            console.error('❌ Profesor - Error sincronizando temporizador:', error);
          }
        })();
      }
    }, 1000);
    
    console.log('✅ Profesor - Intervalo del timer iniciado, stageId:', stageIdForTimer, 'timerInterval ID:', timerIntervalRef.current);
  };

  const handleGenerateOrder = async () => {
    if (!sessionStage) return;

    try {
      const response = await api.post(`/sessions/session-stages/${sessionStage.id}/generate_presentation_order/`);
      setPresentationOrder(response.data.presentation_order || []);
      toast.success('Orden de presentación generado');
    } catch (error: any) {
      toast.error('Error al generar orden: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleMoveTeam = async (index: number, direction: 'up' | 'down') => {
    const newOrder = [...presentationOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    }
    setPresentationOrder(newOrder);
    
    // Actualizar automáticamente en el servidor
    if (sessionStage) {
      try {
        await api.post(`/sessions/session-stages/${sessionStage.id}/update_presentation_order/`, {
          presentation_order: newOrder,
        });
      } catch (error) {
        console.error('Error updating order:', error);
      }
    }
  };

  const handleUpdateOrder = async () => {
    if (!sessionStage) return;

    try {
      await api.post(`/sessions/session-stages/${sessionStage.id}/update_presentation_order/`, {
        presentation_order: presentationOrder,
      });
      // No mostrar toast, actualizar silenciosamente
    } catch (error: any) {
      console.error('Error updating order:', error);
    }
  };

  const handleStartPresentations = async () => {
    if (!sessionStage) return;

    try {
      await api.post(`/sessions/session-stages/${sessionStage.id}/start_presentation/`);
      toast.success('Presentaciones iniciadas');
      loadGameControl();
    } catch (error: any) {
      toast.error('Error al iniciar: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleStartTeamPitch = async () => {
    if (!sessionStage) return;

    try {
      // Llamar al endpoint para iniciar el pitch del equipo (esto guarda el timestamp en el servidor)
      const response = await api.post(`/sessions/session-stages/${sessionStage.id}/start_team_pitch/`);
      toast.success('✅ Pitch iniciado. El cronómetro comenzó.');
      
      // Iniciar el temporizador (como en el HTML)
      await startPresentationTimer(sessionStage);
      
      // Recargar datos para actualizar el estado
      loadGameControl();
    } catch (error: any) {
      toast.error('Error al iniciar presentación: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleFinishPresentation = async () => {
    if (!sessionStage) return;

    try {
      await api.post(`/sessions/session-stages/${sessionStage.id}/finish_team_presentation/`);
      
      // Detener el temporizador (como en el HTML)
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      setTimerRemaining('03:00');
      localTimerSecondsRef.current = 180;
      
      toast.success('✅ Presentación finalizada. Los equipos pueden evaluar ahora.');
      loadGameControl();
    } catch (error: any) {
      toast.error('Error al finalizar: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleNextPresentation = async () => {
    if (!sessionStage) return;

    try {
      const response = await api.post(`/sessions/session-stages/${sessionStage.id}/next_presentation/`);
      if (!response.data.current_presentation_team_id) {
        // Todas las presentaciones completadas
        toast.success('Todas las presentaciones completadas');
      } else {
        toast.success('Siguiente turno iniciado');
      }
      loadGameControl();
    } catch (error: any) {
      toast.error('Error al avanzar: ' + (error.response?.data?.error || error.message));
    }
  };

  const loadAllEvaluations = async () => {
    if (!gameSession?.id) return;

    try {
      const response = await api.get(`/sessions/peer-evaluations/for_professor/?game_session_id=${gameSession.id}`);
      setAllEvaluations(response.data || []);
      setShowEvaluations(true);
    } catch (error: any) {
      console.error('Error loading evaluations:', error);
    }
  };

  const handleGoToResults = async () => {
    if (!gameSession?.id) return;

    try {
      console.log('🎯 Profesor React - Completando Etapa 4 antes de ir a resultados...');
      
      // IMPORTANTE: Completar la etapa en el backend para que las tablets sepan que deben ir a resultados
      // Esto limpia current_activity y marca la etapa como completada
      try {
        // Usar fetch directamente para evitar problemas con Content-Type
        const token = localStorage.getItem('authToken');
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        
        const response = await fetch(`${API_BASE_URL}/sessions/game-sessions/${gameSession.id}/complete_stage/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ stage_number: 4 })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Profesor React - Etapa 4 completada en el backend:', data);
          console.log('   - current_activity después:', data.current_activity);
          console.log('   - current_activity_name después:', data.current_activity_name);
          toast.success('Etapa 4 completada. Las tablets serán redirigidas a resultados.');
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
          console.error('❌ Profesor React - Error del servidor:', {
            status: response.status,
            statusText: response.statusText,
            data: errorData
          });
          // No lanzar error, solo mostrar advertencia y continuar
          console.warn('⚠️ Profesor React - No se pudo completar la etapa, pero continuando...');
        }
      } catch (error: any) {
        // Solo mostrar advertencia si es un error de red o similar
        // Si es un error del servidor (response.ok === false), ya se manejó arriba
        if (error.name !== 'TypeError' && !error.message.includes('fetch')) {
          console.error('❌ Profesor React - Error completo:', error);
          console.warn('⚠️ Profesor React - No se pudo completar la etapa en el backend:', error);
          toast.warning('Advertencia: No se pudo completar la etapa, pero continuando...');
        }
      }
      
      // Redirigir a resultados después de completar la etapa
      navigate(`/profesor/resultados/${gameSession.id}/?stage_id=4`);
    } catch (error: any) {
      console.error('❌ Profesor React - Error:', error);
      toast.error('Error al ir a resultados: ' + (error.response?.data?.error || error.message));
    }
  };

  // NUEVO: Función más simple y directa para completar etapa y redirigir
  const handleCompleteStageAndRedirect = async () => {
    if (!gameSession?.id) {
      toast.error('No hay sesión activa');
      return;
    }

    console.log('🚀 [NUEVO BOTÓN] Iniciando completar etapa 4...');
    console.log('   - Session ID:', gameSession.id);
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('No hay token de autenticación');
        setLoading(false);
        return;
      }

      console.log('   - Usando axios para llamar al endpoint...');
      console.log('   - Intentando sin Content-Type explícito...');

      // Intentar sin especificar Content-Type en los headers
      // Dejar que axios lo maneje automáticamente
      const response = await api.post(
        `/sessions/game-sessions/${gameSession.id}/complete_stage/`,
        { stage_number: 4 },
        {
          headers: {
            // NO incluir Content-Type aquí, dejar que axios lo maneje
          }
        }
      );

      console.log('   - Response status:', response.status);
      console.log('   - Response data:', response.data);

      const data = response.data;
      console.log('✅ [NUEVO BOTÓN] Etapa completada exitosamente:', data);
      console.log('   - current_activity:', data.current_activity);
      console.log('   - current_activity_name:', data.current_activity_name);
      console.log('   - stage_completed:', data.stage_completed);
      
      toast.success('✅ Etapa 4 completada. Redirigiendo a resultados...');
      
      // Esperar un momento para que el backend procese todo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirigir
      window.location.href = `/profesor/resultados/${gameSession.id}/?stage_id=4`;
    } catch (error: any) {
      console.error('❌ [NUEVO BOTÓN] Error completo:', error);
      console.error('   - Error name:', error.name);
      console.error('   - Error message:', error.message);
      console.error('   - Error response:', error.response);
      console.error('   - Error stack:', error.stack);
      
      if (error.response) {
        const errorData = error.response.data || {};
        console.error('   - Error data:', errorData);
        toast.error(`Error ${error.response.status}: ${errorData.detail || errorData.error || errorData.message || 'Error desconocido'}`);
      } else {
        toast.error('Error al completar la etapa: ' + (error.message || 'Error desconocido'));
      }
      
      setLoading(false);
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

  const getTeamById = (teamId: number) => {
    return teams.find(t => t.id === teamId);
  };

  // Calcular estados derivados
  const currentTeamIndex = presentationOrder.findIndex(id => id === currentPresentationTeamId);
  const hasMorePresentations = currentTeamIndex >= 0 && currentTeamIndex < presentationOrder.length - 1;
  const allEvaluationsCompleted = evaluationProgress.completed >= evaluationProgress.total && evaluationProgress.total > 0;
  const shouldShowGoToResults = allEvaluationsCompleted && !hasMorePresentations && presentationState === 'evaluating';

  if (loading && !gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const currentTeam = currentPresentationTeamId ? getTeamById(currentPresentationTeamId) : null;
  
  // Nota: currentTeamIndex, hasMorePresentations, allEvaluationsCompleted y shouldShowGoToResults 
  // ya están definidos arriba (líneas 655-658) antes del return

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
              📢 Presentación del Pitch
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Código de sala: <span className="font-semibold">{gameSession?.room_code}</span>
            </p>
          </div>
          <Button onClick={() => navigate('/profesor/panel')} variant="outline" className="flex items-center gap-2">
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Volver al Panel</span>
            <span className="sm:hidden">Volver</span>
          </Button>
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
          <p className="text-gray-600 text-base sm:text-lg">
            Los equipos presentan su pitch y reciben evaluación de sus compañeros
          </p>
        </motion.div>

        {/* Orden de Presentación y Controles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-6 mb-6"
        >
          {/* Orden de Presentación - Solo mostrar si no ha iniciado */}
          {presentationState === 'not_started' && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#093c92] mb-4">Orden de Presentación</h3>
              <p className="text-gray-600 mb-4">
                Configura el orden en que los equipos presentarán. Puedes mover los equipos arriba o abajo.
              </p>

              {presentationOrder.length === 0 ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#093c92]" />
                  <p className="text-gray-500">Generando orden de presentación...</p>
                </div>
              ) : (
                <div className="space-y-3 mb-6">
                  {presentationOrder.map((teamId, index) => {
                    const team = getTeamById(teamId);
                    if (!team) return null;
                    return (
                      <div
                        key={teamId}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-transparent"
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: getTeamColorHex(team.color) }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#093c92]">{team.name}</p>
                          <p className="text-sm text-gray-600">Equipo {team.color}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            onClick={() => handleMoveTeam(index, 'up')}
                            disabled={index === 0}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleMoveTeam(index, 'down')}
                            disabled={index === presentationOrder.length - 1}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleGenerateOrder} variant="outline">
                      🎲 Regenerar Orden
                    </Button>
                  </div>
                </div>
              )}

              {presentationOrder.length > 0 && (
                <Button
                  onClick={handleStartPresentations}
                  className="bg-green-600 hover:bg-green-700 w-full"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  ▶️ Iniciar Presentaciones
                </Button>
              )}
            </div>
          )}

          {/* Estados de Presentación */}
          {presentationState !== 'not_started' && (
            <div>
              {/* Estado: Preparación */}
              {presentationState === 'preparing' && currentTeam && (
                <div className="bg-gradient-to-r from-[#093c92] to-[#764ba2] rounded-xl p-8 text-center text-white mb-6">
                  <div className="text-6xl mb-4">🎤</div>
                  <h2 className="text-3xl font-bold mb-4">
                    Iniciar Pitch del Equipo {currentTeam.name}
                  </h2>
                  <p className="text-lg mb-6 opacity-90">
                    El equipo debe prepararse para presentar. Pueden decidir quién presenta, revisar su pitch, etc.
                  </p>
                  <Button
                    onClick={handleStartTeamPitch}
                    className="bg-white text-[#093c92] hover:bg-gray-100 text-lg px-8 py-6"
                    size="lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    ▶️ Iniciar Pitch - {currentTeam.name}
                  </Button>
                </div>
              )}

              {/* Estado: Presentando */}
              {presentationState === 'presenting' && currentTeam && (
                <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 mb-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🎤</div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      {currentTeam.name} está presentando
                    </h3>
                    <p className="text-green-700">El equipo está presentando su pitch</p>
                  </div>

                  {/* Timer */}
                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 text-center mb-6">
                    <p className="text-yellow-800 font-semibold text-lg mb-2">⏱️ Tiempo</p>
                    <p className="text-5xl font-bold text-yellow-900 font-mono">{timerRemaining}</p>
                  </div>

                  {/* Prototipo y Pitch */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Prototipo */}
                    <div className="bg-white rounded-lg p-4 shadow">
                      <h4 className="font-semibold text-lg text-[#093c92] mb-3 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" /> Prototipo del Equipo
                      </h4>
                      {currentTeamPrototype ? (
                        <img
                          src={currentTeamPrototype}
                          alt="Prototipo"
                          className="w-full rounded-lg shadow-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <p className="text-gray-400 italic text-center py-8">No hay prototipo</p>
                      )}
                    </div>

                    {/* Pitch */}
                    <div className="bg-white rounded-lg p-4 shadow">
                      <h4 className="font-semibold text-lg text-[#093c92] mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Guion del Pitch
                      </h4>
                      {currentTeamPitch ? (
                        <div className="space-y-4 text-sm">
                          <div>
                            <h5 className="font-semibold text-[#093c92] mb-1 flex items-center gap-1">
                              <Target className="w-4 h-4" /> Problema
                            </h5>
                            <p className="text-gray-700 whitespace-pre-wrap">{currentTeamPitch.intro_problem || 'No completado'}</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-[#093c92] mb-1 flex items-center gap-1">
                              <Lightbulb className="w-4 h-4" /> Solución
                            </h5>
                            <p className="text-gray-700 whitespace-pre-wrap">{currentTeamPitch.solution || 'No completado'}</p>
                          </div>
                          <div>
                            <h5 className="font-semibold text-[#093c92] mb-1 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Cierre
                            </h5>
                            <p className="text-gray-700 whitespace-pre-wrap">{currentTeamPitch.closing || 'No completado'}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic text-center py-8">No hay guion</p>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleFinishPresentation}
                      className="bg-red-600 hover:bg-red-700"
                      size="lg"
                    >
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      ✓ Finalizar Presentación - {currentTeam.name}
                    </Button>
                  </div>
                </div>
              )}

              {/* Estado: Evaluando */}
              {presentationState === 'evaluating' && currentTeam && (
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-6">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">⭐</div>
                    <h3 className="text-2xl font-bold text-yellow-800 mb-2">
                      Evaluación - {currentTeam.name}
                    </h3>
                    <p className="text-yellow-700">Los otros equipos están evaluando al equipo que acaba de presentar</p>
                  </div>

                  {/* Progreso de evaluaciones */}
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-lg text-[#093c92] mb-3">📊 Progreso de Evaluaciones:</h4>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                      <div
                        className="bg-green-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${evaluationProgress.total > 0 ? (evaluationProgress.completed / evaluationProgress.total) * 100 : 0}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {evaluationProgress.completed} de {evaluationProgress.total} equipos han evaluado
                    </p>
                  </div>

                  <div className="text-center">
                    {shouldShowGoToResults ? (
                      // Si todas las evaluaciones están completadas y no hay más equipos por presentar
                      <Button
                        onClick={handleCompleteStageAndRedirect}
                        disabled={loading}
                        className="bg-yellow-500 hover:bg-yellow-600 text-lg px-8 py-6 disabled:opacity-50"
                        size="lg"
                      >
                        <Trophy className="w-5 h-5 mr-2" />
                        {loading ? '⏳ Completando...' : '🏆 Ver Resultados de la Etapa'}
                      </Button>
                    ) : allEvaluationsCompleted && hasMorePresentations ? (
                      // Si todas las evaluaciones están completadas pero hay más equipos por presentar
                      <Button
                        onClick={handleNextPresentation}
                        className="bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <ArrowRight className="w-5 h-5 mr-2" />
                        ➡️ Siguiente Turno
                      </Button>
                    ) : (
                      <p className="text-yellow-800 font-semibold">
                        Esperando a que todos los equipos completen su evaluación...
                        ({evaluationProgress.completed} de {evaluationProgress.total})
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Estado: Completado */}
              {allPresentationsCompleted && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-8 text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-3xl font-bold text-blue-800 mb-4">
                      ¡Todas las Presentaciones Completadas!
                    </h2>
                    <p className="text-blue-700 text-lg mb-6">
                      Todos los equipos han presentado y sido evaluados
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => {
                          if (!showEvaluations) {
                            loadAllEvaluations();
                          } else {
                            setShowEvaluations(false);
                          }
                        }}
                        className="bg-purple-500 hover:bg-purple-600 text-lg px-6 py-3"
                        size="lg"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        {showEvaluations ? 'Ocultar' : 'Ver'} Evaluaciones
                      </Button>
                      <Button
                        onClick={handleCompleteStageAndRedirect}
                        disabled={loading}
                        className="bg-yellow-500 hover:bg-yellow-600 text-lg px-8 py-6 disabled:opacity-50"
                        size="lg"
                      >
                        <Trophy className="w-5 h-5 mr-2" />
                        {loading ? '⏳ Completando...' : '🏆 Ver Resultados de la Etapa'}
                      </Button>
                    </div>
                  </div>

                  {/* Mostrar todas las evaluaciones */}
                  {showEvaluations && allEvaluations.length > 0 && (
                    <div className="bg-white border-2 border-gray-300 rounded-xl p-6">
                      <h3 className="text-2xl font-bold text-[#093c92] mb-4">📊 Todas las Evaluaciones</h3>
                      <div className="space-y-4">
                        {allEvaluations.map((evaluation, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold text-lg">
                                  {evaluation.evaluator_team_name} → {evaluation.evaluated_team_name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Puntuación Total: <span className="font-bold text-green-600">{evaluation.total_score}</span> | 
                                  Tokens: <span className="font-bold text-yellow-600">{evaluation.tokens_awarded}</span>
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-3">
                              <div>
                                <p className="text-sm text-gray-600">Claridad</p>
                                <p className="font-semibold">{evaluation.criteria_scores?.clarity || 0}/10</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Solución</p>
                                <p className="font-semibold">{evaluation.criteria_scores?.solution || 0}/10</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Presentación</p>
                                <p className="font-semibold">{evaluation.criteria_scores?.presentation || 0}/10</p>
                              </div>
                            </div>
                            {evaluation.feedback && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm text-gray-600">Feedback:</p>
                                <p className="text-gray-800">{evaluation.feedback}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

