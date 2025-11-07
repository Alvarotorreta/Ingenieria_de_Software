import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, ArrowRight, Star, Coins, CheckCircle, Shuffle, Play, Pause, GripVertical } from 'lucide-react';
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
  const [mostrarOrganizacion, setMostrarOrganizacion] = useState(true);
  const [ordenGrupos, setOrdenGrupos] = useState<number[]>([]);
  const [equipoActual, setEquipoActual] = useState(0);
  const [timerActivo, setTimerActivo] = useState(false);
  const [timerPausado, setTimerPausado] = useState(false);
  const [mostrarEvaluacion, setMostrarEvaluacion] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
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

  const gruposOrdenados = ordenGrupos.length > 0 
    ? ordenGrupos.map(index => grupos[index])
    : grupos;

  const progress = ((equipoActual + 1) / gruposOrdenados.length) * 100;

  const handleOrganizarOrden = () => {
    // Crear array de índices y mezclarlo aleatoriamente
    const indices = grupos.map((_, index) => index);
    const mezclado = [...indices].sort(() => Math.random() - 0.5);
    setOrdenGrupos(mezclado);
    toast.success('¡Orden aleatorio generado!');
  };

  const handleComenzarPresentaciones = () => {
    if (ordenGrupos.length === 0) {
      // Si no se ha organizado el orden, usar el orden original
      setOrdenGrupos(grupos.map((_, index) => index));
    }
    setMostrarOrganizacion(false);
    setTimerActivo(false); // El timer inicia pausado hasta que el profesor presione Iniciar
  };

  const handleIniciarTimer = () => {
    setTimerActivo(true);
    setTimerPausado(false);
    toast.success('Timer iniciado');
  };

  const handleTogglePausar = () => {
    setTimerPausado(!timerPausado);
    toast.info(timerPausado ? 'Timer reanudado' : 'Timer pausado');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    const currentOrder = ordenGrupos.length > 0 
      ? [...ordenGrupos] 
      : grupos.map((_, index) => index);

    const newOrder = [...currentOrder];
    const [removed] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, removed);

    setOrdenGrupos(newOrder);
    setDraggedIndex(null);
  };

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

    // Obtener el índice del grupo en el array original
    const grupoIndexOriginal = ordenGrupos[equipoActual];
    addTokens(grupoIndexOriginal, tokensOtorgados, `Evaluación del pitch: ${promedioEvaluacion.toFixed(1)}/5 estrellas`);

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
    if (equipoActual < gruposOrdenados.length - 1) {
      setEquipoActual(prev => prev + 1);
      setTimerActivo(false);
      setTimerPausado(false);
    } else {
      setMostrarRanking(true);
    }
  };

  const handleSetRating = (criterio: string, rating: number) => {
    setEvaluacion(prev => ({ ...prev, [criterio]: rating }));
  };

  // Si mostrar ranking, solo mostrar ranking
  if (mostrarRanking) {
    return (
      <RankingTokens 
        grupos={grupos} 
        etapa={4} 
        onContinuar={() => navigate('/profesor/resultados-finales')} 
      />
    );
  }

  // Si mostrar intro, solo mostrar intro
  if (mostrarIntro) {
    return <IntroduccionCompetencia etapa={4} onContinuar={() => setMostrarIntro(false)} />;
  }

  // Si mostrar organización, mostrar pantalla de orden
  if (mostrarOrganizacion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full mb-4">
              <p>Etapa 4 de 4 • Comunicación</p>
            </div>
            <h1 className="text-[#093c92] mb-2">
              Organizar Orden de Presentación
            </h1>
            <p className="text-gray-600 text-lg">
              Define el orden en que presentarán los equipos
            </p>
          </motion.div>

          <Card className="p-8 mb-6">
            <div className="text-center mb-6">
              <Button
                onClick={handleOrganizarOrden}
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full"
              >
                <Shuffle className="w-5 h-5 mr-2" />
                Generar Orden Aleatorio
              </Button>
            </div>

            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500 mb-1">
                  💡 Arrastra los equipos para ordenar manualmente
                </p>
                <h3 className="text-gray-700">
                  {ordenGrupos.length > 0 ? 'Orden de Presentación:' : 'Orden actual:'}
                </h3>
              </div>
              {(ordenGrupos.length > 0 ? ordenGrupos.map(index => grupos[index]) : grupos).map((grupo, index) => {
                const currentOrder = ordenGrupos.length > 0 ? ordenGrupos : grupos.map((_, i) => i);
                const originalIndex = currentOrder[index];
                
                return (
                  <motion.div
                    key={`${grupo.nombre}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 cursor-move transition-all hover:shadow-md ${
                      draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                    }`}
                    style={{ borderColor: grupo.color }}
                  >
                    <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0"
                      style={{ backgroundColor: grupo.color }}
                    >
                      {index + 1}
                    </div>
                    <GroupBadge 
                      name={grupo.nombre} 
                      color={grupo.color}
                      size="medium"
                    />
                    <div className="ml-auto flex items-center gap-2">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-700">{grupo.tokens} tokens</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          <div className="text-center">
            <Button
              onClick={handleComenzarPresentaciones}
              size="lg"
              className="h-14 px-12 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-lg"
            >
              Comenzar Presentaciones
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-8">

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
                    name={gruposOrdenados[equipoActual].nombre} 
                    color={gruposOrdenados[equipoActual].color} 
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
            Equipo {equipoActual + 1} de {gruposOrdenados.length}
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
            style={{ borderColor: gruposOrdenados[equipoActual].color }}
          >
            <div className="text-center mb-8">
              <Mic className="w-20 h-20 mx-auto mb-6 text-[#093c92]" />
              <GroupBadge 
                name={gruposOrdenados[equipoActual].nombre} 
                color={gruposOrdenados[equipoActual].color} 
                size="large"
                className="mb-6"
              />
              <h2 className="text-[#093c92] mb-4">
                Es el turno de presentar
              </h2>
              <p className="text-gray-600 text-lg mb-4">
                El equipo tiene 90 segundos para su pitch
              </p>

              {/* Control del timer */}
              <div className="mb-6">
                <div className="flex justify-center gap-3 mb-4">
                  <Button
                    onClick={handleIniciarTimer}
                    disabled={timerActivo}
                    size="lg"
                    className={`h-12 px-6 rounded-full ${
                      timerActivo 
                        ? 'bg-gray-300 text-gray-500' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    }`}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {timerActivo ? 'Timer Activo' : 'Iniciar Timer'}
                  </Button>
                  <Button
                    onClick={handleTogglePausar}
                    disabled={!timerActivo}
                    variant={timerPausado ? "default" : "outline"}
                    size="lg"
                    className={`h-12 px-6 rounded-full ${
                      timerPausado && timerActivo
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : ''
                    }`}
                  >
                    {timerPausado ? <Play className="w-5 h-5 mr-2" /> : <Pause className="w-5 h-5 mr-2" />}
                    {timerPausado ? 'Reanudar' : 'Pausar'}
                  </Button>
                </div>
                {timerActivo && <Timer key={`timer-${equipoActual}`} initialMinutes={1.5} paused={timerPausado} />}
                {!timerActivo && (
                  <div className="text-gray-500 text-lg">
                    Presiona "Iniciar Timer" cuando el equipo esté listo
                  </div>
                )}
                {timerActivo && timerPausado && (
                  <div className="mt-2 text-orange-600 text-sm">
                    ⏸️ Timer pausado
                  </div>
                )}
              </div>
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
          <h3 className="text-gray-700 mb-4">Orden de presentación:</h3>
          <div className="flex flex-wrap gap-3">
            {gruposOrdenados.map((grupo, index) => (
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
                  <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
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
