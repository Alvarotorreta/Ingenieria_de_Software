import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Lightbulb,
  Trophy,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  MessageSquare,
  QrCode,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import api from '@/services/api';
import { toast } from 'sonner';

interface GameSession {
  id: number;
  room_code: string;
  status: string;
}

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total?: number;
}

export function ProfesorReflexion() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [estudiantesRespondidos, setEstudiantesRespondidos] = useState(0);


  useEffect(() => {
    if (sessionId) {
      loadSessionData();
      // Polling para actualizar el progreso de respuestas
      const interval = setInterval(() => {
        loadProgress();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const loadSessionData = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      
      // Cargar información de la sesión
      const sessionResponse = await api.get(`/sessions/game-sessions/${sessionId}/`);
      const sessionData = sessionResponse.data;
      setGameSession(sessionData);

      // Cargar equipos
      const teamsResponse = await api.get(`/sessions/teams/?game_session=${sessionId}`);
      const teamsData = teamsResponse.data.results || teamsResponse.data;
      setTeams(Array.isArray(teamsData) ? teamsData : []);

      // Calcular total de estudiantes
      const total = teamsData.reduce((sum: number, team: any) => {
        return sum + (team.members?.length || 0);
      }, 0);
      setTotalEstudiantes(total);

      // Cargar progreso inicial
      loadProgress();

    } catch (error: any) {
      console.error('Error loading session data:', error);
      toast.error('Error al cargar la información de la sesión');
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    if (!sessionId) return;
    
    try {
      // TODO: Implementar endpoint para obtener progreso de respuestas
      // Por ahora, usar un valor mock
      // const response = await api.get(`/sessions/game-sessions/${sessionId}/reflection_progress/`);
      // setEstudiantesRespondidos(response.data.responded_count);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleFinalizeSession = async () => {
    if (!sessionId) return;

    if (!confirm('¿Estás seguro de que deseas finalizar esta sesión? Se desconectarán todas las tablets.')) {
      return;
    }

    setFinalizing(true);
    try {
      await api.post(`/sessions/game-sessions/${sessionId}/end/`);
      toast.success('Sesión finalizada correctamente');
      setTimeout(() => {
        navigate('/profesor/panel');
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al finalizar la sesión');
    } finally {
      setFinalizing(false);
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

  // Ordenar equipos por tokens totales
  const teamsOrdered = [...teams].sort((a, b) => (b.tokens_total || 0) - (a.tokens_total || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#093c92] mb-2 flex items-center gap-2">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
              Reflexión Final
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Código de sala: <span className="font-semibold">{gameSession?.room_code}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleFinalizeSession}
              disabled={finalizing}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              {finalizing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Finalizando...
                </>
              ) : (
                'Finalizar Sesión'
              )}
            </Button>
            <Button 
              onClick={() => navigate('/profesor/panel')} 
              variant="outline" 
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Panel</span>
              <span className="sm:hidden">Volver</span>
            </Button>
          </div>
        </motion.div>

        {/* QR Code Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 sm:p-12 bg-white shadow-2xl border-2 border-[#093c92]/20 mb-4 sm:mb-6">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl text-[#093c92] mb-2 font-bold">
                Escanea el código QR
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Los estudiantes deben escanear este código con sus teléfonos móviles
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

        {/* Preguntas de la encuesta (info para el profesor) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 mb-4 sm:mb-6">
            <h3 className="text-[#093c92] text-lg sm:text-xl mb-4 font-bold">
              Preguntas de la Encuesta
            </h3>
            <div className="space-y-3">
              {[
                '¿Qué tan efectiva fue la comunicación en tu equipo?',
                '¿Qué tan creativa fue la solución propuesta?',
                '¿Cómo calificarías el trabajo en equipo?',
                '¿Qué tan empático fue tu equipo con el problema?',
                '¿Qué tan bien se organizaron las tareas?',
                '¿Qué tan satisfecho estás con el resultado final?'
              ].map((pregunta, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                  <div className="w-6 h-6 bg-[#093c92] rounded-full flex items-center justify-center text-white text-xs sm:text-sm flex-shrink-0 font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm">{pregunta}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Ranking Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6" />
            Clasificación Final
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {teamsOrdered.map((team, index) => {
              const rank = index + 1;
              const isTopThree = rank <= 3;
              const rankMedal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}°`;

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`p-4 sm:p-6 rounded-xl shadow-md border-l-4 ${
                    isTopThree
                      ? rank === 1
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-xl scale-105'
                        : rank === 2
                        ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 shadow-lg'
                        : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300 shadow-lg'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-md"
                        style={{ backgroundColor: team.color || '#667eea' }}
                      >
                        {team.color?.charAt(0).toUpperCase() || 'E'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-[#093c92]">
                          {team.name}
                        </h4>
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-600">
                      {rankMedal}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">Tokens totales</span>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm sm:text-base font-bold text-gray-800">
                        {team.tokens_total || 0}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
