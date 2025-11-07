import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, Clock, Mic, Star, FileText, Target, Lightbulb, CheckCircle2, Image as ImageIcon, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import api from '@/services/api';
import { toast } from 'sonner';

interface Team {
  id: number;
  name: string;
  color: string;
  tokens: number;
}

interface PresentationStatus {
  presentation_order: number[];
  current_presentation_team_id: number | null;
  teams: Team[];
  order_confirmed: boolean;
  completed_team_ids: number[];
  presentation_state: string;
  current_team_prototype: string | null;
  current_team_pitch: {
    intro_problem: string;
    solution: string;
    closing: string;
  } | null;
}

interface GameSession {
  id: number;
  current_stage_number?: number;
}

export function TabletPresentacionPitch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [sessionStageId, setSessionStageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [presentationStatus, setPresentationStatus] = useState<PresentationStatus | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<string>('03:00');
  const [evaluationSubmitted, setEvaluationSubmitted] = useState(false);
  const [evaluationScores, setEvaluationScores] = useState({
    clarity: 5,
    solution: 5,
    presentation: 5,
    feedback: '',
  });
  const [receivedEvaluations, setReceivedEvaluations] = useState<any[]>([]);
  const [showMyEvaluations, setShowMyEvaluations] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousPresentationStateRef = useRef<string | null>(null);
  const previousPresentationTeamIdRef = useRef<number | null>(null);
  const localTimerSecondsRef = useRef<number>(180);
  const previousEvaluatedTeamIdRef = useRef<number | null>(null);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    
    // Cargar estado inicial
    loadGameState(connId);
    
    // Configurar polling inicial (cada 2 segundos para detectar cambios rápidamente)
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      console.log('🔄 Tablet - Polling automático para detectar cambios...');
      loadGameState(connId);
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [searchParams, navigate]);

  const loadGameState = async (connId: string) => {
    try {
      const statusResponse = await api.get(`/sessions/tablet-connections/status/?connection_id=${connId}`);

      if (statusResponse.status === 404) {
        toast.error('Conexión no encontrada. Por favor reconecta.');
        setTimeout(() => {
          navigate('/tablet/join');
        }, 2000);
        return;
      }

      const statusData = statusResponse.data;
      const teamData: Team = statusData.team;
      setTeam(teamData);
      setGameSessionId(statusData.game_session.id);

      const gameResponse = await api.get(`/sessions/game-sessions/${statusData.game_session.id}/`);
      const gameData: GameSession = gameResponse.data;

      const currentStageNumber = gameData.current_stage_number || 1;
      const currentActivityName = gameData.current_activity_name?.toLowerCase() || '';
      const currentActivityId = gameData.current_activity;

      console.log('📊 Tablet - Estado del juego:', {
        stageNumber: currentStageNumber,
        activityName: currentActivityName,
        activityId: currentActivityId,
        hasActivity: !!currentActivityName && currentActivityName.trim() !== '',
        current_activity: gameData.current_activity,
        current_activity_name: gameData.current_activity_name
      });

      // Si no estamos en etapa 4, redirigir según la etapa actual
      if (currentStageNumber !== 4) {
        if (currentStageNumber === 3) {
          const normalizedName = currentActivityName;
          if (normalizedName.includes('prototipo') || normalizedName.includes('lego')) {
            window.location.href = `/tablet/etapa3/prototipo/?connection_id=${connId}`;
          } else {
            window.location.href = `/tablet/etapa3/resultados/?connection_id=${connId}`;
          }
        } else if (currentStageNumber > 4 || (!currentActivityName && currentStageNumber === 4)) {
          // Si la etapa 4 está completada (no hay actividad actual) o estamos en etapa > 4, ir a resultados
          console.log('✅ Tablet - Etapa 4 completada o no hay actividad, redirigiendo a resultados');
          window.location.href = `/tablet/resultados/?connection_id=${connId}&stage_id=4`;
          return;
        } else {
          window.location.href = `/tablet/lobby?connection_id=${connId}`;
        }
        return;
      }

      // Si estamos en etapa 4 pero no hay actividad actual, significa que la etapa fue completada
      // Esto es CRÍTICO: cuando el profesor llama a complete_stage, current_activity se limpia
      if (currentStageNumber === 4 && (!currentActivityName || !currentActivityId)) {
        console.log('✅ Tablet - Etapa 4 sin actividad (completada), redirigiendo a resultados', {
          activityName: currentActivityName,
          activityId: currentActivityId,
          current_activity: gameData.current_activity,
          current_activity_name: gameData.current_activity_name
        });
        window.location.href = `/tablet/resultados/?connection_id=${connId}&stage_id=4`;
        return;
      }

      const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${statusData.game_session.id}`);
      const stagesData = stagesResponse.data.results || stagesResponse.data;
      const stage4 = Array.isArray(stagesData)
        ? stagesData.find((s: any) => s.stage_number === 4)
        : null;

      console.log('🔍 Tablet - Verificando etapa 4:', {
        stage4Exists: !!stage4,
        stage4Status: stage4?.status,
        stage4Id: stage4?.id,
        currentActivityName: currentActivityName,
        currentActivityId: currentActivityId,
        hasNoActivity: !currentActivityName || !currentActivityId
      });

      // CRÍTICO: Si la etapa 4 está marcada como completada, significa que el profesor ya está en resultados
      // Las tablets deben redirigirse automáticamente
      if (stage4 && stage4.status === 'completed') {
        console.log('✅ Tablet - Etapa 4 completada (profesor en resultados), redirigiendo automáticamente');
        window.location.href = `/tablet/resultados/?connection_id=${connId}&stage_id=4`;
        return;
      }

      if (stage4) {
        // Verificar si todas las presentaciones están completadas (no hay current_presentation_team_id y el estado no es 'not_started')
        const allPresentationsCompleted = 
          !stage4.current_presentation_team_id && 
          stage4.presentation_state !== 'not_started' &&
          stage4.presentation_order &&
          stage4.presentation_order.length > 0;
        
        // CRÍTICO: Verificar si no hay actividad actual (significa que el profesor completó la etapa)
        const noCurrentActivity = !currentActivityName || currentActivityName.trim() === '';
        
        // Si todas las presentaciones están completadas O no hay actividad actual
        // (Ya verificamos stageCompleted arriba, así que no lo repetimos aquí)
        if (allPresentationsCompleted || noCurrentActivity) {
          // Todas las presentaciones están completadas o la etapa fue completada, redirigir a resultados
          console.log('✅ Tablet - Redirigiendo a resultados:', {
            allPresentationsCompleted,
            noActivity: noCurrentActivity,
            currentActivityName: currentActivityName,
            presentationState: stage4.presentation_state,
            stage4Status: stage4.status
          });
          window.location.href = `/tablet/resultados/?connection_id=${connId}&stage_id=4`;
          return;
        }
        
        setSessionStageId(stage4.id);
        await loadPresentationStatus(stage4.id, connId);
      } else {
        // Si no hay stage4 pero estamos en etapa 4 y no hay actividad, redirigir a resultados
        if (currentStageNumber === 4 && (!currentActivityName || !currentActivityId)) {
          console.log('✅ Tablet - No hay stage4 pero etapa 4 completada (sin actividad), redirigiendo a resultados');
          window.location.href = `/tablet/resultados/?connection_id=${connId}&stage_id=4`;
          return;
        }
      }

      setLoading(false);
      
      // El polling se ajusta automáticamente en loadPresentationStatus según el estado
    } catch (error: any) {
      console.error('Error loading game state:', error);
      toast.error('Error de conexión: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  const loadPresentationStatus = async (stageId: number, connId?: string) => {
    console.log('📥 Tablet - loadPresentationStatus llamado con stageId:', stageId);
    try {
      const response = await api.get(`/sessions/session-stages/${stageId}/presentation_status/`);
      const status: PresentationStatus = response.data;
      console.log('📊 Tablet - Estado recibido:', {
        presentation_state: status.presentation_state,
        current_presentation_team_id: status.current_presentation_team_id,
        my_team_id: team?.id,
        has_team: !!team
      });
      
      // Detectar cambios de estado ANTES de actualizar las referencias
      const stateChanged = previousPresentationStateRef.current !== status.presentation_state;
      const teamChanged = previousPresentationTeamIdRef.current !== status.current_presentation_team_id;
      const wasPreparing = previousPresentationStateRef.current === 'preparing';
      const isNowPresenting = status.presentation_state === 'presenting';
      
      setPresentationStatus(status);
      
      // Actualizar referencias DESPUÉS de verificar cambios
      previousPresentationStateRef.current = status.presentation_state;
      previousPresentationTeamIdRef.current = status.current_presentation_team_id || null;

      // Ajustar polling según el estado actual
      // Si estamos en 'preparing', hacer polling más frecuente (1 segundo) para detectar el inicio rápido
      // NO reemplazar el polling principal aquí, solo ajustar si no existe
      // El polling principal se configura en el useEffect inicial y debe mantenerse activo
      // para detectar cuando el profesor completa la etapa
      if (!intervalRef.current) {
        const currentConnId = connId || connectionId;
        if (currentConnId) {
          // Reducir el intervalo de polling cuando estamos en evaluating o cuando puede haber cambios
          // Esto ayuda a detectar más rápidamente cuando el profesor completa la etapa
          const pollInterval = status.presentation_state === 'preparing' ? 1000 : 
                              status.presentation_state === 'evaluating' ? 2000 : 3000;
          intervalRef.current = setInterval(() => {
            console.log('🔄 Tablet - Polling desde loadPresentationStatus...');
            loadGameState(currentConnId);
          }, pollInterval);
        }
      }

      // Verificar si cambió el equipo que se está evaluando
      // IMPORTANTE: Esto debe verificarse ANTES de actualizar las referencias
      const evaluatedTeamChanged = 
        status.presentation_state === 'evaluating' &&
        status.current_presentation_team_id &&
        previousEvaluatedTeamIdRef.current !== null &&
        previousEvaluatedTeamIdRef.current !== status.current_presentation_team_id;

      // Si cambió el equipo que se está evaluando, resetear el estado de evaluación INMEDIATAMENTE
      if (evaluatedTeamChanged) {
        console.log('🔄 Tablet - Cambió el equipo a evaluar de', previousEvaluatedTeamIdRef.current, 'a', status.current_presentation_team_id, '- reseteando estado de evaluación');
        // CRÍTICO: Resetear el estado ANTES de actualizar la referencia y verificar evaluación
        setEvaluationSubmitted(false);
        setEvaluationScores({
          clarity: 5,
          solution: 5,
          presentation: 5,
          feedback: '',
        });
        // Actualizar la referencia INMEDIATAMENTE después de resetear
        previousEvaluatedTeamIdRef.current = status.current_presentation_team_id;
        // Ahora verificar si ya existe una evaluación para el NUEVO equipo
        await checkExistingEvaluation(status.current_presentation_team_id);
      } else if (status.presentation_state === 'evaluating' && 
          status.current_presentation_team_id && 
          status.current_presentation_team_id !== team?.id) {
        // Si no cambió el equipo pero estamos en evaluating, verificar si ya existe evaluación
        // Solo si la referencia aún no está actualizada (primera vez que vemos este equipo)
        if (previousEvaluatedTeamIdRef.current !== status.current_presentation_team_id) {
          // Primera vez que vemos este equipo, actualizar referencia y verificar evaluación
          previousEvaluatedTeamIdRef.current = status.current_presentation_team_id;
          await checkExistingEvaluation(status.current_presentation_team_id);
        }
        // Si ya estamos evaluando este equipo (referencia coincide), no hacer nada
        // El estado ya está correcto de la verificación anterior
      } else if (status.presentation_state !== 'evaluating') {
        // Si no estamos en estado evaluating, resetear la referencia y el estado
        if (previousEvaluatedTeamIdRef.current !== null) {
          console.log('🔄 Tablet - Ya no estamos en evaluating, reseteando referencia de equipo evaluado');
          previousEvaluatedTeamIdRef.current = null;
          setEvaluationSubmitted(false);
        }
      } else if (status.presentation_state === 'evaluating' && !previousEvaluatedTeamIdRef.current && status.current_presentation_team_id) {
        // Primera vez que entramos a evaluating, inicializar la referencia y verificar evaluación
        previousEvaluatedTeamIdRef.current = status.current_presentation_team_id;
        await checkExistingEvaluation(status.current_presentation_team_id);
      }

      // Iniciar timer si hay un equipo presentando (TODOS los equipos ven el timer)
      // Cambio importante: NO verificamos si es nuestro equipo, todos deben ver el timer
      if (isNowPresenting && status.current_presentation_team_id) {
        // Verificar primero si el timer ya terminó en el servidor
        try {
          const timerCheckResponse = await api.get(`/sessions/session-stages/${stageId}/presentation_timer/`);
          if (timerCheckResponse.data && !timerCheckResponse.data.error) {
            const isFinished = timerCheckResponse.data.is_finished === true;
            const serverRemaining = timerCheckResponse.data.remaining_seconds ?? 0;
            
            if (isFinished || serverRemaining <= 0) {
              // El timer ya terminó, no iniciarlo
              console.log('⏹️ Tablet - Timer ya terminó en el servidor, no iniciar');
              if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
              }
              localTimerSecondsRef.current = 0;
              setTimerRemaining('00:00');
            } else {
              // SIEMPRE iniciar el timer si no hay uno activo (importante al recargar la página)
              if (!timerIntervalRef.current) {
                console.log('🔄 Tablet - Iniciando timer (no hay timer activo, probablemente recarga de página)');
                await startPresentationTimer(stageId);
              } else if (stateChanged || wasPreparing) {
                // Reiniciar el timer si el estado cambió de 'preparing' a 'presenting'
                console.log('🔄 Tablet - Reiniciando timer (estado cambió)');
                await startPresentationTimer(stageId);
              } else {
                console.log('⏸️ Tablet - Timer ya está activo, no reiniciar');
              }
            }
          }
        } catch (error) {
          console.error('❌ Tablet - Error verificando timer:', error);
          // En caso de error, intentar iniciar normalmente
          if (!timerIntervalRef.current) {
            await startPresentationTimer(stageId);
          }
        }
      } else {
        // Detener timer si ya no está presentando
        if (timerIntervalRef.current) {
          console.log('⏹️ Tablet - Deteniendo timer (ya no está presentando)');
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      }
    } catch (error) {
      console.error('Error loading presentation status:', error);
    }
  };

  const checkExistingEvaluation = async (evaluatedTeamId: number) => {
    if (!team || !gameSessionId) {
      console.warn('⚠️ Tablet - No se puede verificar evaluación: team o gameSessionId faltante');
      return;
    }

    try {
      console.log('🔍 Tablet - Verificando evaluación existente para equipo:', evaluatedTeamId, 'evaluador:', team.id);
      const response = await api.get(
        `/sessions/peer-evaluations/?evaluator_team=${team.id}&evaluated_team=${evaluatedTeamId}&game_session=${gameSessionId}`
      );
      const data = response.data;
      const evaluations = Array.isArray(data) ? data : data.results || [];
      
      if (evaluations.length > 0) {
        const evaluation = evaluations[0];
        console.log('✅ Tablet - Evaluación encontrada para equipo', evaluatedTeamId, '- marcando como enviada');
        setEvaluationSubmitted(true);
        setEvaluationScores({
          clarity: evaluation.criteria_scores?.clarity || 5,
          solution: evaluation.criteria_scores?.solution || 5,
          presentation: evaluation.criteria_scores?.presentation || 5,
          feedback: evaluation.feedback || '',
        });
      } else {
        console.log('📝 Tablet - No hay evaluación existente para equipo', evaluatedTeamId, '- mostrando formulario');
        setEvaluationSubmitted(false);
      }
    } catch (error) {
      console.error('❌ Tablet - Error verificando evaluación existente:', error);
      // En caso de error, asumir que no hay evaluación y mostrar el formulario
      setEvaluationSubmitted(false);
    }
  };

  const startPresentationTimer = async (stageId: number) => {
    console.log('🚀 Tablet - startPresentationTimer llamado con stageId:', stageId, 'currentTimer:', timerIntervalRef.current);
    
    // Limpiar intervalo anterior si existe
    if (timerIntervalRef.current) {
      console.log('🧹 Tablet - Limpiando intervalo anterior');
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Obtener el temporizador del servidor (como en el HTML)
    try {
      const timerResponse = await api.get(`/sessions/session-stages/${stageId}/presentation_timer/`);
      console.log('⏱️ Tablet - Respuesta del servidor:', timerResponse.data);
      
      if (timerResponse.data && !timerResponse.data.error) {
        // Verificar si el timer ya terminó
        const isFinished = timerResponse.data.is_finished === true;
        const serverRemaining = timerResponse.data.remaining_seconds ?? 180;
        
        if (isFinished || serverRemaining <= 0) {
          // El timer ya terminó, no iniciarlo
          console.log('⏹️ Tablet - Timer ya terminó en el servidor, no iniciar');
          localTimerSecondsRef.current = 0;
          setTimerRemaining('00:00');
          return; // No iniciar el intervalo
        }
        
        localTimerSecondsRef.current = serverRemaining;
        console.log('✅ Tablet - Tiempo restante del servidor:', serverRemaining, 'segundos');
      } else {
        // Si no se puede obtener, usar 180 segundos
        console.warn('⚠️ Tablet - No se pudo obtener tiempo del servidor, usando 180 segundos');
        localTimerSecondsRef.current = 180;
      }
    } catch (error) {
      console.error('❌ Tablet - Error obteniendo temporizador:', error);
      localTimerSecondsRef.current = 180;
    }

    // Actualizar display inicial
    const minutes = Math.floor(localTimerSecondsRef.current / 60);
    const seconds = localTimerSecondsRef.current % 60;
    setTimerRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    console.log('⏱️ Tablet - Timer iniciado con:', `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

    // Actualizar cada segundo (exactamente como en el HTML)
    timerIntervalRef.current = setInterval(async () => {
      if (localTimerSecondsRef.current > 0) {
        localTimerSecondsRef.current--;
      }
      
      const minutes = Math.floor(localTimerSecondsRef.current / 60);
      const seconds = localTimerSecondsRef.current % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimerRemaining(timeString);
      
      // Log cada 10 segundos para debug
      if (localTimerSecondsRef.current % 10 === 0) {
        console.log('⏱️ Tablet - Timer actualizado:', timeString, `(${localTimerSecondsRef.current}s restantes)`);
      }

      if (localTimerSecondsRef.current <= 0) {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        setTimerRemaining('00:00');
        console.log('⏱️ Tablet - Timer terminado');
      }

      // Sincronizar con el servidor cada 5 segundos (como en el HTML)
      if (localTimerSecondsRef.current % 5 === 0 && localTimerSecondsRef.current > 0) {
        try {
          const timerResponse = await api.get(`/sessions/session-stages/${stageId}/presentation_timer/`);
          if (timerResponse.data && !timerResponse.data.error) {
            const isFinished = timerResponse.data.is_finished === true;
            const serverRemaining = timerResponse.data.remaining_seconds ?? 0;
            
            // Si el servidor dice que terminó, detener el timer inmediatamente
            if (isFinished || serverRemaining <= 0) {
              console.log('⏹️ Tablet - Timer terminó en el servidor, deteniendo');
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
              console.log(`🔄 Tablet - Sincronizando: local=${localTimerSecondsRef.current}s, servidor=${serverRemaining}s`);
              localTimerSecondsRef.current = serverRemaining;
              const minutes = Math.floor(localTimerSecondsRef.current / 60);
              const seconds = localTimerSecondsRef.current % 60;
              setTimerRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
          }
        } catch (error) {
          console.error('❌ Tablet - Error sincronizando temporizador:', error);
        }
      }
    }, 1000);
    
    console.log('✅ Tablet - Intervalo del timer iniciado');
  };

  const loadMyEvaluations = async () => {
    if (!team || !gameSessionId) return;

    try {
      const response = await api.get(`/sessions/peer-evaluations/for_team/?team_id=${team.id}&game_session_id=${gameSessionId}`);
      setReceivedEvaluations(response.data || []);
      setShowMyEvaluations(true);
    } catch (error: any) {
      console.error('Error loading my evaluations:', error);
    }
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !gameSessionId || !presentationStatus?.current_presentation_team_id) return;

    // Verificar si ya se envió una evaluación
    if (evaluationSubmitted) {
      toast.warning('Ya has enviado tu evaluación');
      return;
    }

    try {
      const response = await api.post('/sessions/peer-evaluations/', {
        evaluator_team_id: team.id,
        evaluated_team_id: presentationStatus.current_presentation_team_id,
        game_session_id: gameSessionId,
        criteria_scores: {
          clarity: evaluationScores.clarity,
          solution: evaluationScores.solution,
          presentation: evaluationScores.presentation,
        },
        feedback: evaluationScores.feedback,
      });

      console.log('✅ Evaluación guardada:', response.data);
      
      setEvaluationSubmitted(true);
      toast.success('✓ Evaluación enviada exitosamente');

      // Actualizar tokens del equipo
      const statusResponse = await api.get(`/sessions/tablet-connections/status/?connection_id=${connectionId}`);
      if (statusResponse.data.team) {
        setTeam(statusResponse.data.team);
      }
    } catch (error: any) {
      console.error('❌ Error submitting evaluation:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Error al enviar evaluación: ' + (error.response?.data?.error || error.message));
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

  const getEvaluatedTeamName = () => {
    if (!presentationStatus?.current_presentation_team_id) return '';
    const evaluatedTeam = presentationStatus.teams.find(
      t => t.id === presentationStatus.current_presentation_team_id
    );
    return evaluatedTeam?.name || '';
  };

  const getMyPosition = () => {
    if (!team || !presentationStatus?.presentation_order) return null;
    const position = presentationStatus.presentation_order.findIndex(teamId => teamId === team.id);
    return position >= 0 ? position + 1 : null; // +1 porque es 1-indexado
  };

  const getCurrentPresentingPosition = () => {
    if (!presentationStatus?.current_presentation_team_id || !presentationStatus?.presentation_order) return null;
    const position = presentationStatus.presentation_order.findIndex(
      teamId => teamId === presentationStatus.current_presentation_team_id
    );
    return position >= 0 ? position + 1 : null;
  };

  const getPositionText = (position: number) => {
    const positionMap: Record<number, string> = {
      1: 'primero',
      2: 'segundo',
      3: 'tercero',
      4: 'cuarto',
      5: 'quinto',
      6: 'sexto',
      7: 'séptimo',
      8: 'octavo',
      9: 'noveno',
      10: 'décimo',
    };
    return positionMap[position] || `${position}°`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!team || !presentationStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Cargando información de presentación...</p>
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  const isMyTurn = presentationStatus.current_presentation_team_id === team.id;
  const presentationState = presentationStatus.presentation_state || 'not_started';
  const isEvaluating = presentationState === 'evaluating' && !isMyTurn;
  const isPresenting = presentationState === 'presenting' && isMyTurn;
  const isPreparing = presentationState === 'preparing' && isMyTurn;
  const isWaiting = !isMyTurn && presentationState !== 'evaluating';

  // Construir URL de prototipo si existe
  let prototypeUrl = presentationStatus.current_team_prototype;
  if (prototypeUrl && prototypeUrl.startsWith('/')) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const baseUrl = apiBaseUrl.replace('/api', '');
    prototypeUrl = `${baseUrl}${prototypeUrl}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
              style={{ backgroundColor: getTeamColorHex(team.color) }}
            >
              {team.color.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#093c92]">{team.name}</h3>
              <p className="text-sm text-gray-600">Equipo {team.color}</p>
            </div>
          </div>
          <div className="bg-[#093c92] text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
            🪙 {team.tokens} Tokens
          </div>
        </motion.div>

        {/* Estado: Esperando Orden */}
        {presentationState === 'not_started' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 text-center"
          >
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-4">
              Esperando Orden de Presentación
            </h2>
            <p className="text-gray-600 text-lg">
              El profesor está configurando el orden de presentación. Espera a que se inicien las presentaciones.
            </p>
          </motion.div>
        )}

        {/* Estado: Preparación */}
        {isPreparing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-[#093c92] to-[#764ba2] rounded-2xl shadow-2xl p-8 text-center text-white"
          >
            <div className="text-6xl mb-4">🎤</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Prepárense para Presentar</h2>
            <p className="text-lg mb-2 opacity-90">
              El equipo <span className="font-bold">{team.name}</span> está a punto de presentar su pitch.
            </p>
            <p className="text-base opacity-80">
              El profesor iniciará la presentación cuando estén listos. Tengan su pitch preparado.
            </p>
          </motion.div>
        )}

        {/* Estado: Presentando */}
        {isPresenting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🎤</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">Presentación en Curso</h2>
              <p className="text-gray-600 text-lg">El equipo {team.name} está presentando su pitch</p>
            </div>

            {/* Timer */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-6 text-center mb-6">
              <p className="text-yellow-800 font-semibold text-lg mb-2">⏱️ Tiempo Restante</p>
              <p className={`text-5xl sm:text-6xl font-bold text-yellow-900 font-mono ${
                parseInt(timerRemaining.split(':')[0]) < 1 ? 'text-red-600 animate-pulse' : ''
              }`}>
                {timerRemaining}
              </p>
            </div>

            {/* Prototipo y Guion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Prototipo (visible para todos) */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg text-[#093c92] mb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Prototipo del Equipo
                </h3>
                {prototypeUrl ? (
                  <img
                    src={prototypeUrl}
                    alt="Prototipo"
                    className="w-full rounded-lg shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <p className="text-gray-400 italic text-center py-8">No hay prototipo disponible</p>
                )}
              </div>

              {/* Guion (solo para el equipo que presenta) */}
              {presentationStatus.current_team_pitch && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-[#093c92] mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Tu Guion de Pitch
                  </h3>
                  <div className="space-y-4 text-sm">
                    {presentationStatus.current_team_pitch.intro_problem && (
                      <div>
                        <h4 className="font-semibold text-[#093c92] mb-1 flex items-center gap-1">
                          <Target className="w-4 h-4" /> Problema
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{presentationStatus.current_team_pitch.intro_problem}</p>
                      </div>
                    )}
                    {presentationStatus.current_team_pitch.solution && (
                      <div>
                        <h4 className="font-semibold text-[#093c92] mb-1 flex items-center gap-1">
                          <Lightbulb className="w-4 h-4" /> Solución
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{presentationStatus.current_team_pitch.solution}</p>
                      </div>
                    )}
                    {presentationStatus.current_team_pitch.closing && (
                      <div>
                        <h4 className="font-semibold text-[#093c92] mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Cierre
                        </h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{presentationStatus.current_team_pitch.closing}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <p className="text-center text-gray-600 text-sm">
              El equipo tiene 3 minutos para presentar su pitch
            </p>
          </motion.div>
        )}

        {/* Estado: Esperando Turno */}
        {isWaiting && presentationState === 'presenting' && (() => {
          const myPosition = getMyPosition();
          const currentPosition = getCurrentPresentingPosition();
          
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-8 text-center"
            >
              <div className="text-5xl mb-4">👀</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-4">
                Observando Presentación
              </h2>
              <p className="text-gray-600 text-lg mb-2">
                El equipo <span className="font-bold text-[#093c92]">{getEvaluatedTeamName()}</span> está presentando su pitch
              </p>
              
              {myPosition && (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6 mt-4">
                  <p className="text-blue-800 font-semibold text-lg">
                    📋 Tu equipo presenta {myPosition === 1 ? 'primero' : getPositionText(myPosition)}
                  </p>
                  {currentPosition && myPosition > currentPosition && (
                    <p className="text-blue-600 text-sm mt-2">
                      {myPosition - currentPosition === 1 
                        ? 'Tu turno es el siguiente'
                        : `Faltan ${myPosition - currentPosition} presentaciones antes de tu turno`
                      }
                    </p>
                  )}
                </div>
              )}

              {/* Prototipo del equipo que presenta */}
              {prototypeUrl && (
                <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                  <h3 className="font-semibold text-lg text-[#093c92] mb-3 flex items-center gap-2 justify-center">
                    <ImageIcon className="w-5 h-5" /> Prototipo del Equipo
                  </h3>
                  <img
                    src={prototypeUrl}
                    alt="Prototipo"
                    className="w-full rounded-lg shadow-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </motion.div>
          );
        })()}

        {/* Estado: Evaluación */}
        {isEvaluating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⭐</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-2">Evaluación</h2>
              <p className="text-gray-600 text-lg">
                Evalúa la presentación del equipo {getEvaluatedTeamName()}
              </p>
            </div>

            {evaluationSubmitted ? (
              <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-green-800 font-semibold text-lg">
                  ✅ Evaluación enviada exitosamente
                </p>
                <p className="text-green-700 text-sm mt-2">
                  Espera a que el profesor avance al siguiente turno
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEvaluation} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#093c92] mb-2">
                    Claridad del Problema (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={evaluationScores.clarity}
                    onChange={(e) => setEvaluationScores({ ...evaluationScores, clarity: parseInt(e.target.value) })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093c92] focus:border-transparent text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#093c92] mb-2">
                    Calidad de la Solución (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={evaluationScores.solution}
                    onChange={(e) => setEvaluationScores({ ...evaluationScores, solution: parseInt(e.target.value) })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093c92] focus:border-transparent text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#093c92] mb-2">
                    Presentación y Comunicación (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={evaluationScores.presentation}
                    onChange={(e) => setEvaluationScores({ ...evaluationScores, presentation: parseInt(e.target.value) })}
                    required
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093c92] focus:border-transparent text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#093c92] mb-2">
                    Feedback (opcional)
                  </label>
                  <textarea
                    value={evaluationScores.feedback}
                    onChange={(e) => setEvaluationScores({ ...evaluationScores, feedback: e.target.value })}
                    rows={4}
                    placeholder="Escribe tu feedback aquí..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093c92] focus:border-transparent text-base resize-y"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#093c92] hover:bg-[#0a4fb8] text-white text-lg py-6"
                  size="lg"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  ✓ Enviar Evaluación
                </Button>
              </form>
            )}
          </motion.div>
        )}

        {/* Estado: Equipo que presentó esperando */}
        {presentationState === 'evaluating' && isMyTurn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-8 text-center space-y-4"
          >
            <div className="text-5xl mb-4">⏳</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-4">
              Esperando Evaluaciones
            </h2>
            <p className="text-gray-600 text-lg mb-2">
              La presentación ha finalizado. Los otros equipos están evaluando tu presentación.
            </p>
            <p className="text-gray-600 mb-4">
              Espera a que el profesor avance al siguiente turno.
            </p>
            
            {/* Botón para ver evaluaciones recibidas */}
            <Button
              onClick={() => {
                if (!showMyEvaluations) {
                  loadMyEvaluations();
                } else {
                  setShowMyEvaluations(false);
                }
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Eye className="w-5 h-5 mr-2" />
              {showMyEvaluations ? 'Ocultar' : 'Ver'} Evaluaciones Recibidas
            </Button>

            {/* Mostrar evaluaciones recibidas */}
            {showMyEvaluations && receivedEvaluations.length > 0 && (
              <div className="mt-6 bg-gray-50 border-2 border-gray-300 rounded-xl p-6 text-left">
                <h3 className="text-xl font-bold text-[#093c92] mb-4">⭐ Evaluaciones que recibiste</h3>
                <div className="space-y-4">
                  {receivedEvaluations.map((evaluation, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="mb-2">
                        <p className="font-semibold text-lg text-[#093c92]">
                          De: {evaluation.evaluator_team_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Puntuación Total: <span className="font-bold text-green-600">{evaluation.total_score}</span> | 
                          Tokens recibidos: <span className="font-bold text-yellow-600">{evaluation.tokens_awarded}</span>
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-sm text-gray-600">Claridad</p>
                          <p className="font-semibold text-lg">{evaluation.criteria_scores?.clarity || 0}/10</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Solución</p>
                          <p className="font-semibold text-lg">{evaluation.criteria_scores?.solution || 0}/10</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Presentación</p>
                          <p className="font-semibold text-lg">{evaluation.criteria_scores?.presentation || 0}/10</p>
                        </div>
                      </div>
                      {evaluation.feedback && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600 font-semibold">Feedback:</p>
                          <p className="text-gray-800 mt-1">{evaluation.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Estado: Esperando turno (cuando otro equipo se está preparando) */}
        {presentationState === 'preparing' && !isMyTurn && (() => {
          const myPosition = getMyPosition();
          const currentPosition = getCurrentPresentingPosition();
          const preparingTeam = presentationStatus?.teams.find(
            t => t.id === presentationStatus.current_presentation_team_id
          );
          
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-8 text-center"
            >
              <div className="text-5xl mb-4">⏳</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-4">
                Esperando Tu Turno
              </h2>
              
              {preparingTeam && (
                <p className="text-gray-600 text-lg mb-4">
                  El equipo <span className="font-bold text-[#093c92]">{preparingTeam.name}</span> se está preparando para presentar.
                </p>
              )}
              
              {myPosition && (
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-4">
                  <p className="text-blue-800 font-semibold text-lg">
                    📋 Tu equipo presenta {getPositionText(myPosition)}
                  </p>
                  {currentPosition && myPosition > currentPosition && (
                    <p className="text-blue-600 text-sm mt-2">
                      {myPosition - currentPosition === 1 
                        ? 'Tu turno es el siguiente'
                        : `Faltan ${myPosition - currentPosition} presentaciones antes de tu turno`
                      }
                    </p>
                  )}
                </div>
              )}
              
              <p className="text-gray-500 text-sm mt-4">
                Prepárense para cuando sea su turno.
              </p>
            </motion.div>
          );
        })()}
      </div>
    </div>
  );
}

