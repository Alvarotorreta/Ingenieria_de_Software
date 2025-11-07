import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Loader2,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Clock,
  Coins,
  Info,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { toast } from 'sonner';

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total?: number;
}

export function TabletPrototipo() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prototypeImageUrl, setPrototypeImageUrl] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<number | null>(null);
  const [currentSessionStageId, setCurrentSessionStageId] = useState<number | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<string>('--:--');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerStartTimeRef = useRef<number | null>(null);
  const timerDurationRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    loadGameState(connId);

    // Polling cada 3 segundos
    intervalRef.current = setInterval(() => {
      loadGameState(connId);
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (timerSyncIntervalRef.current) {
        clearInterval(timerSyncIntervalRef.current);
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

      const currentActivityId = gameData.current_activity;
      const currentActivityName = gameData.current_activity_name?.toLowerCase() || '';
      const currentStageNumber = gameData.current_stage_number || 1;

      // Si la etapa terminó, redirigir a resultados
      if (currentStageNumber === 3 && (!currentActivityName || !currentActivityId)) {
        window.location.href = `/tablet/etapa3/resultados/?connection_id=${connId}`;
        return;
      }

      // Si el profesor avanzó a otra etapa
      if (currentStageNumber > 3) {
        if (currentStageNumber === 4) {
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

      // Si hay una actividad de la etapa 3 que no es prototipo, redirigir
      if (currentStageNumber === 3 && currentActivityName && !currentActivityName.includes('prototipo')) {
        window.location.href = `/tablet/etapa3/resultados/?connection_id=${connId}`;
        return;
      }

      setCurrentActivityId(currentActivityId);

      // Obtener session_stage de Etapa 3
      if (!currentSessionStageId && currentActivityId) {
        const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${statusData.game_session.id}`);
        const stagesData = stagesResponse.data;
        const stages = Array.isArray(stagesData) ? stagesData : stagesData.results || [];
        const stage3 = stages.find((s: any) => s.stage_number === 3);
        if (stage3) {
          setCurrentSessionStageId(stage3.id);
        }
      }

      // Cargar estado del prototipo
      if (currentActivityId && currentSessionStageId && statusData.team.id) {
        await loadPrototypeStatus(statusData.game_session.id, statusData.team.id, currentActivityId, currentSessionStageId);
        await startTimer(currentActivityId, statusData.game_session.id);
      }

      setLoading(false);
    } catch (error: any) {
      console.error('Error loading game state:', error);
      toast.error('Error de conexión: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
      setLoading(false);
    }
  };

  const loadPrototypeStatus = async (gameSessionId: number, teamId: number, activityId: number, sessionStageId: number) => {
    try {
      const progressResponse = await api.get(
        `/sessions/team-activity-progress/?team=${teamId}&activity=${activityId}&session_stage=${sessionStageId}`
      );

      const progressData = progressResponse.data;
      const progressArray = Array.isArray(progressData) ? progressData : progressData.results || [];
      const progress = progressArray[0];

      if (progress && progress.prototype_image_url) {
        // Construir URL completa si es relativa
        let imageUrl = progress.prototype_image_url;
        if (imageUrl.startsWith('/')) {
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
          const baseUrl = apiBaseUrl.replace('/api', '');
          imageUrl = `${baseUrl}${imageUrl}`;
        }
        setPrototypeImageUrl(imageUrl);
        console.log('📷 Prototipo cargado:', imageUrl);
      }
    } catch (error) {
      console.error('Error loading prototype status:', error);
    }
  };

  const syncTimer = async (gameSessionId: number) => {
    try {
      const response = await api.get(`/sessions/game-sessions/${gameSessionId}/activity_timer/`);
      const data = response.data;

      if (data.started_at && data.timer_duration) {
        timerStartTimeRef.current = new Date(data.started_at).getTime();
        timerDurationRef.current = data.timer_duration;
      }
    } catch (error) {
      console.error('Error sincronizando timer:', error);
    }
  };

  const startTimer = async (activityId: number, gameSessionId: number) => {
    try {
      await syncTimer(gameSessionId);

      if (timerSyncIntervalRef.current) {
        clearInterval(timerSyncIntervalRef.current);
      }

      timerSyncIntervalRef.current = setInterval(() => {
        syncTimer(gameSessionId);
      }, 5000);

      const updateTimer = () => {
        if (!timerStartTimeRef.current || !timerDurationRef.current) return;

        const now = Date.now();
        const elapsed = Math.floor((now - timerStartTimeRef.current) / 1000);
        const remaining = Math.max(0, timerDurationRef.current - elapsed);

        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        setTimerRemaining(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

        if (remaining === 0 && timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      };

      updateTimer();
      timerIntervalRef.current = setInterval(updateTimer, 1000);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Máximo 5MB');
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const cancelImageSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadPrototype = async () => {
    if (!selectedImage || !team || !currentActivityId || !currentSessionStageId) {
      toast.error('Faltan datos necesarios para subir el prototipo');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('team', team.id.toString());
      formData.append('activity', currentActivityId.toString());
      formData.append('session_stage', currentSessionStageId.toString());
      formData.append('image', selectedImage);

      const response = await api.post('/sessions/team-activity-progress/upload_prototype/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.prototype_image_url) {
        // Construir URL completa si es relativa
        let imageUrl = response.data.prototype_image_url;
        if (imageUrl.startsWith('/')) {
          const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
          const baseUrl = apiBaseUrl.replace('/api', '');
          imageUrl = `${baseUrl}${imageUrl}`;
        }
        setPrototypeImageUrl(imageUrl);
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        toast.success('✓ Prototipo subido exitosamente');
        
        // Recargar el estado del prototipo para asegurar sincronización
        if (currentActivityId && currentSessionStageId && team) {
          setTimeout(() => {
            loadPrototypeStatus(gameSessionId || 0, team.id, currentActivityId, currentSessionStageId);
          }, 500);
        }
      }
    } catch (error: any) {
      console.error('Error uploading prototype:', error);
      toast.error('Error al subir prototipo: ' + (error.response?.data?.error || error.message || 'Error desconocido'));
    } finally {
      setUploading(false);
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
          <Button onClick={() => navigate('/tablet/join')}>Volver</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
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

        {/* Contenedor Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-2">
            🧱 Subida de Prototipo Lego
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Construye físicamente tu prototipo con legos y súbelo aquí
          </p>

          {/* Temporizador */}
          {timerRemaining !== '--:--' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-yellow-50 border-2 border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl font-semibold text-sm sm:text-base mb-6 text-center flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              Tiempo restante: {timerRemaining}
            </motion.div>
          )}

          {/* Información sobre qué construir */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-50 border-l-4 border-green-400 p-4 sm:p-6 rounded-lg mb-6"
          >
            <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5" />
              ¿Qué construir con legos?
            </h3>
            <p className="text-gray-700 text-sm sm:text-base mb-3">
              Basándote en el desafío que seleccionaste en la Etapa 2 (Empatía), construye un{' '}
              <strong>prototipo físico con legos</strong> que represente tu solución al problema identificado.
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              El prototipo debe ser una representación tangible de cómo tu equipo imagina que se podría resolver el desafío. Usa los legos para crear una maqueta, modelo o representación visual de tu solución.
            </p>
          </motion.div>

          {/* Instrucciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-lg mb-6"
          >
            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-3 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Instrucciones para subir el prototipo:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base">
              <li>Construye físicamente tu prototipo con legos</li>
              <li>Toma una foto del prototipo con la cámara de la tablet</li>
              <li>O sube una imagen desde la galería</li>
              <li>Revisa la vista previa y confirma la subida</li>
            </ul>
          </motion.div>

          {/* Prototipo ya subido */}
          {prototypeImageUrl && !selectedImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border-2 border-green-400 rounded-xl p-6 mb-6 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <p className="text-green-800 font-semibold text-lg">✓ Prototipo subido exitosamente</p>
              </div>
              <img
                src={prototypeImageUrl}
                alt="Prototipo subido"
                className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg border-2 border-green-300"
                onError={(e) => {
                  console.error('Error cargando imagen:', prototypeImageUrl);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  toast.error('Error al cargar la imagen del prototipo');
                }}
                onLoad={() => {
                  console.log('✅ Imagen cargada exitosamente:', prototypeImageUrl);
                }}
              />
            </motion.div>
          )}

          {/* Contenedor para subir prototipo */}
          {!prototypeImageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 text-center mb-6"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageSelect}
                className="hidden"
              />

              {!previewUrl ? (
                <div>
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-base sm:text-lg mb-6 font-medium">
                    Cuando hayas terminado de construir tu prototipo con legos, toma una foto o sube una imagen:
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="lg"
                    className="bg-[#093c92] hover:bg-[#082d6e] text-white px-8 py-6 text-lg font-semibold"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Tomar Foto o Seleccionar Imagen
                  </Button>
                  <p className="text-gray-500 text-sm mt-4 italic">
                    Puedes usar la cámara de la tablet o seleccionar una imagen de la galería
                  </p>
                </div>
              ) : (
                <div>
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg mb-6 border-2 border-gray-200"
                  />
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={cancelImageSelection}
                      variant="destructive"
                      size="lg"
                      className="px-6 py-3"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                    <Button
                      onClick={uploadPrototype}
                      disabled={uploading}
                      size="lg"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Subir Prototipo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

