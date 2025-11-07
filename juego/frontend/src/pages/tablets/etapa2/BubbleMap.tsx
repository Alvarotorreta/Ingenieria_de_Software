import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2, Award, Clock, Plus, Trash2, Save, Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import api from '@/services/api';
import { toast } from 'sonner';

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total: number;
}

interface BubbleMapNode {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface GameSession {
  id: number;
  status: string;
  current_activity?: number;
  current_activity_name?: string;
  current_stage_number?: number;
}

export function TabletBubbleMap() {
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
  const [bubbleMapNodes, setBubbleMapNodes] = useState<BubbleMapNode[]>([]);
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newBubbleText, setNewBubbleText] = useState('');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerStartTimeRef = useRef<number | null>(null);
  const timerDurationRef = useRef<number | null>(null);
  const timeExpiredRef = useRef<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    loadGameState(connId);

    intervalRef.current = setInterval(() => {
      loadGameState(connId);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (timerSyncIntervalRef.current) clearInterval(timerSyncIntervalRef.current);
    };
  }, [searchParams, navigate]);

  useEffect(() => {
    timeExpiredRef.current = false;
  }, [currentActivityId]);

  const loadGameState = async (connId: string) => {
    try {
      const statusResponse = await api.get(`/sessions/tablet-connections/status/?connection_id=${connId}`);
      const statusData = statusResponse.data;

      setTeam(statusData.team);
      setGameSessionId(statusData.game_session.id);

      const gameResponse = await api.get(`/sessions/game-sessions/${statusData.game_session.id}/`);
      const gameData: GameSession = gameResponse.data;

      if (gameData.status === 'finished' || gameData.status === 'completed') {
        toast.info('El juego ha finalizado. Redirigiendo...');
        setTimeout(() => navigate('/tablet/join'), 2000);
        return;
      }

      if (gameData.status === 'lobby') {
        toast.info('El juego no ha iniciado. Redirigiendo al lobby...');
        setTimeout(() => navigate(`/tablet/lobby?connection_id=${connId}`), 2000);
        return;
      }

      const newActivityId = gameData.current_activity;
      const currentActivityName = gameData.current_activity_name?.toLowerCase() || '';
      const currentStageNumber = gameData.current_stage_number;

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

      // If no current activity in Stage 2, it means stage is completed, redirect to results
      if (!newActivityId && currentStageNumber === 2) {
        toast.info('Etapa 2 completada. Redirigiendo a resultados...');
        setTimeout(() => navigate(`/tablet/etapa2/resultados?connection_id=${connId}`), 2000);
        return;
      }

      const isBubbleMapActivity = currentActivityName.includes('bubble') || 
        currentActivityName.includes('mapa') || 
        currentActivityName.includes('mapa mental');

      if (!isBubbleMapActivity && newActivityId) {
        // Not bubble map activity, redirect
        if (currentActivityName.includes('tema') || currentActivityName.includes('seleccionar')) {
          setTimeout(() => navigate(`/tablet/etapa2/seleccionar-tema?connection_id=${connId}`), 2000);
        } else if (currentActivityName.includes('desafío') || currentActivityName.includes('desafio')) {
          setTimeout(() => navigate(`/tablet/etapa2/seleccionar-tema?connection_id=${connId}`), 2000);
        }
        return;
      }

      setCurrentActivityId(newActivityId || null);

      // Get SessionStage for Stage 2
      let sessionStageId = currentSessionStageId;
      if (!sessionStageId) {
        const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${gameData.id}`);
        const stages = stagesResponse.data.results || stagesResponse.data;
        const stage2 = stages.find((s: any) => s.stage_number === 2);
        if (stage2) {
          sessionStageId = stage2.id;
          setCurrentSessionStageId(stage2.id);
        }
      }

      // Load bubble map and start timer
      if (newActivityId) {
        // Iniciar timer siempre que haya una actividad, incluso si no hay sessionStageId todavía
        await startTimer(newActivityId, gameData.id);
        
        if (sessionStageId) {
          await loadBubbleMapForEdit(statusData.team.id, sessionStageId);
        }
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading game state:', error);
      toast.error('Error de conexión: ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  const loadBubbleMapForEdit = async (teamId: number, sessionStageId: number) => {
    try {
      const mapResponse = await api.get(
        `/sessions/team-bubble-maps/?team=${teamId}&session_stage=${sessionStageId}`
      );
      const mapData = mapResponse.data;
      const bubbleMap = Array.isArray(mapData) ? mapData[0] : mapData.results?.[0];

      if (bubbleMap && bubbleMap.map_data && bubbleMap.map_data.nodes) {
        setBubbleMapNodes(bubbleMap.map_data.nodes || []);
      }
    } catch (error) {
      console.error('Error loading bubble map:', error);
    }
  };

  const addBubbleNode = () => {
    if (!newBubbleText.trim()) {
      toast.error('Ingresa un texto para la burbuja');
      return;
    }

    const container = canvasRef.current;
    if (!container) {
      toast.error('Error: No se pudo obtener el contenedor');
      return;
    }

    const containerRect = container.getBoundingClientRect();
    let x: number, y: number;

    if (bubbleMapNodes.length === 0) {
      // Primera burbuja: va al centro
      x = containerRect.width / 2 - 100;
      y = containerRect.height / 2 - 30;
    } else {
      // Otras burbujas: distribuir en círculo alrededor del centro
      const centerX = containerRect.width / 2;
      const centerY = containerRect.height / 2;
      const radius = Math.min(containerRect.width, containerRect.height) * 0.25;
      const angle = ((bubbleMapNodes.length - 1) * 360) / Math.max(bubbleMapNodes.length, 1);
      x = centerX + radius * Math.cos((angle * Math.PI) / 180) - 50;
      y = centerY + radius * Math.sin((angle * Math.PI) / 180) - 20;
    }

    const node: BubbleMapNode = {
      id: Date.now(),
      text: newBubbleText.trim(),
      x: Math.max(0, Math.min(x, containerRect.width - 200)),
      y: Math.max(0, Math.min(y, containerRect.height - 50)),
    };

    setBubbleMapNodes([...bubbleMapNodes, node]);
    setNewBubbleText('');
    setShowAddDialog(false);
    toast.success('Burbuja agregada');
  };

  const deleteBubbleNode = (nodeId: number) => {
    setBubbleMapNodes(bubbleMapNodes.filter(n => n.id !== nodeId));
    toast.success('Burbuja eliminada');
  };

  const handleDragStart = (e: React.DragEvent, nodeId: number) => {
    setDraggedNodeId(nodeId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedNodeId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setBubbleMapNodes(bubbleMapNodes.map(node => {
      if (node.id === draggedNodeId) {
        return { ...node, x: Math.max(0, Math.min(x, rect.width - 200)), y: Math.max(0, Math.min(y, rect.height - 50)) };
      }
      return node;
    }));

    setDraggedNodeId(null);
  };

  const saveBubbleMap = async () => {
    if (!team || !currentSessionStageId) {
      toast.error('Faltan datos necesarios');
      return;
    }

    if (bubbleMapNodes.length === 0) {
      toast.error('Agrega al menos una burbuja antes de guardar');
      return;
    }

    setSaving(true);
    try {
      const mapData = {
        nodes: bubbleMapNodes,
        edges: [],
      };

      // Check if bubble map already exists
      const existingResponse = await api.get(
        `/sessions/team-bubble-maps/?team=${team.id}&session_stage=${currentSessionStageId}`
      );
      const existingData = existingResponse.data;
      const existing = Array.isArray(existingData) ? existingData[0] : existingData.results?.[0];

      if (existing) {
        // Update existing
        await api.patch(`/sessions/team-bubble-maps/${existing.id}/`, {
          map_data: mapData,
        });
      } else {
        // Create new
        await api.post('/sessions/team-bubble-maps/', {
          team: team.id,
          session_stage: currentSessionStageId,
          map_data: mapData,
        });
      }

      toast.success('✓ Bubble Map guardado exitosamente');
    } catch (error: any) {
      console.error('Error saving bubble map:', error);
      toast.error('Error al guardar bubble map: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const syncTimer = async (gameSessionId: number) => {
    try {
      const timerResponse = await api.get(`/sessions/game-sessions/${gameSessionId}/activity_timer/`);
      const timerData = timerResponse.data;

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
        console.warn('⚠️ Timer no iniciado: faltan datos del servidor');
        setTimerRemaining('--:--');
        return;
      }

      console.log('✅ Timer iniciado:', {
        duration: timerDurationRef.current,
        startTime: new Date(timerStartTimeRef.current).toISOString()
      });

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
          if (!timeExpiredRef.current) {
            timeExpiredRef.current = true;
            toast.error('⏱️ ¡Tiempo agotado!', { duration: 5000 });
          }
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

      {/* Timer */}
      <div className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 text-center">
        <p className="font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> Tiempo restante: {timerRemaining}
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 sm:p-8 md:p-12">
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                y: [0, -10, 0],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Lightbulb className="w-20 h-20 sm:w-24 sm:h-24 text-[#f757ac] mx-auto" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#093c92] mb-2">
              Bubble Map
            </h1>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl">
              Crea tu mapa mental con ideas y conceptos relacionados al desafío
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-5 rounded-lg mb-6 sm:mb-8">
            <p className="text-blue-800 font-semibold text-sm sm:text-base mb-2">
              💡 Instrucciones:
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              Haz clic en "Agregar Burbuja" para crear nuevas ideas. Puedes arrastrar las burbujas para organizarlas.
              La primera burbuja será el concepto central.
            </p>
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 sm:p-8 min-h-[500px] sm:min-h-[600px] relative border-4 border-gray-300 mb-6 sm:mb-8 overflow-hidden"
            style={{ borderColor: `${getTeamColorHex(team.color)}40` }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {bubbleMapNodes.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                <p className="text-base sm:text-lg italic">
                  No hay burbujas aún. Haz clic en "Agregar Burbuja" para comenzar.
                </p>
              </div>
            ) : (
              <>
                {/* SVG para líneas conectoras */}
                {bubbleMapNodes.length > 1 && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    {(() => {
                      const container = canvasRef.current;
                      if (!container) return null;
                      
                      const containerRect = container.getBoundingClientRect();
                      const centerX = containerRect.width / 2;
                      const centerY = containerRect.height / 2;
                      
                      return bubbleMapNodes.slice(1).map((node) => {
                        // Calcular posición de la burbuja
                        let nodeX = node.x;
                        let nodeY = node.y;
                        
                        // Si no tiene posición, calcularla
                        if (!node.x || !node.y) {
                          const radius = Math.min(containerRect.width, containerRect.height) * 0.25;
                          const index = bubbleMapNodes.indexOf(node) - 1;
                          const angle = (index * 360) / Math.max(bubbleMapNodes.length - 1, 1);
                          nodeX = centerX + radius * Math.cos((angle * Math.PI) / 180);
                          nodeY = centerY + radius * Math.sin((angle * Math.PI) / 180);
                        } else {
                          nodeX = node.x + 60; // Aproximación del centro de la burbuja
                          nodeY = node.y + 24;
                        }
                        
                        return (
                          <motion.line
                            key={`line-${node.id}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.3 }}
                            transition={{ duration: 0.5 }}
                            x1={centerX}
                            y1={centerY}
                            x2={nodeX}
                            y2={nodeY}
                            stroke={getTeamColorHex(team.color)}
                            strokeWidth="2"
                            strokeDasharray="5,5"
                          />
                        );
                      });
                    })()}
                  </svg>
                )}

                {/* Burbujas */}
                <div style={{ zIndex: 2, position: 'relative' }}>
                  {bubbleMapNodes.map((node, index) => {
                    const isCentral = index === 0;
                    const container = canvasRef.current;
                    let displayX = node.x;
                    let displayY = node.y;

                    // Si no es la central y no tiene posición, calcular posición circular
                    if (!isCentral && (!node.x || !node.y) && container) {
                      const containerRect = container.getBoundingClientRect();
                      const centerX = containerRect.width / 2;
                      const centerY = containerRect.height / 2;
                      const radius = Math.min(containerRect.width, containerRect.height) * 0.25;
                      const angle = ((index - 1) * 360) / Math.max(bubbleMapNodes.length - 1, 1);
                      displayX = centerX + radius * Math.cos((angle * Math.PI) / 180) - 50;
                      displayY = centerY + radius * Math.sin((angle * Math.PI) / 180) - 20;
                    } else if (isCentral && container) {
                      // La central siempre en el centro
                      const containerRect = container.getBoundingClientRect();
                      displayX = containerRect.width / 2 - 100;
                      displayY = containerRect.height / 2 - 30;
                    }

                    return (
                      <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`absolute px-6 py-4 rounded-full text-white font-semibold text-sm sm:text-base cursor-move shadow-xl flex items-center gap-2 ${
                          isCentral 
                            ? 'bg-purple-600 w-48 h-16 text-center justify-center' 
                            : 'bg-blue-500 min-w-[120px] h-12'
                        }`}
                        style={{
                          left: `${displayX}px`,
                          top: `${displayY}px`,
                          backgroundColor: isCentral ? getTeamColorHex(team.color) : '#3b82f6',
                        }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node.id)}
                        onDragOver={handleDragOver}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="flex-1 text-center">{node.text}</span>
                        {!isCentral && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteBubbleNode(node.id);
                            }}
                            className="bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold text-xs transition-colors flex-shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#093c92] to-blue-600 hover:from-[#072e73] hover:to-[#164a9a] text-white rounded-full shadow-xl"
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Agregar Burbuja
            </Button>
            <Button
              onClick={saveBubbleMap}
              disabled={saving || bubbleMapNodes.length === 0}
              className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-xl"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  Guardar Bubble Map
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Add Bubble Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4">
              Agregar Burbuja
            </h3>
            <input
              type="text"
              value={newBubbleText}
              onChange={(e) => setNewBubbleText(e.target.value)}
              placeholder="Ingresa el texto de la burbuja..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#093c92] focus:outline-none text-base sm:text-lg mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addBubbleNode();
                }
              }}
              autoFocus
            />
            <div className="flex gap-4">
              <Button
                onClick={addBubbleNode}
                className="flex-1 bg-gradient-to-r from-[#093c92] to-blue-600 hover:from-[#072e73] hover:to-[#164a9a] text-white rounded-full"
              >
                Agregar
              </Button>
              <Button
                onClick={() => {
                  setShowAddDialog(false);
                  setNewBubbleText('');
                }}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

