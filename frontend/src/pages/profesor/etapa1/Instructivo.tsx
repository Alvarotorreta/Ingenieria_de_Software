import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, BookOpen, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sessionsAPI } from '@/services';
import { toast } from 'sonner';
import { isDevMode } from '@/utils/devMode';

interface GameSession {
  id: number;
  room_code: string;
  status: string;
  current_activity_name?: string;
  current_stage_number?: number;
  started_at?: string;
}

export function ProfesorInstructivo() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (sessionId) {
      loadGameSession();
      
      // Auto-refresh cada 5 segundos
      intervalRef.current = setInterval(() => {
        loadGameSession();
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [sessionId]);

  const loadGameSession = async () => {
    if (!sessionId) return;

    try {
      const data: GameSession = await sessionsAPI.getById(sessionId);
      
      console.log('📚 Instructivo - Estado actual:', {
        current_activity_name: data.current_activity_name,
        current_stage_number: data.current_stage_number
      });
      
      setGameSession(data);

      // Si hay una actividad establecida (Personalización), redirigir a Personalización
      if (data.current_activity_name && data.current_stage_number) {
        console.log('🔄 Ya se inició la Etapa 1, redirigiendo desde Instructivo:', data.current_activity_name);
        const normalizedName = data.current_activity_name.toLowerCase();
        if (normalizedName.includes('personaliz')) {
          window.location.href = `/profesor/etapa1/personalizacion/${sessionId}/`;
          return;
        } else if (normalizedName.includes('presentaci')) {
          window.location.href = `/profesor/etapa1/presentacion/${sessionId}/`;
          return;
        }
      }

      setLoading(false);
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate('/profesor/login');
      } else {
        toast.error('Error al cargar la sesión');
      }
      setLoading(false);
    }
  };

  const handleNextActivity = async () => {
    if (!sessionId || !gameSession) return;

    setAdvancing(true);
    try {
      // Iniciar la Etapa 1 después del instructivo
      const data = await sessionsAPI.startStage1(sessionId);

      console.log('✅ Etapa 1 iniciada:', data);
      toast.success('Instructivo completado. Iniciando Etapa 1...');
      
      // Redirigir directamente a Personalización (el modal se mostrará automáticamente)
      setTimeout(() => {
        window.location.href = `/profesor/etapa1/personalizacion/${sessionId}/`;
      }, 500);
    } catch (error: any) {
      console.error('Error al iniciar Etapa 1:', error);
      toast.error(error.response?.data?.error || 'Error al iniciar la Etapa 1');
      setAdvancing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!gameSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error al cargar la sesión</p>
          <Button onClick={() => navigate('/profesor/panel')}>Volver al Panel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Fondo animado */}
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

      <div className="relative z-10 h-screen flex flex-col items-center justify-center p-3 sm:p-4 pt-12 sm:pt-16 md:pt-20 lg:pt-24">
        {/* Logo UDD */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30">
          <img 
            src="/images/UDD-negro.png" 
            alt="Logo UDD" 
            className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain opacity-90 drop-shadow-lg"
          />
        </div>

        <div className="w-full max-w-6xl flex flex-col h-full">
          {/* Botón Continuar - Arriba */}
          <div className="w-full mb-3 sm:mb-4 z-20 flex justify-center gap-2 flex-shrink-0">
            <Button
              onClick={handleNextActivity}
              disabled={advancing}
              className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base font-semibold bg-gradient-to-r from-[#093c92] to-[#f757ac] hover:from-[#072e73] hover:to-[#e6498a] text-white shadow-md hover:shadow-lg transition-all"
            >
              {advancing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Avanzando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            {/* Botón Dev - Solo en modo desarrollo */}
            {isDevMode() && (
              <Button
                onClick={handleNextActivity}
                disabled={advancing}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all"
                title="Modo Dev: Avanzar sin requisitos"
              >
                {advancing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Avanzando...
                  </>
                ) : (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    Dev
                  </>
                )}
              </Button>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex items-center justify-center relative z-20 flex-1 min-h-0"
          >
            {/* Mensaje informativo - Sin video para el profesor */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-gray-200 w-full max-w-3xl flex flex-col items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#093c92] to-[#f757ac] rounded-full flex items-center justify-center mb-6 shadow-lg"
              >
                <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[#093c92] text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center"
              >
                Instructivo del Juego
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-700 text-base sm:text-lg md:text-xl mb-2 text-center"
              >
                Los estudiantes están viendo las instrucciones del juego en sus tablets
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-sm sm:text-base mt-4 text-center"
              >
                Presiona "Continuar" cuando todos hayan terminado de leer las instrucciones para iniciar la Etapa 1
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}










