import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, BookOpen } from 'lucide-react';
import { sessionsAPI, tabletConnectionsAPI } from '@/services';
import { toast } from 'sonner';

interface GameSession {
  id: number;
  room_code: string;
  status: string;
  current_activity_name?: string;
  current_stage_number?: number;
}

export function TabletInstructivo() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const activityCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    
    const loadInitialData = async () => {
      try {
        const statusData = await tabletConnectionsAPI.getStatus(connId);
        if (!statusData || !statusData.game_session) {
          toast.error('Conexión no válida');
          navigate('/tablet/join');
          return;
        }

        const gameSessionId = statusData.game_session.id;
        // Usar lobby en lugar de getById para evitar problemas de autenticación
        const lobbyData = await sessionsAPI.getLobby(gameSessionId);
        const gameData = lobbyData.game_session;
        
        // Guardar valores iniciales para comparación
        const initialActivityId = gameData.current_activity;
        const initialActivityName = gameData.current_activity_name || '';
        const initialStageNumber = gameData.current_stage_number;

        setGameSession(gameData);

        // Si ya hay actividad establecida, redirigir
        if (gameData.current_activity_name && gameData.current_stage_number) {
          const normalizedName = gameData.current_activity_name.toLowerCase();
          if (normalizedName.includes('personaliz')) {
            window.location.href = `/tablet/loading?redirect=/tablet/etapa1/personalizacion&connection_id=${connId}`;
            return;
          } else if (normalizedName.includes('presentaci')) {
            window.location.href = `/tablet/etapa1/presentacion?connection_id=${connId}`;
            return;
          }
        }

        setLoading(false);

        // Verificar actividad y etapa periódicamente (COMO EN ETAPA 2)
        activityCheckIntervalRef.current = setInterval(async () => {
          try {
            // Usar lobby en lugar de getById para evitar problemas de autenticación
            const updatedLobbyData = await sessionsAPI.getLobby(gameSessionId);
            const updatedSession = updatedLobbyData.game_session;
            
            // Verificar si cambió la actividad o etapa
            const activityChanged = updatedSession.current_activity !== initialActivityId || 
                                   (updatedSession.current_activity_name || '') !== initialActivityName;
            const stageChanged = updatedSession.current_stage_number !== initialStageNumber;
            
            if (activityChanged || stageChanged) {
              // Limpiar intervalos
              if (activityCheckIntervalRef.current) {
                clearInterval(activityCheckIntervalRef.current);
                activityCheckIntervalRef.current = null;
              }
              
              // Redirigir según la nueva actividad
              const newActivityName = (updatedSession.current_activity_name || '').toLowerCase();
              const newStageNumber = updatedSession.current_stage_number;
              
              if (newStageNumber === 1 && newActivityName.includes('personaliz')) {
                window.location.href = `/tablet/loading?redirect=/tablet/etapa1/personalizacion&connection_id=${connId}`;
                return;
              } else if (newStageNumber === 1 && newActivityName.includes('presentaci')) {
                window.location.href = `/tablet/etapa1/presentacion?connection_id=${connId}`;
                return;
              } else if (newStageNumber && newStageNumber > 1) {
                window.location.href = `/tablet/lobby?connection_id=${connId}`;
                return;
              }
            }
          } catch (error) {
            console.error('Error verificando actividad:', error);
          }
        }, 2000); // Verificar cada 2 segundos

        // Auto-refresh para actualizar estado
        intervalRef.current = setInterval(async () => {
          try {
            // Usar lobby en lugar de getById para evitar problemas de autenticación
            const updatedLobbyData = await sessionsAPI.getLobby(gameSessionId);
            setGameSession(updatedLobbyData.game_session);
          } catch (error) {
            console.error('Error refreshing game session:', error);
          }
        }, 5000);
      } catch (error: any) {
        console.error('Error loading game session:', error);
        toast.error('Error al cargar la sesión');
        setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (activityCheckIntervalRef.current) {
        clearInterval(activityCheckIntervalRef.current);
      }
    };
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
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
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#093c92] to-[#f757ac] rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#093c92]">
              Instructivo - Etapa 1
            </h1>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              Bienvenido a la <strong>Etapa 1: Trabajo en Equipo</strong>
            </p>
            <p>
              En esta etapa trabajarás con tu equipo para conocerse mejor y prepararse para el emprendimiento.
            </p>
            <div className="bg-blue-50 border-l-4 border-[#093c92] p-4 rounded">
              <p className="font-semibold mb-2">Actividades de esta etapa:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Personalización del Equipo</li>
                <li>Presentación entre miembros</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 italic">
              Esperando a que el profesor inicie la etapa...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

