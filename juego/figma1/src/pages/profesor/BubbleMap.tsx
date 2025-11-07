import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Eye, X, Coins, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import GroupBadge from '../../components/GroupBadge';
import RankingTokens from '../../components/RankingTokens';
import OtorgarTokens from '../../components/OtorgarTokens';
import IntroduccionCompetencia from '../../components/IntroduccionCompetencia';
import { useGame } from '../../contexts/GameContext';

export default function ProfesorBubbleMap() {
  const navigate = useNavigate();
  const { session, addTokens } = useGame();
  const [vistaPrevia, setVistaPrevia] = useState<number | null>(null);
  const [mostrarIntro, setMostrarIntro] = useState(true);
  const [mostrarRanking, setMostrarRanking] = useState(false);
  const [mostrarOtorgarTokens, setMostrarOtorgarTokens] = useState(false);

  const grupos = session?.grupos || [
    { nombre: 'Grupo Rojo', color: '#ff4757', tokens: 220, estudiantes: [] },
    { nombre: 'Grupo Azul', color: '#3742fa', tokens: 195, estudiantes: [] },
    { nombre: 'Grupo Verde', color: '#2ed573', tokens: 210, estudiantes: [] },
    { nombre: 'Grupo Amarillo', color: '#ffa502', tokens: 188, estudiantes: [] }
  ];

  // Mock de bubble maps
  const bubbleMaps = [
    {
      grupoIndex: 0,
      tematica: 'Sostenibilidad Urbana',
      ideaCentral: 'App de Reciclaje Gamificado',
      ideas: [
        { texto: 'Sistema de puntos', x: 30, y: 20, size: 80 },
        { texto: 'Mapa de puntos limpios', x: 60, y: 30, size: 90 },
        { texto: 'Desafíos semanales', x: 20, y: 60, size: 70 },
        { texto: 'Ranking comunitario', x: 70, y: 70, size: 85 },
        { texto: 'Premios canjeables', x: 45, y: 50, size: 75 }
      ],
      totalIdeas: 12
    },
    {
      grupoIndex: 1,
      tematica: 'Industria 4.0',
      ideaCentral: 'Plataforma IoT para PyMEs',
      ideas: [
        { texto: 'Sensores de producción', x: 25, y: 25, size: 85 },
        { texto: 'Dashboard en tiempo real', x: 65, y: 25, size: 90 },
        { texto: 'Alertas predictivas', x: 30, y: 65, size: 80 },
        { texto: 'Reportes automáticos', x: 70, y: 65, size: 75 },
        { texto: 'App móvil', x: 50, y: 45, size: 70 }
      ],
      totalIdeas: 10
    },
    {
      grupoIndex: 2,
      tematica: 'Tecnología en Salud',
      ideaCentral: 'Telemedicina Rural',
      ideas: [
        { texto: 'Consultas por video', x: 30, y: 30, size: 90 },
        { texto: 'Historial médico digital', x: 65, y: 20, size: 85 },
        { texto: 'Recetas electrónicas', x: 25, y: 70, size: 80 },
        { texto: 'Red de farmacias', x: 70, y: 60, size: 75 },
        { texto: 'Recordatorios medicamentos', x: 50, y: 50, size: 70 }
      ],
      totalIdeas: 11
    },
    {
      grupoIndex: 3,
      tematica: 'Sostenibilidad Urbana',
      ideaCentral: 'Huertos Urbanos Comunitarios',
      ideas: [
        { texto: 'App de coordinación', x: 30, y: 25, size: 80 },
        { texto: 'Guías de cultivo', x: 65, y: 30, size: 85 },
        { texto: 'Marketplace productos', x: 25, y: 65, size: 90 },
        { texto: 'Red de voluntarios', x: 70, y: 70, size: 75 },
        { texto: 'Talleres educativos', x: 50, y: 45, size: 70 }
      ],
      totalIdeas: 9
    }
  ];

  const handleOtorgarTokens = (grupoIndex: number, cantidad: number, motivo: string) => {
    addTokens(grupoIndex, cantidad, motivo);
  };

  const handleFinalizarEtapa = () => {
    setMostrarRanking(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      {/* Introducción de competencia */}
      {mostrarIntro && (
        <IntroduccionCompetencia etapa={2} onContinuar={() => setMostrarIntro(false)} />
      )}

      {/* Ranking de tokens */}
      {mostrarRanking && (
        <RankingTokens 
          grupos={grupos} 
          etapa={2} 
          onContinuar={() => navigate('/profesor/etapa3-lego')} 
        />
      )}

      {/* Modal de otorgar tokens */}
      <OtorgarTokens
        grupos={grupos}
        onOtorgar={handleOtorgarTokens}
        onClose={() => setMostrarOtorgarTokens(false)}
        isOpen={mostrarOtorgarTokens}
      />

      {/* Vista previa del bubble map */}
      <AnimatePresence>
        {vistaPrevia !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVistaPrevia(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-8"
            >
              <Card className="w-full max-w-4xl p-8 bg-white rounded-3xl shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <GroupBadge 
                      name={grupos[bubbleMaps[vistaPrevia].grupoIndex].nombre} 
                      color={grupos[bubbleMaps[vistaPrevia].grupoIndex].color} 
                      size="large"
                    />
                    <p className="text-gray-600 mt-2">{bubbleMaps[vistaPrevia].tematica}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setVistaPrevia(null)}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Bubble map preview */}
                <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-4 overflow-hidden"
                  style={{ borderColor: grupos[bubbleMaps[vistaPrevia].grupoIndex].color }}
                >
                  {/* Idea central */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-8 py-6 rounded-2xl shadow-2xl text-center text-white"
                      style={{ backgroundColor: grupos[bubbleMaps[vistaPrevia].grupoIndex].color }}
                    >
                      <p className="text-xl">{bubbleMaps[vistaPrevia].ideaCentral}</p>
                    </motion.div>
                  </div>

                  {/* Ideas secundarias */}
                  {bubbleMaps[vistaPrevia].ideas.map((idea, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="absolute bg-white rounded-xl shadow-lg p-4 border-2"
                      style={{
                        left: `${idea.x}%`,
                        top: `${idea.y}%`,
                        width: `${idea.size}px`,
                        borderColor: `${grupos[bubbleMaps[vistaPrevia].grupoIndex].color}80`
                      }}
                    >
                      <p className="text-xs text-gray-700 text-center">{idea.texto}</p>
                    </motion.div>
                  ))}

                  {/* Líneas conectoras */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {bubbleMaps[vistaPrevia].ideas.map((idea, idx) => (
                      <line
                        key={idx}
                        x1="50%"
                        y1="50%"
                        x2={`${idea.x}%`}
                        y2={`${idea.y}%`}
                        stroke={grupos[bubbleMaps[vistaPrevia].grupoIndex].color}
                        strokeWidth="2"
                        opacity="0.3"
                      />
                    ))}
                  </svg>
                </div>

                <div className="mt-6 text-center">
                  <Badge variant="outline" className="text-lg px-6 py-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {bubbleMaps[vistaPrevia].totalIdeas} ideas totales
                  </Badge>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full mb-4">
            <p>Etapa 2 de 4 • Trabajo en Equipo</p>
          </div>
          <h1 className="text-[#093c92] mb-2">
            Bubble Maps de los Equipos
          </h1>
          <p className="text-gray-600 text-lg">
            Los equipos están desarrollando sus mapas mentales colaborativos
          </p>
        </motion.div>

        {/* Botón tokens */}
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setMostrarOtorgarTokens(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-yellow-400 text-white rounded-full"
          >
            <Coins className="w-4 h-4 mr-2" />
            Otorgar Tokens
          </Button>
        </div>

        {/* Grid de bubble maps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {bubbleMaps.map((map, index) => {
            const grupo = grupos[map.grupoIndex];
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 border-4 h-full" style={{ borderColor: grupo.color }}>
                  <div className="flex items-center justify-between mb-4">
                    <GroupBadge name={grupo.nombre} color={grupo.color} size="medium" />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="rounded-full"
                      onClick={() => setVistaPrevia(index)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver mapa
                    </Button>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{map.tematica}</p>
                  
                  <div className="p-4 bg-gray-50 rounded-xl mb-4">
                    <p className="text-sm text-gray-500 mb-1">Idea Central:</p>
                    <p className="text-[#093c92]">{map.ideaCentral}</p>
                  </div>

                  {/* Mini preview */}
                  <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 mb-4 overflow-hidden"
                    style={{ borderColor: `${grupo.color}40` }}
                  >
                    {map.ideas.slice(0, 3).map((idea, idx) => (
                      <div
                        key={idx}
                        className="absolute bg-white rounded-lg p-2 border text-xs"
                        style={{
                          left: `${idea.x}%`,
                          top: `${idea.y}%`,
                          transform: 'translate(-50%, -50%) scale(0.6)',
                          borderColor: `${grupo.color}60`
                        }}
                      >
                        {idea.texto}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {map.totalIdeas} ideas
                    </Badge>
                    <Badge style={{ backgroundColor: grupo.color }} className="text-white border-0">
                      {grupo.tokens} tokens
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Info */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 mb-8">
          <h3 className="text-[#093c92] text-xl mb-3">
            ¿Qué están haciendo los equipos?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-sm text-gray-700">Generando ideas de forma colaborativa</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-sm text-gray-700">Organizando conceptos en el mapa mental</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-sm text-gray-700">Conectando ideas para crear soluciones</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Continuar */}
        <div className="text-center">
          <Button
            onClick={handleFinalizarEtapa}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-12 h-14 text-lg"
          >
            Finalizar Etapa 2
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
