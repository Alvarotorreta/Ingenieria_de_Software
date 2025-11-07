import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, Medal, Award, ArrowRight, Coins, Star, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Confetti from '../../components/Confetti';
import GroupBadge from '../../components/GroupBadge';
import { useGame } from '../../contexts/GameContext';

export default function ProfesorResultadosFinales() {
  const navigate = useNavigate();
  const { session } = useGame();

  const grupos = session?.grupos || [
    { nombre: 'Grupo Rojo', color: '#ff4757', tokens: 520, estudiantes: [] },
    { nombre: 'Grupo Azul', color: '#3742fa', tokens: 495, estudiantes: [] },
    { nombre: 'Grupo Verde', color: '#2ed573', tokens: 510, estudiantes: [] },
    { nombre: 'Grupo Amarillo', color: '#ffa502', tokens: 488, estudiantes: [] }
  ];

  // Ordenar por tokens
  const gruposOrdenados = [...grupos]
    .map((grupo, index) => ({ ...grupo, originalIndex: index }))
    .sort((a, b) => b.tokens - a.tokens);

  const getMedalIcon = (posicion: number) => {
    switch (posicion) {
      case 0:
        return <Trophy className="w-16 h-16 text-yellow-500" />;
      case 1:
        return <Medal className="w-14 h-14 text-gray-400" />;
      case 2:
        return <Award className="w-14 h-14 text-orange-600" />;
      default:
        return null;
    }
  };

  const getPodiumHeight = (posicion: number) => {
    switch (posicion) {
      case 0: return 'h-64';
      case 1: return 'h-48';
      case 2: return 'h-40';
      case 3: return 'h-32';
      default: return 'h-32';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] p-8">
      <Confetti active={true} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0], 
              scale: [1, 1.2, 1] 
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatDelay: 3 
            }}
            className="inline-block mb-6"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <Trophy className="w-16 h-16 text-white" />
            </div>
          </motion.div>
          
          <h1 className="text-white mb-4">
            ¡Resultados Finales!
          </h1>
          <p className="text-white/90 text-xl">
            Un recorrido extraordinario de emprendimiento e innovación
          </p>
        </motion.div>

        {/* Podio */}
        <div className="mb-12">
          <div className="flex items-end justify-center gap-6 mb-8">
            {/* Segundo lugar */}
            {gruposOrdenados[1] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                >
                  <Medal className="w-16 h-16 text-gray-400 mb-4" />
                </motion.div>
                <Card className="w-48 p-6 bg-white/95 backdrop-blur-sm border-4 border-gray-300 text-center h-48 flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-2">🥈</div>
                    <GroupBadge 
                      name={gruposOrdenados[1].nombre} 
                      color={gruposOrdenados[1].color} 
                      size="small"
                      className="mb-3"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Coins className="w-5 h-5 text-yellow-600" />
                      <span className="text-3xl text-[#093c92]">{gruposOrdenados[1].tokens}</span>
                    </div>
                    <p className="text-sm text-gray-500">tokens</p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Primer lugar */}
            {gruposOrdenados[0] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    y: [0, -15, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-20 h-20 text-yellow-500 mb-4" />
                </motion.div>
                <Card className="w-56 p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-yellow-400 text-center h-64 flex flex-col justify-between shadow-2xl">
                  <div>
                    <div className="text-6xl mb-3">🏆</div>
                    <GroupBadge 
                      name={gruposOrdenados[0].nombre} 
                      color={gruposOrdenados[0].color} 
                      size="medium"
                      className="mb-4"
                    />
                    <Badge className="bg-yellow-500 text-white border-0 mb-2">
                      <Star className="w-3 h-3 mr-1" />
                      ¡Ganador!
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Coins className="w-6 h-6 text-yellow-600" />
                      <span className="text-4xl text-[#093c92]">{gruposOrdenados[0].tokens}</span>
                    </div>
                    <p className="text-sm text-gray-500">tokens</p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Tercer lugar */}
            {gruposOrdenados[2] && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Award className="w-14 h-14 text-orange-600 mb-4" />
                </motion.div>
                <Card className="w-48 p-6 bg-white/95 backdrop-blur-sm border-4 border-orange-300 text-center h-40 flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-2">🥉</div>
                    <GroupBadge 
                      name={gruposOrdenados[2].nombre} 
                      color={gruposOrdenados[2].color} 
                      size="small"
                      className="mb-3"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Coins className="w-5 h-5 text-yellow-600" />
                      <span className="text-3xl text-[#093c92]">{gruposOrdenados[2].tokens}</span>
                    </div>
                    <p className="text-sm text-gray-500">tokens</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Cuarto lugar */}
          {gruposOrdenados[3] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center"
            >
              <Card className="w-64 p-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl text-gray-600">
                      4
                    </div>
                    <GroupBadge 
                      name={gruposOrdenados[3].nombre} 
                      color={gruposOrdenados[3].color} 
                      size="small"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span className="text-2xl text-[#093c92]">{gruposOrdenados[3].tokens}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Resumen de competencias */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl mb-8">
          <h2 className="text-2xl text-[#093c92] mb-6 text-center">
            Competencias Desarrolladas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { titulo: 'Creatividad', emoji: '💡', etapa: 'Etapa 1' },
              { titulo: 'Trabajo en Equipo', emoji: '🤝', etapa: 'Etapa 2' },
              { titulo: 'Empatía', emoji: '❤️', etapa: 'Etapa 3' },
              { titulo: 'Comunicación', emoji: '🎤', etapa: 'Etapa 4' }
            ].map((competencia, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl"
              >
                <div className="text-5xl mb-3">{competencia.emoji}</div>
                <h3 className="text-[#093c92] mb-1">{competencia.titulo}</h3>
                <p className="text-sm text-gray-500">{competencia.etapa}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Mensaje final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center mb-8"
        >
          <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <Sparkles className="w-12 h-12 text-[#fbc95c] mx-auto mb-4" />
            <h3 className="text-2xl text-[#093c92] mb-3">
              ¡Felicitaciones a Todos!
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Todos los equipos han demostrado creatividad, trabajo en equipo, empatía y excelentes habilidades de comunicación. ¡Cada uno es un ganador!
            </p>
          </Card>
        </motion.div>

        {/* Botón continuar a reflexión */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Button
            onClick={() => navigate('/profesor/reflexion')}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white rounded-full px-12 h-16 text-xl shadow-2xl"
          >
            Continuar a Reflexión Final
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
