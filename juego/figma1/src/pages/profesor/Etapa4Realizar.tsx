import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, ArrowRight, Star, Coins, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import GroupBadge from '../../components/GroupBadge';
import Timer from '../../components/Timer';
import IntroduccionCompetencia from '../../components/IntroduccionCompetencia';
import RankingTokens from '../../components/RankingTokens';
import { useGame } from '../../contexts/GameContext';
import { toast } from 'sonner@2.0.3';

interface Evaluacion {
  claridad: number;
  creatividad: number;
  viabilidad: number;
  presentacion: number;
  comentarios: string;
}

export default function ProfesorEtapa4Realizar() {
  const navigate = useNavigate();
  const { session, addTokens } = useGame();
  const [mostrarIntro, setMostrarIntro] = useState(true);
  const [mostrarRanking, setMostrarRanking] = useState(false);
  const [equipoActual, setEquipoActual] = useState(0);
  const [mostrarEvaluacion, setMostrarEvaluacion] = useState(false);
  const [evaluacion, setEvaluacion] = useState<Evaluacion>({
    claridad: 0,
    creatividad: 0,
    viabilidad: 0,
    presentacion: 0,
    comentarios: ''
  });

  const grupos = session?.grupos || [
    { nombre: 'Grupo Rojo', color: '#ff4757', tokens: 420, estudiantes: [] },
    { nombre: 'Grupo Azul', color: '#3742fa', tokens: 395, estudiantes: [] },
    { nombre: 'Grupo Verde', color: '#2ed573', tokens: 410, estudiantes: [] },
    { nombre: 'Grupo Amarillo', color: '#ffa502', tokens: 388, estudiantes: [] }
  ];

  const progress = ((equipoActual + 1) / grupos.length) * 100;

  const criterios = [
    { key: 'claridad', label: 'Claridad del Mensaje', icon: '💬' },
    { key: 'creatividad', label: 'Creatividad de la Solución', icon: '💡' },
    { key: 'viabilidad', label: 'Viabilidad del Proyecto', icon: '✅' },
    { key: 'presentacion', label: 'Calidad de la Presentación', icon: '🎯' }
  ];

  const handleFinalizarPresentacion = () => {
    setMostrarEvaluacion(true);
  };

  const handleGuardarEvaluacion = () => {
    // Validar que todos los criterios estén evaluados
    if (!evaluacion.claridad || !evaluacion.creatividad || !evaluacion.viabilidad || !evaluacion.presentacion) {
      toast.error('Por favor evalúa todos los criterios');
      return;
    }

    // Calcular tokens basado en la evaluación
    const promedioEvaluacion = (evaluacion.claridad + evaluacion.creatividad + evaluacion.viabilidad + evaluacion.presentacion) / 4;
    const tokensOtorgados = Math.round(promedioEvaluacion * 20); // Máximo 100 tokens

    addTokens(equipoActual, tokensOtorgados, `Evaluación del pitch: ${promedioEvaluacion.toFixed(1)}/5 estrellas`);

    // Reset evaluación
    setEvaluacion({
      claridad: 0,
      creatividad: 0,
      viabilidad: 0,
      presentacion: 0,
      comentarios: ''
    });
    setMostrarEvaluacion(false);

    // Siguiente equipo o finalizar
    if (equipoActual < grupos.length - 1) {
      setEquipoActual(prev => prev + 1);
    } else {
      setMostrarRanking(true);
    }
  };

  const handleSetRating = (criterio: string, rating: number) => {
    setEvaluacion(prev => ({ ...prev, [criterio]: rating }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-8">
      {/* Introducción de competencia */}
      {mostrarIntro && (
        <IntroduccionCompetencia etapa={4} onContinuar={() => setMostrarIntro(false)} />
      )}

      {/* Ranking de tokens */}
      {mostrarRanking && (
        <RankingTokens 
          grupos={grupos} 
          etapa={4} 
          onContinuar={() => navigate('/profesor/resultados-finales')} 
        />
      )}

      {/* Modal de evaluación */}
      <AnimatePresence>
        {mostrarEvaluacion && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8"
            >
              <Card className="w-full max-w-2xl p-8 bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="text-center mb-8">
                  <GroupBadge 
                    name={grupos[equipoActual].nombre} 
                    color={grupos[equipoActual].color} 
                    size="large"
                    className="mb-4"
                  />
                  <h2 className="text-2xl text-[#093c92] mb-2">Evaluar Presentación</h2>
                  <p className="text-gray-600">Califica cada criterio del 1 al 5 estrellas</p>
                </div>

                <div className="space-y-6 mb-6">
                  {criterios.map((criterio) => (
                    <div key={criterio.key} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{criterio.icon}</span>
                          <Label className="text-gray-700">{criterio.label}</Label>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 justify-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <motion.button
                            key={rating}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSetRating(criterio.key, rating)}
                            className="p-2"
                          >
                            <Star 
                              className={`w-8 h-8 ${
                                rating <= evaluacion[criterio.key as keyof Evaluacion]
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Comentarios */}
                  <div>
                    <Label htmlFor="comentarios" className="text-gray-700 mb-2 block">
                      Comentarios (opcional)
                    </Label>
                    <Textarea
                      id="comentarios"
                      value={evaluacion.comentarios}
                      onChange={(e) => setEvaluacion(prev => ({ ...prev, comentarios: e.target.value }))}
                      placeholder="Escribe tus observaciones y retroalimentación..."
                      className="min-h-24"
                    />
                  </div>

                  {/* Preview de tokens */}
                  {evaluacion.claridad > 0 && evaluacion.creatividad > 0 && evaluacion.viabilidad > 0 && evaluacion.presentacion > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-gray-700">Tokens a otorgar:</p>
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-yellow-600" />
                          <span className="text-2xl text-[#093c92]">
                            {Math.round(((evaluacion.claridad + evaluacion.creatividad + evaluacion.viabilidad + evaluacion.presentacion) / 4) * 20)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setMostrarEvaluacion(false)}
                    variant="outline"
                    className="flex-1 h-12 rounded-full"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleGuardarEvaluacion}
                    className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Guardar Evaluación
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full mb-4">
            <p>Etapa 4 de 4 • Comunicación</p>
          </div>
          <h1 className="text-[#093c92] mb-2">
            Presentación de Pitches
          </h1>
          <p className="text-gray-600 text-lg">
            Equipo {equipoActual + 1} de {grupos.length}
          </p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-3" />
        </div>

        {/* Equipo actual */}
        <motion.div
          key={equipoActual}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card className="p-12 bg-white border-4 mb-8"
            style={{ borderColor: grupos[equipoActual].color }}
          >
            <div className="text-center mb-8">
              <Mic className="w-20 h-20 mx-auto mb-6 text-[#093c92]" />
              <GroupBadge 
                name={grupos[equipoActual].nombre} 
                color={grupos[equipoActual].color} 
                size="large"
                className="mb-6"
              />
              <h2 className="text-[#093c92] mb-4">
                Es el turno de presentar
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                El equipo tiene 3 minutos para su pitch
              </p>

              <Timer initialMinutes={3} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <p className="text-sm text-gray-600 mb-1">Problema</p>
                <p className="text-gray-800">¿Qué resuelven?</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <p className="text-sm text-gray-600 mb-1">Solución</p>
                <p className="text-gray-800">¿Cómo lo resuelven?</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl text-center">
                <p className="text-sm text-gray-600 mb-1">Impacto</p>
                <p className="text-gray-800">¿A quién ayudan?</p>
              </div>
            </div>

            <Button
              onClick={handleFinalizarPresentacion}
              className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Finalizar Presentación y Evaluar
            </Button>
          </Card>
        </motion.div>

        {/* Equipos restantes */}
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
          <h3 className="text-gray-700 mb-4">Equipos pendientes:</h3>
          <div className="flex flex-wrap gap-3">
            {grupos.map((grupo, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-full border-2 ${
                  index < equipoActual 
                    ? 'bg-green-100 border-green-500' 
                    : index === equipoActual
                    ? 'bg-white border-[#093c92]'
                    : 'bg-gray-100 border-gray-300'
                }`}
                style={{ 
                  borderColor: index === equipoActual ? grupo.color : undefined
                }}
              >
                <div className="flex items-center gap-2">
                  {index < equipoActual && <CheckCircle className="w-4 h-4 text-green-600" />}
                  <span className={index === equipoActual ? 'font-bold' : ''}>
                    {grupo.nombre}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
