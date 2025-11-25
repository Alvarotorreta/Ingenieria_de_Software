import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, Clock, Loader2, CheckCircle2, Award, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EtapaIntroModal } from '@/components/EtapaIntroModal';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import { toast } from 'sonner';
import { tabletConnectionsAPI, sessionsAPI, teamPersonalizationsAPI } from '@/services';
import { AnagramGame } from '@/components/minigames/AnagramGame';
import { WordSearchGame } from '@/components/minigames/WordSearchGame';
import { parseMinigameConfig } from '@/components/minigames/MinigameSelector';
import { MinigameType, AnyMinigameData, WordSearchData } from '@/components/minigames/types';

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total?: number;
}

export function TabletMinijuego() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [minigameData, setMinigameData] = useState<AnyMinigameData | null>(null);
  const [currentGameType, setCurrentGameType] = useState<MinigameType | null>(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);
  const [currentSessionStageId, setCurrentSessionStageId] = useState<number | null>(null);
  const [completedItems, setCompletedItems] = useState<Array<{ word: string; answer: string }>>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [showEtapaIntro, setShowEtapaIntro] = useState(false);
  const [currentPart, setCurrentPart] = useState<'word_search' | 'anagram'>('word_search'); // Parte actual del minijuego
  const [personalization, setPersonalization] = useState<{ team_name?: string } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeExpiredRef = useRef<boolean>(false);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    loadGameState(connId);

    // Polling cada 5 segundos
    intervalRef.current = setInterval(() => {
      loadGameState(connId);
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

  const loadGameState = async (connId: string) => {
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
      setGameSessionId(statusData.game_session.id);

      // Cargar personalización del equipo
      try {
        const persList = await teamPersonalizationsAPI.list({ team: statusData.team.id });
        const persResults = Array.isArray(persList) ? persList : [persList];
        if (persResults.length > 0 && persResults[0].team_name) {
          setPersonalization({ team_name: persResults[0].team_name });
        } else {
          setPersonalization(null);
        }
      } catch (error) {
        console.error('Error loading personalization:', error);
        setPersonalization(null);
      }

      // Verificar estado del juego
      const gameData = await sessionsAPI.getById(statusData.game_session.id);
      const sessionId = statusData.game_session.id;

      // Verificar si debemos mostrar la intro de la etapa
      if (gameData.current_stage_number === 1) {
        const introKey = `tablet_etapa_intro_${sessionId}_1`;
        const hasSeenIntro = localStorage.getItem(introKey);
        if (!hasSeenIntro) {
          setShowEtapaIntro(true);
        }
      }

      // Verificar si el juego ha finalizado o está en lobby
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

      // Verificar actividad actual
      const currentActivityName = gameData.current_activity_name?.toLowerCase() || '';
      const currentStageNumber = gameData.current_stage_number;

      if (currentStageNumber !== 1 || (!currentActivityName.includes('presentacion') && !currentActivityName.includes('presentación'))) {
        // Redirigir según la actividad actual
        if (currentStageNumber === 1 && currentActivityName.includes('personaliz')) {
          window.location.href = `/tablet/etapa1/personalizacion/?connection_id=${connId}`;
        } else if (currentStageNumber === 1 && !currentActivityName) {
          window.location.href = `/tablet/etapa1/resultados/?connection_id=${connId}`;
        } else {
          window.location.href = `/tablet/lobby?connection_id=${connId}`;
        }
        return;
      }

      setCurrentActivityId(gameData.current_activity);

      // Obtener session_stage
      if (!currentSessionStageId) {
        const stagesResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/session-stages/?game_session=${statusData.game_session.id}`
        );
        if (stagesResponse.ok) {
          const stagesData = await stagesResponse.json();
          const stages = Array.isArray(stagesData.results) ? stagesData.results : (Array.isArray(stagesData) ? stagesData : []);
          if (stages.length > 0) {
            setCurrentSessionStageId(stages[0].id);
          }
        }
      }

      // Cargar actividad del minijuego (solo si no hay datos cargados)
      if (gameData.current_activity && !minigameData && statusData.team?.id) {
        await loadMinijuegoActivity(gameData.current_activity, statusData.team.id, statusData.game_session.id);
      }

      // Verificar progreso existente
      if (gameData.current_activity && currentSessionStageId && statusData.team.id) {
        await checkExistingProgress(statusData.team.id, gameData.current_activity, currentSessionStageId);
      }

      // Iniciar temporizador
      if (gameData.current_activity && !timerIntervalRef.current) {
        startTimer(gameData.current_activity, statusData.game_session.id);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading game state:', error);
      toast.error('Error de conexión: ' + (error.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  // Función helper para cargar actividad con word_search_data del backend
  const loadActivityWithWordSearch = async (activityId: number, teamId: number, sessionStageId: number | null) => {
    const activityUrl = new URL(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/challenges/activities/${activityId}/`
    );
    if (teamId) activityUrl.searchParams.set('team_id', teamId.toString());
    if (sessionStageId) activityUrl.searchParams.set('session_stage_id', sessionStageId.toString());
    
    const response = await fetch(activityUrl.toString());
    if (!response.ok) {
      throw new Error('Error al cargar la actividad');
    }
    return await response.json();
  };

  const loadMinijuegoActivity = async (activityId: number, teamId: number, gameSessionIdParam?: number) => {
    try {
      // Verificar progreso existente para determinar qué parte mostrar
      // Primero intentar obtener session_stage_id
      let sessionStageId: number | null = null;
      const sessionIdToUse = gameSessionIdParam || gameSessionId;
      if (sessionIdToUse) {
        try {
          const stagesResponse = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/session-stages/?game_session=${sessionIdToUse}`
          );
          if (stagesResponse.ok) {
            const stagesData = await stagesResponse.json();
            const stages = Array.isArray(stagesData.results) ? stagesData.results : (Array.isArray(stagesData) ? stagesData : []);
            if (stages.length > 0) {
              sessionStageId = stages[0].id;
            }
          }
        } catch (e) {
          console.error('Error getting session stage:', e);
        }
      }
      
      // Obtener la actividad con word_search_data del backend
      const activityData = await loadActivityWithWordSearch(activityId, teamId, sessionStageId);
      const config = activityData.config_data || {};
      const wordSearchDataFromBackend = activityData.word_search_data; // Datos generados por el backend
      
      let existingProgress: any = null;
      if (sessionStageId) {
        const progressResponse = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-activity-progress/?team=${teamId}&activity=${activityId}&session_stage=${sessionStageId}`
        );
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          const progressResults = Array.isArray(progressData.results) ? progressData.results : (Array.isArray(progressData) ? progressData : []);
          if (progressResults.length > 0) {
            existingProgress = progressResults[0];
          }
        }
      }
      
      // Determinar qué parte mostrar basado en el progreso
      const responseData = existingProgress?.response_data || {};
      const foundWordsFromProgress = responseData.found_words || [];
      const answersFromProgress = responseData.answers || [];
      
      // Usar word_search_data del backend (el backend siempre debería generarlo)
      let wordSearchData: WordSearchData;
      if (wordSearchDataFromBackend && wordSearchDataFromBackend.words && wordSearchDataFromBackend.grid) {
        // Usar datos del backend
        wordSearchData = {
          type: MinigameType.WORD_SEARCH,
          words: wordSearchDataFromBackend.words,
          grid: wordSearchDataFromBackend.grid,
          wordPositions: wordSearchDataFromBackend.wordPositions || [],
        };
      } else {
        // Fallback solo si el backend no devuelve datos (no debería pasar)
        console.warn('El backend no devolvió word_search_data, usando fallback');
        const wordSearchType = MinigameType.WORD_SEARCH;
        const seed = sessionStageId && teamId ? `${teamId}_${sessionStageId}` : undefined;
        wordSearchData = parseMinigameConfig(config, wordSearchType, seed) as WordSearchData;
      }
      
      const totalWordsExpected = wordSearchData.words.length;
      
      // Si ya completaron la sopa de letras (todas las palabras encontradas), mostrar anagrama
      // Si están en progreso con sopa de letras, seguir con sopa de letras
      // Si no hay progreso, empezar con sopa de letras
      if (foundWordsFromProgress.length >= totalWordsExpected) {
        setCurrentPart('anagram');
        // Cargar datos de anagrama
        const anagramType = MinigameType.ANAGRAMA;
        setCurrentGameType(anagramType);
        const parsedData = parseMinigameConfig(config, anagramType);
        setMinigameData(parsedData);
      } else {
        // Están en progreso con sopa de letras o no hay progreso
        setCurrentPart('word_search');
        setCurrentGameType(MinigameType.WORD_SEARCH);
        setMinigameData(wordSearchData);
      }
      
      // Restaurar palabras encontradas si hay progreso
      if (foundWordsFromProgress.length > 0) {
        setFoundWords(foundWordsFromProgress.map((w: string) => w.toUpperCase()));
      }
    } catch (error: any) {
      console.error('Error loading minijuego activity:', error);
      toast.error('Error al cargar la actividad: ' + (error.message || 'Error desconocido'));
    }
  };

  const checkExistingProgress = async (teamId: number, activityId: number, sessionStageId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-activity-progress/?team=${teamId}&activity=${activityId}&session_stage=${sessionStageId}`
      );

      if (response.ok) {
        const data = await response.json();
        const results = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
        
        if (results.length > 0) {
          const progress = results[0];
          const responseData = progress.response_data || {};
          const answers = responseData.answers || [];
          
          // Restaurar progreso
          setCompletedItems(answers);
          
          // Restaurar palabras encontradas para sopa de letras
          const foundWordsFromData = responseData.found_words || [];
          if (foundWordsFromData.length > 0) {
            setFoundWords(foundWordsFromData.map((w: string) => w.toUpperCase()));
          }
          
          // Determinar qué parte mostrar basado en el progreso
          const minigamePart = responseData.minigame_part;
          const hasWordSearchProgress = foundWordsFromData.length > 0;
          const hasAnagramProgress = answers.length > 0;
          
          // Obtener el número real de palabras esperadas
          const totalWordsExpected = responseData.total_words || 3;
          
          // Si hay progreso en ambas partes o solo en una, determinar la parte actual
          if (hasWordSearchProgress && foundWordsFromData.length >= totalWordsExpected && !hasAnagramProgress) {
            // Completaron sopa de letras pero no han empezado anagrama
            setCurrentPart('anagram');
            // Cargar datos de anagrama si no están cargados
            if (minigameData?.type !== MinigameType.ANAGRAMA && currentActivityId && teamId && sessionStageId) {
              loadActivityWithWordSearch(currentActivityId, teamId, sessionStageId)
                .then(activityData => {
                  const config = activityData.config_data || {};
                  const anagramType = MinigameType.ANAGRAMA;
                  setCurrentGameType(anagramType);
                  const parsedData = parseMinigameConfig(config, anagramType);
                  setMinigameData(parsedData);
                })
                .catch(error => {
                  console.error('Error loading activity:', error);
                });
            }
          } else if (hasWordSearchProgress && foundWordsFromData.length < totalWordsExpected) {
            // Están en progreso con sopa de letras
            setCurrentPart('word_search');
            if (minigameData?.type !== MinigameType.WORD_SEARCH && currentActivityId && teamId && sessionStageId) {
              loadActivityWithWordSearch(currentActivityId, teamId, sessionStageId)
                .then(activityData => {
                  const wordSearchDataFromBackend = activityData.word_search_data;
                  const wordSearchType = MinigameType.WORD_SEARCH;
                  setCurrentGameType(wordSearchType);
                  
                  // Usar word_search_data del backend
                  let parsedData: WordSearchData;
                  if (wordSearchDataFromBackend && wordSearchDataFromBackend.words && wordSearchDataFromBackend.grid) {
                    parsedData = {
                      type: MinigameType.WORD_SEARCH,
                      words: wordSearchDataFromBackend.words,
                      grid: wordSearchDataFromBackend.grid,
                      wordPositions: wordSearchDataFromBackend.wordPositions || [],
                    };
                  } else {
                    // Fallback solo si el backend no devuelve datos
                    console.warn('El backend no devolvió word_search_data, usando fallback');
                    const config = activityData.config_data || {};
                    const seed = sessionStageId && teamId ? `${teamId}_${sessionStageId}` : undefined;
                    parsedData = parseMinigameConfig(config, wordSearchType, seed) as WordSearchData;
                  }
                  setMinigameData(parsedData);
                })
                .catch(error => {
                  console.error('Error loading activity:', error);
                });
            }
          } else if (hasAnagramProgress) {
            // Están en anagrama
            setCurrentPart('anagram');
            if (minigameData?.type !== MinigameType.ANAGRAMA && currentActivityId && teamId && sessionStageId) {
              loadActivityWithWordSearch(currentActivityId, teamId, sessionStageId)
                .then(activityData => {
                  const config = activityData.config_data || {};
                  const anagramType = MinigameType.ANAGRAMA;
                  setCurrentGameType(anagramType);
                  const parsedData = parseMinigameConfig(config, anagramType);
                  setMinigameData(parsedData);
                })
                .catch(error => {
                  console.error('Error loading activity:', error);
                });
            }
          }
          
          // Si está completado, mostrar pantalla de completado
          if (progress.status === 'completed') {
            if (minigameData?.type === MinigameType.ANAGRAMA) {
              setCurrentGameIndex(minigameData.words.length);
            } else if (minigameData?.type === MinigameType.WORD_SEARCH) {
              // Ya está completo, foundWords ya tiene todas las palabras
            }
          } else {
            // Continuar desde donde se quedó
            if (minigameData?.type === MinigameType.ANAGRAMA) {
              setCurrentGameIndex(answers.length);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error checking game progress:', error);
    }
  };

  const startTimer = async (activityId: number, gameSessionId: number) => {
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

      // Verificar si el tiempo ya expiró
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = Math.max(0, timerDuration - elapsed);

      if (remaining <= 0) {
        setTimerRemaining('00:00');
        timeExpiredRef.current = true;
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
          timeExpiredRef.current = true;
        }
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const verifyAnswer = async () => {
    if (!userAnswer.trim()) {
      toast.error('Por favor escribe una respuesta');
      return;
    }

    if (!team || !currentActivityId || !currentSessionStageId || !minigameData) {
      toast.error('Faltan datos necesarios');
      return;
    }

    if (minigameData.type !== MinigameType.ANAGRAMA) {
      return;
    }

    const currentWord = minigameData.words[currentGameIndex];
    if (!currentWord) return;

    const userAnswerLower = userAnswer.trim().toLowerCase();
    const correctWordLower = currentWord.word.toLowerCase();
    const isAnswerCorrect = userAnswerLower === correctWordLower;

    setIsCorrect(isAnswerCorrect);
    setSubmitting(true);

    if (isAnswerCorrect) {
      // Guardar respuesta
      const newCompletedItem = { word: currentWord.word, answer: userAnswerLower };
      setCompletedItems([...completedItems, newCompletedItem]);

      // Enviar respuesta
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-activity-progress/submit_anagram/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              team: team.id,
              activity: currentActivityId,
              session_stage: currentSessionStageId,
              answers: [newCompletedItem],
              minigame_type: currentGameType,  // Enviar tipo de minijuego
              total_words: minigameData?.words.length || 0, // Enviar el número real de palabras generadas
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const tokensEarned = data.tokens_earned || 0;
          
          if (tokensEarned > 0) {
            toast.success(`¡Correcto! +${tokensEarned} tokens`);
            // Recargar estado del equipo para actualizar tokens
            if (connectionId) {
              loadGameState(connectionId);
            }
          }

          // Esperar un momento y mostrar siguiente palabra
          setTimeout(() => {
            setCurrentGameIndex(currentGameIndex + 1);
            setUserAnswer('');
            setIsCorrect(null);
            setSubmitting(false);
          }, 1500);
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error('Error: ' + (errorData.error || 'Error desconocido'));
          setSubmitting(false);
        }
      } catch (error: any) {
        toast.error('Error de conexión: ' + (error.message || 'Error desconocido'));
        setSubmitting(false);
      }
    } else {
      // Respuesta incorrecta
      setTimeout(() => {
        setUserAnswer('');
        setIsCorrect(null);
        setSubmitting(false);
      }, 2000);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitting) {
      verifyAnswer();
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

  const handleWordFound = async (word: string, cells: Array<{ row: number; col: number }>) => {
    if (!team || !currentActivityId || !currentSessionStageId) {
      return;
    }

    const newFoundWords = [...foundWords, word];
    setFoundWords(newFoundWords);

    // Guardar progreso
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-activity-progress/submit_word_search/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            team: team.id,
            activity: currentActivityId,
            session_stage: currentSessionStageId,
            found_words: newFoundWords, // Enviar todas las palabras encontradas
            minigame_type: currentGameType,
            total_words: minigameData?.words.length || 0, // Enviar el número real de palabras generadas
            completed: newFoundWords.length >= (minigameData?.words.length || 0), // Completado si encontraron todas las palabras
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const tokensEarned = data.tokens_earned || 0;
        
        // Mostrar mensaje siempre, incluso si no se otorgaron tokens nuevos (puede que ya se habían otorgado antes)
        if (tokensEarned > 0) {
          toast.success(`¡Palabra encontrada! +${tokensEarned} tokens`);
        } else {
          toast.success(`¡Palabra encontrada!`);
        }
        
        // Recargar estado del equipo para actualizar tokens y progreso
        if (connectionId) {
          loadGameState(connectionId);
        }
        
        // Recargar progreso para actualizar el contador
        if (currentActivityId && currentSessionStageId) {
          checkExistingProgress(team.id, currentActivityId, currentSessionStageId);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error('Error: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error: any) {
      console.error('Error saving word search progress:', error);
      toast.error('Error al guardar progreso');
    }
  };

  const handleWordSearchComplete = async () => {
    if (!team || !currentActivityId || !currentSessionStageId) {
      return;
    }

    // Marcar como completado
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/team-activity-progress/submit_word_search/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            team: team.id,
            activity: currentActivityId,
            session_stage: currentSessionStageId,
            found_words: foundWords,
            minigame_type: currentGameType,
            total_words: minigameData?.words.length || 0, // Enviar el número real de palabras generadas
            completed: foundWords.length >= (minigameData?.words.length || 0), // Completado si encontraron todas las palabras
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        toast.success(`¡Has completado la Parte 1: Sopa de Letras! ${data.tokens_earned || 0} tokens ganados`);
        
        // Cambiar automáticamente a la parte 2 (anagrama) inmediatamente
        await switchToPart('anagram');
        
        if (connectionId) {
          loadGameState(connectionId);
        }
      }
    } catch (error: any) {
      console.error('Error completing word search:', error);
      toast.error('Error al completar la sopa de letras');
    }
  };
  
  const switchToPart = async (part: 'word_search' | 'anagram') => {
    if (!currentActivityId || !team || !currentSessionStageId) return;
    
    setCurrentPart(part);
    
    try {
      if (!currentSessionStageId) {
        toast.error('Error: falta session_stage_id');
        return;
      }

      const activityData = await loadActivityWithWordSearch(currentActivityId, team.id, currentSessionStageId);
      const config = activityData.config_data || {};
      
      if (part === 'word_search') {
        const wordSearchType = MinigameType.WORD_SEARCH;
        setCurrentGameType(wordSearchType);
        
        const wordSearchDataFromBackend = activityData.word_search_data;
        // Usar word_search_data del backend
        let parsedData: WordSearchData;
        if (wordSearchDataFromBackend && wordSearchDataFromBackend.words && wordSearchDataFromBackend.grid) {
          parsedData = {
            type: MinigameType.WORD_SEARCH,
            words: wordSearchDataFromBackend.words,
            grid: wordSearchDataFromBackend.grid,
            wordPositions: wordSearchDataFromBackend.wordPositions || [],
          };
        } else {
          // Fallback solo si el backend no devuelve datos
          console.warn('El backend no devolvió word_search_data, usando fallback');
          const seed = currentSessionStageId && team.id ? `${team.id}_${currentSessionStageId}` : undefined;
          parsedData = parseMinigameConfig(config, wordSearchType, seed) as WordSearchData;
        }
        setMinigameData(parsedData);
      } else {
        const anagramType = MinigameType.ANAGRAMA;
        setCurrentGameType(anagramType);
        const parsedData = parseMinigameConfig(config, anagramType);
        setMinigameData(parsedData);
      }
    } catch (error: any) {
      console.error('Error switching part:', error);
      toast.error('Error al cambiar de parte');
    }
  };

  const allCompleted = minigameData 
    ? (minigameData.type === MinigameType.ANAGRAMA 
        ? currentGameIndex >= minigameData.words.length
        : minigameData.type === MinigameType.WORD_SEARCH
        ? foundWords.length >= minigameData.words.length
        : false)
    : false;

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
                <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">
                  {personalization?.team_name 
                    ? `Equipo ${personalization.team_name}` 
                    : team.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  Equipo {team.color}
                </p>
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#093c92]">
                2. Presentación - Minijuego
              </h2>
              {/* Selector de partes */}
              <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => switchToPart('word_search')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    currentPart === 'word_search'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🔍 Parte 1
                </button>
                <button
                  onClick={() => switchToPart('anagram')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    currentPart === 'anagram'
                      ? 'bg-purple-500 text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  🧩 Parte 2
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              {currentGameType === MinigameType.WORD_SEARCH 
                ? 'Parte 1: Encuentra las palabras en la sopa de letras. Cada palabra encontrada vale 1 token'
                : 'Parte 2: Adivina las palabras desordenadas. Cada palabra correcta vale 1 token'
              }
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

          {/* Instrucciones */}
          {currentGameType === MinigameType.ANAGRAMA && (
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-3 sm:p-4 mb-4 sm:mb-5">
              <p className="text-blue-800 font-semibold text-xs sm:text-sm">
                Las palabras están desordenadas. Reordena las letras para formar la palabra correcta. Se enviará automáticamente cuando escribas la respuesta correcta.
              </p>
            </div>
          )}
          {currentGameType === MinigameType.WORD_SEARCH && (
            <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-3 sm:p-4 mb-4 sm:mb-5">
              <p className="text-blue-800 font-semibold text-xs sm:text-sm">
                Desliza con el dedo sobre las letras para seleccionar palabras. Puedes buscar en <strong>horizontal</strong>, <strong>vertical</strong> o <strong>diagonal</strong> (en cualquier dirección). Se marcará automáticamente cuando encuentres una palabra correcta.
              </p>
            </div>
          )}

          {/* Progreso */}
          {!allCompleted && minigameData && minigameData.type === MinigameType.ANAGRAMA && (
            <div className="text-center mb-4 sm:mb-5 text-gray-700 font-semibold text-sm sm:text-base">
              Palabra <span className="text-[#093c92]">{currentGameIndex + 1}</span> de{' '}
              <span className="text-[#093c92]">{minigameData.words.length}</span>
            </div>
          )}

          {/* Juego */}
          {allCompleted ? (
            <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 sm:p-8 text-center">
              <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-3" />
              <p className="text-xl sm:text-2xl font-bold text-green-700 mb-2">¡Felicidades!</p>
              <p className="text-green-800 text-sm sm:text-base">Has completado el minijuego</p>
            </div>
          ) : minigameData && currentGameType === MinigameType.ANAGRAMA ? (
            <AnagramGame
              data={minigameData}
              currentIndex={currentGameIndex}
              userAnswer={userAnswer}
              setUserAnswer={setUserAnswer}
              isCorrect={isCorrect}
              submitting={submitting}
              onVerify={verifyAnswer}
            />
          ) : minigameData && currentGameType === MinigameType.WORD_SEARCH ? (
            <WordSearchGame
              data={minigameData}
              foundWords={foundWords}
              onWordFound={handleWordFound}
              onComplete={handleWordSearchComplete}
            />
          ) : (
            <div className="text-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Cargando minijuego...</p>
            </div>
          )}
        </motion.div>
        </div>
      </div>

      {/* Modal de Introducción de Etapa */}
      <EtapaIntroModal
        etapaNumero={1}
        isOpen={showEtapaIntro}
        onClose={() => {
          setShowEtapaIntro(false);
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


