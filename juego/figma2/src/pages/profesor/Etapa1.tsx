import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Users, ArrowRight, Coins } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import Timer from '../../components/Timer';
import IntroduccionCompetencia from '../../components/IntroduccionCompetencia';
import RankingTokens from '../../components/RankingTokens';
import OtorgarTokens from '../../components/OtorgarTokens';
import GroupBadge from '../../components/GroupBadge';
import { useGame } from '../../contexts/GameContext';

export default function ProfesorEtapa1() {
  const navigate = useNavigate();
  const { session, addTokens, updateSession } = useGame();
  const [mostrarIntro, setMostrarIntro] = useState(true);
  const [mostrarRanking, setMostrarRanking] = useState(false);
  const [mostrarOtorgarTokens, setMostrarOtorgarTokens] = useState(false);

  const grupos = session?.grupos || [
    { nombre: 'Grupo Rojo', color: '#ff4757', tokens: 120, estudiantes: [] },
    { nombre: 'Grupo Azul', color: '#3742fa', tokens: 95, estudiantes: [] },
    { nombre: 'Grupo Verde', color: '#2ed573', tokens: 110, estudiantes: [] },
    { nombre: 'Grupo Amarillo', color: '#ffa502', tokens: 88, estudiantes: [] }
  ];

  // Mock progress de los grupos
  const progresosGrupos = [
    { grupo: 'Grupo Rojo', color: '#ff4757', progreso: 100, completado: true },
    { grupo: 'Grupo Azul', color: '#3742fa', progreso: 75, completado: false },
    { grupo: 'Grupo Verde', color: '#2ed573', progreso: 100, completado: true },
    { grupo: 'Grupo Amarillo', color: '#ffa502', progreso: 50, completado: false }
  ];

  const handleContinuarIntro = () => {
    setMostrarIntro(false);
  };

  const handleFinalizarEtapa = () => {
    setMostrarRanking(true);
  };

  const handleContinuarRanking = () => {
    navigate('/profesor/eleccion-tematica');
  };

  const handleOtorgarTokens = (grupoIndex: number, cantidad: number, motivo: string) => {
    addTokens(grupoIndex, cantidad, motivo);
  };

  // Si mostrar ranking, solo mostrar ranking
  if (mostrarRanking) {
    return (
      <RankingTokens 
        grupos={grupos} 
        etapa={1} 
        onContinuar={handleContinuarRanking} 
      />
    );
  }

  // Si mostrar intro, solo mostrar intro
  if (mostrarIntro) {
    return <IntroduccionCompetencia etapa={1} onContinuar={handleContinuarIntro} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8">
      {/* Modal de otorgar tokens */}
      <OtorgarTokens
        grupos={grupos}
        onOtorgar={handleOtorgarTokens}
        onClose={() => setMostrarOtorgarTokens(false)}
        isOpen={mostrarOtorgarTokens}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full mb-4">
            <p>Etapa 1 de 4 • Creatividad</p>
          </div>
        </motion.div>

        {/* ¿Qué están haciendo los equipos? */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-[#093c92]/20 mb-8">
          <h3 className="text-[#093c92] text-xl mb-3">
            ¿Qué están haciendo los equipos?
          </h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm">
                1
              </div>
              <p className="text-gray-700 text-sm">Resolviendo anagramas relacionados con emprendimiento</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm">
                2
              </div>
              <p className="text-gray-700 text-sm">Conociendo a sus compañeros de equipo</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white flex-shrink-0 text-sm">
                3
              </div>
              <p className="text-gray-700 text-sm">Desarrollando estrategias de comunicación</p>
            </div>
          </div>
        </Card>

        {/* Timer y botón de tokens */}
        <div className="flex justify-between items-center mb-8">
          <Timer initialMinutes={10} />
          
          <Button
            onClick={() => setMostrarOtorgarTokens(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-yellow-400 text-white rounded-full px-6"
          >
            <Coins className="w-4 h-4 mr-2" />
            Otorgar Tokens
          </Button>
        </div>

        {/* Progreso de grupos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {progresosGrupos.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 border-4" style={{ borderColor: item.color }}>
                <div className="flex items-center justify-between mb-4">
                  <GroupBadge name={item.grupo} color={item.color} size="medium" />
                  {item.completado && (
                    <span className="text-green-600 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Completado
                    </span>
                  )}
                </div>
                
                <Progress value={item.progreso} className="h-3 mb-2" />
                <p className="text-sm text-gray-600 text-right">{item.progreso}%</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Botón continuar */}
        <div className="text-center mt-4">
          <Button
            onClick={handleFinalizarEtapa}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-12 h-14 text-lg"
          >
            Finalizar Etapa 1
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
