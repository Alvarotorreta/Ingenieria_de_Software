import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Tablet,
  Loader2,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';

interface Student {
  id: number;
  full_name: string;
  email?: string;
}

interface Team {
  id: number;
  name: string;
  color: string;
  students_count: number;
  students?: Student[];
  tokens_total?: number;
}

interface TabletConnection {
  id: number;
  team: number;
  is_connected: boolean;
}

interface LobbyData {
  game_session: {
    id: number;
    room_code: string;
    status: string;
  };
  teams: Team[];
  tablet_connections: TabletConnection[];
  all_teams_connected: boolean;
  connected_teams: number;
  total_teams: number;
}

export function TabletLobby() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lobbyData, setLobbyData] = useState<LobbyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [myTeamId, setMyTeamId] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Obtener connection_id de la URL o localStorage
  const connectionId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');

  useEffect(() => {
    if (!connectionId) {
      navigate('/tablet/join');
      return;
    }

    loadLobby();

    // Auto-refresh cada 3 segundos
    intervalRef.current = setInterval(() => {
      loadLobby();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [connectionId, navigate]);

  const loadLobby = async () => {
    if (!connectionId) return;

    try {
      // Obtener estado de la conexión de la tablet
      const statusResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/tablet-connections/status/?connection_id=${connectionId}`
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
      setMyTeamId(statusData.team.id);

      // Obtener información completa del lobby
      const lobbyResponse = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/game-sessions/${statusData.game_session.id}/lobby/`
      );

      if (!lobbyResponse.ok) {
        if (lobbyResponse.status === 403) {
          toast.error('La sesión ya ha finalizado. No puedes acceder al lobby.');
          setTimeout(() => {
            navigate('/tablet/join');
          }, 3000);
        } else {
          toast.error('Error al cargar el lobby');
        }
        return;
      }

      const data: LobbyData = await lobbyResponse.json();

      // Si el juego está corriendo, redirigir a la actividad actual
      if (data.game_session.status === 'running') {
        // Verificar si el profesor avanzó a una nueva etapa/actividad
        await determineAndRedirectToActivity(data.game_session.id);
        // Si no se redirigió, actualizar el estado
        if (!gameStarted) {
          setGameStarted(true);
        }
        return;
      }

      setLobbyData(data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error loading lobby:', error);
      toast.error('Error de conexión: ' + (error.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  const determineAndRedirectToActivity = async (gameSessionId: number) => {
    try {
      const response = await api.get(`/sessions/game-sessions/${gameSessionId}/`);
      const gameData = response.data;
      const currentActivityName = gameData.current_activity_name;
      const currentActivityId = gameData.current_activity;
      const currentStageNumber = gameData.current_stage_number || 1;

      // Si no hay actividad actual, redirigir a resultados de la etapa correspondiente
      if (!currentActivityName || !currentActivityId) {
        if (currentStageNumber === 1) {
          window.location.href = `/tablet/etapa1/resultados/?connection_id=${connectionId}`;
        } else if (currentStageNumber === 2) {
          window.location.href = `/tablet/etapa2/resultados/?connection_id=${connectionId}`;
        } else if (currentStageNumber === 3) {
          window.location.href = `/tablet/etapa3/resultados/?connection_id=${connectionId}`;
        } else if (currentStageNumber === 4) {
          window.location.href = `/tablet/etapa4/resultados/?connection_id=${connectionId}`;
        } else {
          window.location.href = `/tablet/etapa1/resultados/?connection_id=${connectionId}`;
        }
        return;
      }

      const normalizedActivityName = currentActivityName.toLowerCase().trim();
      let redirectUrl = '';

      if (currentStageNumber === 1) {
        if (normalizedActivityName.includes('personaliz')) {
          redirectUrl = `/tablet/etapa1/personalizacion/?connection_id=${connectionId}`;
        } else if (normalizedActivityName.includes('presentaci')) {
          redirectUrl = `/tablet/etapa1/presentacion/?connection_id=${connectionId}`;
        }
      } else if (currentStageNumber === 2) {
        if (normalizedActivityName.includes('tema') || normalizedActivityName.includes('seleccionar') || normalizedActivityName.includes('desafio') || normalizedActivityName.includes('desafío')) {
          redirectUrl = `/tablet/etapa2/seleccionar-tema/?connection_id=${connectionId}`;
        } else if (normalizedActivityName.includes('bubble') || normalizedActivityName.includes('mapa')) {
          redirectUrl = `/tablet/etapa2/bubble-map/?connection_id=${connectionId}`;
        }
      } else if (currentStageNumber === 3) {
        // Etapa 3: Prototipo
        if (normalizedActivityName.includes('prototipo') || normalizedActivityName.includes('lego')) {
          redirectUrl = `/tablet/etapa3/prototipo/?connection_id=${connectionId}`;
        } else {
          // Si hay actividad pero no es prototipo, ir a resultados
          redirectUrl = `/tablet/etapa3/resultados/?connection_id=${connectionId}`;
        }
      } else if (currentStageNumber === 4) {
        // Priorizar detección de presentación
        if (normalizedActivityName.includes('presentacion') || normalizedActivityName.includes('presentación')) {
          redirectUrl = `/tablet/etapa4/presentacion-pitch/?connection_id=${connectionId}`;
        } else if (normalizedActivityName.includes('formulario') || (normalizedActivityName.includes('pitch') && normalizedActivityName.includes('formul'))) {
          redirectUrl = `/tablet/etapa4/formulario-pitch/?connection_id=${connectionId}`;
        } else if (normalizedActivityName.includes('pitch')) {
          // Si solo dice "pitch", verificar más específicamente
          if (normalizedActivityName.includes('presentacion') || normalizedActivityName.includes('presentación')) {
            redirectUrl = `/tablet/etapa4/presentacion-pitch/?connection_id=${connectionId}`;
          } else {
            redirectUrl = `/tablet/etapa4/formulario-pitch/?connection_id=${connectionId}`;
          }
        }
      }

      if (redirectUrl) {
        console.log(`🔄 Redirigiendo a: ${redirectUrl} (Etapa ${currentStageNumber}, Actividad: ${currentActivityName})`);
        window.location.href = redirectUrl;
      } else {
        console.warn(`⚠️ No se encontró redirección para Etapa ${currentStageNumber}, Actividad: ${currentActivityName}`);
      }
    } catch (error: any) {
      console.error('Error determining activity:', error);
      toast.error('Error al determinar actividad: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
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

  const getShortName = (fullName: string) => {
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    let lastName = '';
    if (nameParts.length === 2) {
      lastName = nameParts[1];
    } else if (nameParts.length >= 3) {
      lastName = nameParts[nameParts.length - 2];
    }
    return lastName ? `${firstName} ${lastName}`.trim() : firstName || fullName;
  };

  const getInitials = (fullName: string) => {
    const nameParts = fullName.trim().split(/\s+/);
    const firstInitial = nameParts[0]?.[0]?.toUpperCase() || '';
    const lastInitial = nameParts[nameParts.length - 1]?.[0]?.toUpperCase() || '';
    return firstInitial + (lastInitial && lastInitial !== firstInitial ? lastInitial : '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!lobbyData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error al cargar el lobby</p>
          <button
            onClick={() => navigate('/tablet/join')}
            className="bg-white text-[#093c92] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Volver a Conectar
          </button>
        </div>
      </div>
    );
  }

  const { game_session, teams, tablet_connections } = lobbyData;
  const myTeam = teams.find(t => t.id === myTeamId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-3"
            >
              <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#f757ac] mx-auto" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-2">
              🎮 Lobby de Sala
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Esperando a que el profesor inicie el juego
            </p>
          </div>

          {/* Información del equipo propio */}
          {myTeam && (
            <div className="bg-gradient-to-r from-[#093c92] to-[#1e5bb8] text-white rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-xs sm:text-sm opacity-90 mb-1">Tu Equipo</p>
                  <div
                    className="inline-block px-4 py-2 rounded-full text-white text-sm sm:text-base font-semibold"
                    style={{ backgroundColor: getTeamColorHex(myTeam.color) }}
                  >
                    {myTeam.name}
                  </div>
                </div>
                {myTeam.tokens_total !== undefined && (
                  <div className="text-right">
                    <p className="text-xs sm:text-sm opacity-90 mb-1">Tokens</p>
                    <p className="text-2xl sm:text-3xl font-bold">🪙 {myTeam.tokens_total || 0}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Estado de conexión */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm sm:text-base font-semibold">Conectado</span>
            </div>
            <div className="text-gray-600 text-sm sm:text-base">
              Código: <span className="font-bold text-[#093c92]">{game_session.room_code}</span>
            </div>
          </div>

          {/* Estado del juego */}
          <div className="text-center bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-700">Esperando</h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base">
              El profesor iniciará el juego pronto
            </p>
          </div>
        </div>

        {/* Equipos */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4 sm:mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            Equipos ({teams.length})
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teams.map((team) => {
              const tabletConnection = tablet_connections.find((tc) => tc.team === team.id);
              const isConnected = tabletConnection?.is_connected || false;
              const isMyTeam = team.id === myTeamId;

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gray-50 rounded-xl p-4 sm:p-5 shadow-lg border-l-4 ${
                    isMyTeam ? 'ring-2 ring-[#093c92] ring-offset-2' : ''
                  }`}
                  style={{ borderLeftColor: getTeamColorHex(team.color) }}
                >
                  {/* Header del equipo */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-md"
                        style={{ backgroundColor: getTeamColorHex(team.color) }}
                      >
                        {team.color.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3
                          className="text-base sm:text-lg font-bold"
                          style={{ color: getTeamColorHex(team.color) }}
                        >
                          {team.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {team.students_count} estudiante{team.students_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    {/* Estado de tablet */}
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs sm:text-sm ${
                      isConnected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isConnected ? (
                        <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      ) : (
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      <span className="hidden sm:inline">
                        {isConnected ? 'Conectada' : 'Sin Tablet'}
                      </span>
                    </div>
                  </div>

                  {/* Lista de estudiantes */}
                  <div className="space-y-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Estudiantes:</h4>
                    <div className="space-y-1.5">
                      {team.students && team.students.length > 0 ? (
                        team.students.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200"
                          >
                            {/* Avatar circular con inicial */}
                            <div
                              className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold shadow-sm"
                              style={{ backgroundColor: getTeamColorHex(team.color) }}
                            >
                              {getInitials(student.full_name)}
                            </div>
                            {/* Nombre del estudiante */}
                            <span className="flex-1 text-xs sm:text-sm text-gray-700 truncate">
                              {getShortName(student.full_name)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-400 py-4 text-xs sm:text-sm">
                          Sin estudiantes
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


