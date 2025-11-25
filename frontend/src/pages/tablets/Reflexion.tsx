import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, CheckCircle2, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BackgroundMusic } from '@/components/BackgroundMusic';
import { sessionsAPI, reflectionEvaluationsAPI, tabletConnectionsAPI } from '@/services';
import { toast } from 'sonner';

export function TabletReflexion() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [gameSessionId, setGameSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [estudiantesRespondidos, setEstudiantesRespondidos] = useState(0);
  const [qrCode, setQrCode] = useState<string | null>(null);

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
      
      let statusData;
      try {
        statusData = await tabletConnectionsAPI.getStatus(connId);
      } catch (error: any) {
        // CRÍTICO: En reflexión NO redirigimos aunque haya errores
        // Las tablets deben permanecer aquí para que los estudiantes completen la encuesta del QR
        // Solo redirigir si es un error 404 y la sesión NO está completada
        if (error.response?.status === 404) {
          // Verificar si la sesión está completada antes de redirigir
          // Si está completada, permanecer en reflexión
          console.warn('⚠️ Tablet - Conexión no encontrada, pero permaneciendo en reflexión');
          // NO redirigir, solo mostrar un mensaje
          toast.error('Conexión no encontrada, pero permaneciendo en reflexión');
          return;
        }
        throw error;
      }
      setGameSessionId(statusData.game_session.id);
      
      // CRÍTICO: En reflexión NO redirigimos aunque la sesión esté finalizada
      // Las tablets deben permanecer aquí para que los estudiantes completen la encuesta del QR
      // NO verificar el status de la sesión aquí para evitar redirecciones automáticas

      // No cargar equipos aquí porque requiere autenticación
      // El progreso se puede obtener de otra forma si es necesario
      loadProgress();
      
      // Cargar QR de evaluación
      if (statusData.game_session?.id) {
        loadReflectionQR(statusData.game_session.id);
      }
      
      // El total de estudiantes se obtendrá desde loadProgress cuando se cargue el endpoint by_room
      // Por ahora usar un valor temporal que se actualizará cuando se cargue el progreso
      setTotalEstudiantes(0); // Se actualizará desde loadProgress
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
      // Obtener número de evaluaciones recibidas y total de estudiantes
      const sessionData = await sessionsAPI.getById(gameSessionId);
      
      // CRÍTICO: En reflexión NO redirigimos aunque la sesión esté finalizada
      // Las tablets deben permanecer aquí para que los estudiantes completen la encuesta del QR
      // NO verificar el status aquí para evitar redirecciones
      
      const roomCode = sessionData.room_code;
      const evaluationsData = await reflectionEvaluationsAPI.byRoom(roomCode);
      const evaluationsArray = Array.isArray(evaluationsData) ? evaluationsData : [evaluationsData];
      setEstudiantesRespondidos(evaluationsArray.length);
      
      // Nota: El endpoint byRoom no devuelve total_students directamente
      // Se mantiene el cálculo anterior si es necesario
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };
  
  const loadReflectionQR = async (sessionId: number) => {
    try {
      console.log('📥 Tablet - Cargando QR de reflexión para sesión:', sessionId);
      const qrData = await sessionsAPI.getReflectionQR(sessionId);
      console.log('✅ Tablet - Respuesta del endpoint reflection_qr:', qrData);
      
      if (qrData?.qr_code) {
        setQrCode(qrData.qr_code);
        console.log('✅ Tablet - QR cargado correctamente');
      } else {
        console.warn('⚠️ Tablet - El endpoint no devolvió qr_code');
      }
    } catch (error: any) {
      console.error('❌ Tablet - Error loading QR:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}
        />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              initial={{ x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080) }}
              animate={{ y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      </div>

      <BackgroundMusic />

      <div className="relative z-10 p-3 sm:p-4 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 sm:mb-6"
          >
            <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-full mb-3 sm:mb-4">
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
            <Card className="p-4 sm:p-8 bg-white shadow-2xl border-2 border-[#093c92]/20">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl text-[#093c92] mb-2 font-bold">
                  Escanea el código QR
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Usa la cámara de tu teléfono móvil para escanear
                </p>
              </div>

              {/* QR Code - Simple como en el lobby */}
              <div className="flex justify-center mb-4 sm:mb-6">
                {qrCode ? (
                  <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    src={qrCode}
                    alt="QR Code Evaluación"
                    className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-gray-200 rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50">
                    <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                  </div>
                )}
              </div>

              {/* Instrucciones */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center border border-purple-200"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
                    <span className="text-white text-lg sm:text-xl font-bold">1</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">Abre la cámara de tu teléfono</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-3 sm:p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl text-center border border-pink-200"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
                    <span className="text-white text-lg sm:text-xl font-bold">2</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">Escanea el código QR</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-center border border-blue-200"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-md">
                    <span className="text-white text-lg sm:text-xl font-bold">3</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">Completa la encuesta</p>
                </motion.div>
              </div>

              {/* Progreso */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl border-2 border-purple-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <span className="text-gray-700 text-sm sm:text-base font-semibold">Progreso de respuestas</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-[#093c92] to-[#f757ac] text-white border-0 text-xs sm:text-sm shadow-md">
                    {estudiantesRespondidos} / {totalEstudiantes}
                  </Badge>
                </div>
                <Progress value={porcentajeCompletado} className="h-2 sm:h-3 mb-2" />
                <p className="text-xs sm:text-sm text-gray-600 text-right font-medium">
                  {porcentajeCompletado.toFixed(0)}% completado
                </p>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

