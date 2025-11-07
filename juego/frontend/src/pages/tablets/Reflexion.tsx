import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import api from '@/services/api';
import { toast } from 'sonner';

export function TabletReflexion() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [estudiantesRespondidos, setEstudiantesRespondidos] = useState(0);

  useEffect(() => {
    const connId = searchParams.get('connection_id') || localStorage.getItem('tabletConnectionId');
    if (!connId) {
      navigate('/tablet/join');
      return;
    }
    setConnectionId(connId);
    loadSessionData(connId);

    // Polling para actualizar el progreso
    const interval = setInterval(() => {
      loadProgress();
    }, 5000);
    return () => clearInterval(interval);
  }, [searchParams, navigate]);

  const loadSessionData = async (connId: string) => {
    try {
      setLoading(true);
      
      const statusResponse = await api.get(`/sessions/tablet-connections/status/?connection_id=${connId}`);
      if (statusResponse.status === 404) {
        toast.error('Conexión no encontrada');
        navigate('/tablet/join');
        return;
      }

      const statusData = statusResponse.data;
      setGameSessionId(statusData.game_session.id);

      // No cargar equipos aquí porque requiere autenticación
      // El progreso se puede obtener de otra forma si es necesario
      loadProgress();
    } catch (error: any) {
      console.error('Error loading session data:', error);
      toast.error('Error al cargar la información');
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    if (!gameSessionId) return;
    
    try {
      // TODO: Implementar endpoint para obtener progreso de respuestas
      // const response = await api.get(`/sessions/game-sessions/${gameSessionId}/reflection_progress/`);
      // setEstudiantesRespondidos(response.data.responded_count);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const porcentajeCompletado = totalEstudiantes > 0 
    ? (estudiantesRespondidos / totalEstudiantes) * 100 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full mb-4">
            <p className="text-sm sm:text-base font-semibold">Reflexión Final</p>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
            Encuesta de Reflexión
          </h1>
          <p className="text-white/90 text-base sm:text-lg">
            Escanea el código QR con tu teléfono para completar la encuesta
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 sm:p-12 bg-white shadow-2xl border-2 border-[#093c92]/20">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl text-[#093c92] mb-2 font-bold">
                Escanea el código QR
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Usa la cámara de tu teléfono móvil para escanear
              </p>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="relative"
              >
                <div className="w-64 h-64 sm:w-80 sm:h-80 bg-white border-8 border-[#093c92] rounded-3xl flex items-center justify-center shadow-2xl p-4">
                  {/* Mock QR Code */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                      {Array.from({ length: 64 }).map((_, i) => {
                        // Patrón fijo para que no cambie en cada render
                        const isWhite = (i % 3 === 0 || i % 7 === 0 || (i + Math.floor(i / 8)) % 2 === 0);
                        return (
                          <div
                            key={i}
                            className={isWhite ? 'bg-white' : 'bg-black'}
                          />
                        );
                      })}
                    </div>
                    {/* Esquinas del QR */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-4 border-white" />
                    <div className="absolute top-4 right-4 w-12 h-12 border-4 border-white" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-white" />
                  </div>
                </div>

                {/* Ícono de escaneo animado */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </motion.div>
              </motion.div>
            </div>

            {/* Instrucciones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
              <div className="p-4 bg-purple-50 rounded-xl text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-lg sm:text-xl font-bold">1</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700">Abre la cámara de tu teléfono</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-xl text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-lg sm:text-xl font-bold">2</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700">Escanea el código QR</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-lg sm:text-xl font-bold">3</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-700">Completa la encuesta</p>
              </div>
            </div>

            {/* Progreso */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="text-gray-700 text-sm sm:text-base">Progreso de respuestas</span>
                </div>
                <Badge className="bg-[#093c92] text-white border-0 text-xs sm:text-sm">
                  {estudiantesRespondidos} / {totalEstudiantes}
                </Badge>
              </div>
              <Progress value={porcentajeCompletado} className="h-2 sm:h-3 mb-2" />
              <p className="text-xs sm:text-sm text-gray-600 text-right">
                {porcentajeCompletado.toFixed(0)}% completado
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

