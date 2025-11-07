import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Coins, Loader2, Users, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Confetti } from '@/components/Confetti';
import api from '@/services/api';
import { toast } from 'sonner';

// Función para corregir problemas de encoding de tildes y caracteres especiales
const fixEncoding = (text: string | null | undefined): string => {
  if (!text) return '';
  return text
    .replace(/EmpatÃa/g, 'Empatía')
    .replace(/Ã¡/g, 'á')
    .replace(/Ã©/g, 'é')
    .replace(/Ã­/g, 'í')
    .replace(/Ã³/g, 'ó')
    .replace(/Ãº/g, 'ú')
    .replace(/Ã/g, 'í')
    .replace(/Ã±/g, 'ñ')
    .replace(/Ã'/g, 'í')
    .replace(/Ã"/g, 'í')
    .replace(/Ã¿/g, 'ÿ')
    .replace(/Ã¼/g, 'ü')
    .replace(/Ã‰/g, 'É')
    .replace(/Ã"/g, 'Í')
    .replace(/Ã"/g, 'Ó')
    .replace(/Ãš/g, 'Ú')
    .replace(/Ã'/g, 'Á')
    .replace(/Ã±/g, 'Ñ');
};

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total?: number;
}

interface TeamResult {
  team_id: number;
  team_name: string;
  team_color: string;
  tokens_stage: number;
  tokens_total: number;
  activities_progress: Array<{
    activity_name: string;
    status: string;
  }>;
}

interface StageResults {
  stage_number: number;
  stage_name: string;
  teams_results: TeamResult[];
}

export function TabletResultadosEtapa1() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<StageResults | null>(null);
  const [myTeamResult, setMyTeamResult] = useState<TeamResult | null>(null);
  const [myRank, setMyRank] = useState<number>(0);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    loadGameState(connId);

    // Polling cada 5 segundos para detectar cuando el profesor avanza
    intervalRef.current = setInterval(() => {
      loadGameState(connId);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [searchParams, navigate]);

  const loadGameState = async (connId: string) => {
    try {
      const statusResponse = await api.get(`/sessions/tablet-connections/status/?connection_id=${connId}`);

      if (statusResponse.status === 404) {
        toast.error('Conexión no encontrada. Por favor reconecta.');
        setTimeout(() => {
          navigate('/tablet/join');
        }, 3000);
        return;
      }

      const statusData = statusResponse.data;
      setTeam(statusData.team);
      setGameSessionId(statusData.game_session.id);

      // Verificar estado del juego
      const gameResponse = await api.get(`/sessions/game-sessions/${statusData.game_session.id}/`);
      const gameData = gameResponse.data;

      // Verificar si el profesor avanzó a la siguiente etapa
      const currentActivityId = gameData.current_activity;
      const currentActivityName = gameData.current_activity_name?.toLowerCase() || '';
      const currentStageNumber = gameData.current_stage_number || 1;

      // Obtener la URL actual para determinar qué etapa de resultados estamos viendo
      const currentPath = window.location.pathname;
      const isResultadosPage = currentPath.includes('/resultados');
      
      // Verificar si hay un stage_id en los query params
      const stageIdParam = searchParams.get('stage_id');
      let targetStageNumber = currentStageNumber;

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

      // Si estamos en una página de resultados específica, usar esa etapa
      if (isResultadosPage) {
        // Prioridad 1: stage_id de query params (para /tablet/resultados?stage_id=4)
        if (stageIdParam) {
          targetStageNumber = parseInt(stageIdParam, 10) || currentStageNumber;
        } 
        // Prioridad 2: ruta específica (para /tablet/etapaX/resultados)
        else if (currentPath.includes('/etapa2/resultados')) {
          targetStageNumber = 2;
        } else if (currentPath.includes('/etapa3/resultados')) {
          targetStageNumber = 3;
        } else if (currentPath.includes('/etapa4/resultados')) {
          targetStageNumber = 4;
        } else if (currentPath.includes('/etapa1/resultados')) {
          targetStageNumber = 1;
        } 
        // Prioridad 3: ruta genérica /tablet/resultados sin stage_id, usar currentStageNumber
        else if (currentPath === '/tablet/resultados' || currentPath.includes('/tablet/resultados')) {
          targetStageNumber = currentStageNumber;
        } else {
          targetStageNumber = 1;
        }
      }

      // Si el profesor avanzó a una nueva etapa (diferente a la que estamos viendo), redirigir inmediatamente
      if (currentStageNumber > targetStageNumber && currentActivityId && currentActivityName) {
        // El profesor avanzó a una etapa posterior, redirigir según la etapa
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

      // Si hay una actividad actual y no estamos en la página de resultados correspondiente, redirigir
      if (currentActivityId && currentActivityName && !isResultadosPage) {
        if (currentStageNumber === 2) {
          if (currentActivityName.includes('tema') || currentActivityName.includes('seleccionar')) {
            window.location.href = `/tablet/etapa2/seleccionar-tema/?connection_id=${connId}`;
          } else if (currentActivityName.includes('bubble') || currentActivityName.includes('mapa')) {
            window.location.href = `/tablet/etapa2/bubble-map/?connection_id=${connId}`;
          } else {
            window.location.href = `/tablet/lobby?connection_id=${connId}`;
          }
        } else if (currentStageNumber === 3) {
          // Etapa 3: Prototipo
          if (currentActivityName.includes('prototipo') || currentActivityName.includes('lego')) {
            window.location.href = `/tablet/etapa3/prototipo/?connection_id=${connId}`;
          } else {
            window.location.href = `/tablet/lobby?connection_id=${connId}`;
          }
        } else if (currentStageNumber === 4) {
          if (currentActivityName.includes('formulario') || currentActivityName.includes('pitch')) {
            window.location.href = `/tablet/etapa4/formulario-pitch/?connection_id=${connId}`;
          } else {
            window.location.href = `/tablet/lobby?connection_id=${connId}`;
          }
        } else {
          window.location.href = `/tablet/lobby?connection_id=${connId}`;
        }
        return;
      }

      // Si estamos en resultados pero el profesor avanzó a una nueva etapa con actividad, redirigir
      if (isResultadosPage && currentActivityId && currentActivityName && currentStageNumber > targetStageNumber) {
        // El profesor avanzó a una etapa posterior, redirigir según la etapa
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

      // Cargar resultados de la etapa correspondiente
      // Si estamos en una página de resultados, cargar esa etapa
      // Si no hay actividad actual, cargar la etapa actual
      if (isResultadosPage || !currentActivityId) {
        let stageId: number | undefined = undefined;
        
        console.log('📊 Tablet - Cargando resultados para etapa:', targetStageNumber);
        
        // Intentar obtener el stage_id de la etapa correspondiente
        try {
          const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${statusData.game_session.id}`);
          const stagesData = stagesResponse.data.results || stagesResponse.data;
          if (Array.isArray(stagesData)) {
            const targetStage = stagesData.find((s: any) => s.stage_number === targetStageNumber);
            if (targetStage && targetStage.stage) {
              // El campo 'stage' en SessionStageSerializer es el ID del Stage directamente
              stageId = typeof targetStage.stage === 'object' ? targetStage.stage.id : targetStage.stage;
              console.log('✅ Tablet - Stage ID encontrado:', stageId, 'para etapa', targetStageNumber);
              
              // Si estamos en etapa 4, verificar si el profesor inició reflexión
              if (targetStageNumber === 4) {
                const presentationTimestamps = targetStage.presentation_timestamps || {};
                if (presentationTimestamps._reflection === true) {
                  console.log('✅ Tablet - Profesor inició reflexión, redirigiendo...');
                  window.location.href = `/tablet/reflexion/?connection_id=${connId}`;
                  return;
                }
              }
            } else {
              console.warn('⚠️ Tablet - No se encontró stage para etapa', targetStageNumber);
            }
          }
        } catch (error) {
          console.warn('⚠️ Tablet - No se pudo obtener el stage_id específico, intentando sin parámetro:', error);
        }
        
        // Si no encontramos el stage_id, intentar sin parámetro (el backend usará current_stage)
        console.log('📊 Tablet - Llamando a loadStageResults con:', {
          gameSessionId: statusData.game_session.id,
          stageId: stageId,
          targetStageNumber: targetStageNumber
        });
        await loadStageResults(statusData.game_session.id, stageId, statusData.team, targetStageNumber);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading game state:', error);
      toast.error('Error de conexión: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  const loadStageResults = async (gameSessionId: number, stageId: number | undefined, currentTeam: Team, stageNumber?: number) => {
    try {
      let resultsUrl = `/sessions/game-sessions/${gameSessionId}/stage_results/`;
      // Solo agregar stage_id si está definido, es válido y es un número
      if (stageId !== undefined && stageId !== null && !isNaN(Number(stageId)) && Number(stageId) > 0) {
        resultsUrl += `?stage_id=${stageId}`;
      }
      // Si no hay stage_id, el backend usará current_stage automáticamente

      const response = await api.get(resultsUrl);
      const resultsData: StageResults = response.data;
      
      // Verificar que los resultados corresponden a la etapa esperada
      if (stageNumber && resultsData.stage_number !== stageNumber) {
        console.warn(`Los resultados obtenidos son de la etapa ${resultsData.stage_number}, pero se esperaba la etapa ${stageNumber}`);
      }
      
      setResults(resultsData);

      // Ordenar equipos por tokens totales
      const teamsOrdered = [...resultsData.teams_results].sort((a, b) => b.tokens_total - a.tokens_total);

      // Buscar nuestro equipo en los resultados
      if (currentTeam) {
        const myTeam = teamsOrdered.find(t => t.team_id === currentTeam.id);
        const rank = teamsOrdered.findIndex(t => t.team_id === currentTeam.id) + 1;
        
        if (myTeam) {
          setMyTeamResult(myTeam);
          setMyRank(rank);
        }
      }
    } catch (error: any) {
      console.error('Error cargando resultados:', error);
      toast.error('Error al cargar resultados: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
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

  const getStageIcon = (stageNumber: number) => {
    switch (stageNumber) {
      case 1:
        return '👥'; // Trabajo en Equipo
      case 2:
        return '💡'; // Empatía
      case 3:
        return '🧱'; // Creatividad
      case 4:
        return '📢'; // Comunicación
      default:
        return '🏆';
    }
  };

  const getStageGradient = (stageNumber: number) => {
    switch (stageNumber) {
      case 1:
        return 'from-blue-400 to-cyan-500';
      case 2:
        return 'from-purple-400 to-pink-500';
      case 3:
        return 'from-orange-400 to-red-500';
      case 4:
        return 'from-green-400 to-teal-500';
      default:
        return 'from-yellow-400 to-orange-500';
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 sm:w-7 sm:h-7 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 sm:w-7 sm:h-7 text-orange-600" />;
      default:
        return null;
    }
  };

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}°`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!team || !results || !myTeamResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Cargando resultados...</p>
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  // Ordenar equipos por tokens totales
  const teamsOrdered = [...results.teams_results].sort((a, b) => b.tokens_total - a.tokens_total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
      <Confetti active={!!results} />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg"
                style={{ backgroundColor: getTeamColorHex(team.color) }}
              >
                {team.color.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#093c92]">{team.name}</h3>
                <p className="text-xs sm:text-sm text-gray-600">Equipo {team.color}</p>
              </div>
            </div>
            <div className="bg-[#093c92] text-white px-4 py-2 rounded-full font-semibold text-sm sm:text-base flex items-center gap-2">
              <Coins className="w-4 h-4" /> {team.tokens_total || 0} Tokens
            </div>
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
            <div className={`w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${getStageGradient(results.stage_number)} rounded-full flex items-center justify-center shadow-2xl`}>
              <span className="text-4xl sm:text-5xl">{getStageIcon(results.stage_number)}</span>
            </div>
          </motion.div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#093c92] mb-2">
            Etapa {results.stage_number}: {fixEncoding(results.stage_name) || `Etapa ${results.stage_number}`}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Resultados finales de la etapa
          </p>
        </motion.div>

        {/* Posición del Equipo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 mb-4 sm:mb-6 text-center"
        >
          <div className="text-6xl sm:text-7xl md:text-8xl mb-4">
            {getMedalEmoji(myRank)}
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#093c92] mb-2">
            Tu posición: {myRank}° lugar
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            {getMedalIcon(myRank)}
            <p className="text-lg sm:text-xl text-gray-600">
              {fixEncoding(myTeamResult.team_name)}
            </p>
          </div>
        </motion.div>

        {/* Tokens del Equipo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6"
        >
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border-l-4 border-yellow-400">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">Tokens en esta etapa</p>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#093c92]">
                +{myTeamResult.tokens_stage}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center border-l-4 border-blue-400">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">Tokens totales</p>
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                {myTeamResult.tokens_total}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Ranking de Todos los Equipos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h3 className="text-lg sm:text-xl font-bold text-[#093c92] mb-4 sm:mb-6 text-center">
            <Users className="inline-block w-5 h-5 mr-2" /> Clasificación General
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {teamsOrdered.map((teamResult, index) => {
              const rank = index + 1;
              const isMyTeam = teamResult.team_id === team.id;
              const rankMedal = getMedalEmoji(rank);
              const isTopThree = rank <= 3;

              return (
                <motion.div
                  key={teamResult.team_id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`p-4 sm:p-5 rounded-xl border-l-4 ${
                    isMyTeam
                      ? 'bg-blue-50 border-blue-400 shadow-lg scale-105'
                      : isTopThree
                      ? rank === 1
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400'
                        : rank === 2
                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
                        : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-600 min-w-[50px] text-center">
                      {rankMedal}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-md"
                        style={{ backgroundColor: getTeamColorHex(teamResult.team_color) }}
                      >
                        {teamResult.team_color.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className={`font-semibold text-sm sm:text-base ${
                          isMyTeam ? 'text-blue-800 text-lg sm:text-xl' : 'text-gray-700'
                        }`}
                      >
                        {fixEncoding(teamResult.team_name)} {isMyTeam && '(Tu equipo)'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 sm:gap-2 justify-end mb-1">
                        <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                          {teamResult.tokens_total}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">tokens</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Actividades Completadas */}
        {myTeamResult.activities_progress && myTeamResult.activities_progress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6"
          >
            <h3 className="text-lg sm:text-xl font-bold text-[#093c92] mb-4">
              Actividades completadas:
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {myTeamResult.activities_progress.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm sm:text-base text-gray-700">{fixEncoding(activity.activity_name)}</span>
                  <Badge
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      activity.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {activity.status === 'completed' ? (
                      <CheckCircle2 className="w-3 h-3 inline mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 inline mr-1" />
                    )}
                    {activity.status === 'completed' ? 'Completada' : 'Pendiente'}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Mensaje de Espera */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center"
        >
          <div className="text-4xl sm:text-5xl mb-4">⏳</div>
          <p className="text-base sm:text-lg font-semibold text-gray-700">
            {results.stage_number < 4 
              ? `Esperando a que el profesor inicie la Etapa ${results.stage_number + 1}...`
              : '¡Felicidades! Has completado todas las etapas.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
