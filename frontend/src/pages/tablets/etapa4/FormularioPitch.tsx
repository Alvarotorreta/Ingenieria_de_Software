import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, Clock, Save, CheckCircle2, FileText, Lightbulb, Target
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

interface GameSession {
  id: number;
  current_activity: number | null;
  current_activity_name: string | null;
  current_stage_number?: number;
}

export function TabletFormularioPitch() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);
  const [currentSessionStageId, setCurrentSessionStageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [connectionId, setConnectionId] = useState<string | null>(null);
  
  const [pitchIntroProblem, setPitchIntroProblem] = useState('');
  const [pitchSolution, setPitchSolution] = useState('');
  const [pitchClosing, setPitchClosing] = useState('');
  const [hasSaved, setHasSaved] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [lastSavedValues, setLastSavedValues] = useState<{
    intro_problem: string;
    solution: string;
    closing: string;
  }>({ intro_problem: '', solution: '', closing: '' });
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingFromServerRef = useRef<boolean>(false);
  const isTypingRef = useRef<boolean>(false);
  const focusedFieldRef = useRef<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerStartTimeRef = useRef<number | null>(null);
  const timerDurationRef = useRef<number | null>(null);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    loadGameState(connId);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (timerSyncIntervalRef.current) clearInterval(timerSyncIntervalRef.current);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
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

      if (currentStageNumber !== 4) {
        if (currentStageNumber === 3) {
          const normalizedName = currentActivityName;
          if (normalizedName.includes('prototipo') || normalizedName.includes('lego')) {
            window.location.href = `/tablet/etapa3/prototipo/?connection_id=${connId}`;
          } else {
            window.location.href = `/tablet/etapa3/resultados/?connection_id=${connId}`;
          }
        } else {
          window.location.href = `/tablet/lobby?connection_id=${connId}`;
        }
        return;
      }

      // Verificar si el profesor avanzó a la actividad de presentación
      if (currentActivityName && (currentActivityName.includes('presentacion') || currentActivityName.includes('presentación'))) {
        window.location.href = `/tablet/etapa4/presentacion-pitch/?connection_id=${connId}`;
        return;
      }

      // Si no hay actividad activa, puede ser que la etapa terminó
      if (!gameData.current_activity) {
        window.location.href = `/tablet/etapa4/resultados/?connection_id=${connId}`;
        return;
      }

      // Si la actividad cambió y ya no es formulario, redirigir al lobby para que determine
      if (currentActivityId && gameData.current_activity !== currentActivityId && !currentActivityName.includes('formulario')) {
        window.location.href = `/tablet/lobby?connection_id=${connId}`;
        return;
      }

      setCurrentActivityId(gameData.current_activity);

      const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${statusData.game_session.id}`);
      const stagesData = stagesResponse.data.results || stagesResponse.data;
      const sessionStage = Array.isArray(stagesData) 
        ? stagesData.find((s: any) => s.stage_number === 4)
        : null;

      if (sessionStage) {
        setCurrentSessionStageId(sessionStage.id);
        // Solo cargar el estado inicial si no estamos escribiendo
        if (!isTypingRef.current && !focusedFieldRef.current) {
          await loadPitchStatus(statusData.game_session.id, teamData.id, gameData.current_activity, sessionStage.id);
        }
        startTimer(gameData.current_activity, statusData.game_session.id);
      }

      setLoading(false);

      // Solo actualizar si el usuario no está escribiendo
      intervalRef.current = setInterval(() => {
        // No actualizar si el usuario está escribiendo o hay un campo con foco (usar refs)
        if (!isTypingRef.current && !focusedFieldRef.current && !isUpdatingFromServerRef.current) {
          loadGameState(connId);
        }
      }, 5000);
    } catch (error: any) {
      console.error('Error loading game state:', error);
      toast.error('Error de conexión: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  const loadPitchStatus = async (gameSessionId: number, teamId: number, activityId: number, sessionStageId: number) => {
    // No cargar si el usuario está escribiendo o hay un campo con foco (usar refs para valores actuales)
    if (isTypingRef.current || focusedFieldRef.current || isUpdatingFromServerRef.current) {
      return;
    }

    try {
      const progressResponse = await api.get(
        `/sessions/team-activity-progress/?team=${teamId}&activity=${activityId}&session_stage=${sessionStageId}`
      );

      const progressData = progressResponse.data;
      const progressArray = Array.isArray(progressData) ? progressData : progressData.results || [];
      const progress = progressArray[0];

      if (progress) {
        const serverIntro = progress.pitch_intro_problem || '';
        const serverSolution = progress.pitch_solution || '';
        const serverClosing = progress.pitch_closing || '';

        // Verificar nuevamente antes de actualizar (por si cambió el estado durante la petición)
        if (isTypingRef.current || focusedFieldRef.current || isUpdatingFromServerRef.current) {
          return;
        }

        isUpdatingFromServerRef.current = true;

        // Solo actualizar si el valor del servidor es diferente al valor actual
        // Y el campo no tiene foco (usar ref para valor actual)
        if (focusedFieldRef.current !== 'intro_problem' && serverIntro !== pitchIntroProblem) {
          setPitchIntroProblem(serverIntro);
        }
        if (focusedFieldRef.current !== 'solution' && serverSolution !== pitchSolution) {
          setPitchSolution(serverSolution);
        }
        if (focusedFieldRef.current !== 'closing' && serverClosing !== pitchClosing) {
          setPitchClosing(serverClosing);
        }

        // Actualizar valores guardados para comparación futura
        setLastSavedValues({
          intro_problem: serverIntro,
          solution: serverSolution,
          closing: serverClosing,
        });

        setProgressPercentage(progress.progress_percentage || 0);
        setHasSaved(progress.status === 'completed');

        // Pequeño delay antes de permitir nuevas actualizaciones
        setTimeout(() => {
          isUpdatingFromServerRef.current = false;
        }, 100);
      }
    } catch (error) {
      console.error('Error loading pitch status:', error);
      isUpdatingFromServerRef.current = false;
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
        return;
      }

      timerDurationRef.current = timerData.timer_duration;
      timerStartTimeRef.current = timerData.started_at
        ? new Date(timerData.started_at).getTime()
        : new Date(timerData.current_time).getTime();

      const updateTimer = () => {
        if (timerStartTimeRef.current && timerDurationRef.current) {
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
        }
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);

      timerSyncIntervalRef.current = setInterval(async () => {
        try {
          const syncResponse = await api.get(`/sessions/game-sessions/${gameSessionId}/activity_timer/`);
          const syncData = syncResponse.data;
          if (syncData.started_at && syncData.timer_duration) {
            timerStartTimeRef.current = new Date(syncData.started_at).getTime();
            timerDurationRef.current = syncData.timer_duration;
          }
        } catch (error) {
          console.error('Error syncing timer:', error);
        }
      }, 5000);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const savePitch = async (showToast = true) => {
    if (!team || !currentActivityId || !currentSessionStageId) {
      if (showToast) toast.error('Faltan datos necesarios');
      return;
    }

    try {
      const response = await api.post('/sessions/team-activity-progress/save_pitch/', {
        team_id: team.id,
        activity_id: currentActivityId,
        session_stage_id: currentSessionStageId,
        pitch_intro_problem: pitchIntroProblem,
        pitch_solution: pitchSolution,
        pitch_closing: pitchClosing,
      });

      const fieldsCompleted = [pitchIntroProblem, pitchSolution, pitchClosing].filter(Boolean).length;
      const newProgress = Math.floor((fieldsCompleted / 3) * 100);
      setProgressPercentage(newProgress);

      if (fieldsCompleted === 3) {
        setHasSaved(true);
        if (showToast) toast.success('✓ Pitch guardado exitosamente');
      } else {
        if (showToast) toast.success(`Pitch guardado (${newProgress}% completado)`);
      }

      // Actualizar valores guardados después de guardar
      setLastSavedValues({
        intro_problem: pitchIntroProblem,
        solution: pitchSolution,
        closing: pitchClosing,
      });
    } catch (error: any) {
      console.error('Error saving pitch:', error);
      if (showToast) toast.error('Error al guardar: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
    }
  };

  const handleSavePitch = async () => {
    setSaving(true);
    await savePitch(true);
    setSaving(false);
  };

  const handleFieldChange = (field: 'intro_problem' | 'solution' | 'closing', value: string) => {
    // No actualizar si estamos recibiendo datos del servidor
    if (isUpdatingFromServerRef.current) {
      return;
    }

    setIsTyping(true);
    isTypingRef.current = true;
    
    // Actualizar el campo correspondiente
    if (field === 'intro_problem') {
      setPitchIntroProblem(value);
    } else if (field === 'solution') {
      setPitchSolution(value);
    } else if (field === 'closing') {
      setPitchClosing(value);
    }

    // Cancelar el guardado anterior si existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Guardar automáticamente después de 2 segundos de inactividad
    saveTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      isTypingRef.current = false;
      savePitch(false); // Guardar sin mostrar toast
    }, 2000);
  };

  const handleFieldFocus = (field: 'intro_problem' | 'solution' | 'closing') => {
    setFocusedField(field);
    focusedFieldRef.current = field;
    setIsTyping(true);
    isTypingRef.current = true;
  };

  const handleFieldBlur = () => {
    // Guardar inmediatamente al perder el foco
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    savePitch(false);

    // Esperar un poco antes de permitir actualizaciones del servidor
    setTimeout(() => {
      setFocusedField(null);
      focusedFieldRef.current = null;
      setIsTyping(false);
      isTypingRef.current = false;
    }, 500);
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
          <p className="text-xl mb-4">No se encontró el equipo</p>
          <Button onClick={() => navigate('/tablet/join')}>Volver</Button>
        </div>
      </div>
    );
  }

  const fieldsCompleted = [pitchIntroProblem, pitchSolution, pitchClosing].filter(Boolean).length;
  const isComplete = fieldsCompleted === 3;

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

        {/* Activity Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-4 sm:mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-2">Formulario de Pitch</h1>
          <p className="text-gray-600 text-base sm:text-lg mb-4">
            Completa el formulario para crear tu pitch: intro-problema, solución y cierre
          </p>

          {/* Timer */}
          {timerRemaining !== '--:--' && (
            <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 px-4 py-2 rounded-xl font-semibold text-sm sm:text-base inline-flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> Tiempo restante: {timerRemaining}
            </div>
          )}

          {/* Progress Bar */}
          {progressPercentage > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progreso</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" /> Crea tu guion para presentar
            </h3>
            <p className="text-gray-700 text-sm mb-2">
              Completa los tres campos del formulario para crear el guion de tu pitch. Basándote en lo que trabajaste en las etapas anteriores:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li><strong>Introducción del Problema:</strong> Usa el tema y desafío que seleccionaste en la Etapa 2 (Empatía)</li>
              <li><strong>Solución:</strong> Describe tu solución basándote en el prototipo que construiste en la Etapa 3 (Creatividad)</li>
              <li><strong>Cierre:</strong> Concluye tu pitch de manera impactante</li>
            </ul>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-4 sm:mb-6"
        >
          <div className="space-y-6">
            {/* Intro Problem */}
            <div>
              <label className="block text-lg font-semibold text-[#093c92] mb-2 flex items-center gap-2">
                <Target className="w-5 h-5" /> Introducción del Problema
              </label>
              <textarea
                value={pitchIntroProblem}
                onChange={(e) => handleFieldChange('intro_problem', e.target.value)}
                onFocus={() => handleFieldFocus('intro_problem')}
                onBlur={handleFieldBlur}
                placeholder="Describe el problema que identificaste en la Etapa 2 (Empatía)..."
                rows={5}
                className="w-full text-base border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#093c92] focus:border-transparent resize-y"
              />
            </div>

            {/* Solution */}
            <div>
              <label className="block text-lg font-semibold text-[#093c92] mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" /> Solución
              </label>
              <textarea
                value={pitchSolution}
                onChange={(e) => handleFieldChange('solution', e.target.value)}
                onFocus={() => handleFieldFocus('solution')}
                onBlur={handleFieldBlur}
                placeholder="Describe tu solución basándote en el prototipo que construiste en la Etapa 3 (Creatividad)..."
                rows={5}
                className="w-full text-base border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#093c92] focus:border-transparent resize-y"
              />
            </div>

            {/* Closing */}
            <div>
              <label className="block text-lg font-semibold text-[#093c92] mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Cierre
              </label>
              <textarea
                value={pitchClosing}
                onChange={(e) => handleFieldChange('closing', e.target.value)}
                onFocus={() => handleFieldFocus('closing')}
                onBlur={handleFieldBlur}
                placeholder="Concluye tu pitch de manera impactante..."
                rows={5}
                className="w-full text-base border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#093c92] focus:border-transparent resize-y"
              />
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleSavePitch}
            disabled={saving}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {isComplete ? 'Actualizar Pitch' : 'Guardar Pitch'}
              </>
            )}
          </Button>
        </motion.div>

        {/* Success Message */}
        {hasSaved && isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border-2 border-green-400 rounded-xl p-4 mt-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-green-800 font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              <p>✓ Pitch guardado exitosamente</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

