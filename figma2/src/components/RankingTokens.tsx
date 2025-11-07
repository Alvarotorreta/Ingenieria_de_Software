import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Trophy, Medal, Award, ArrowRight, Coins } from 'lucide-react';
import GroupBadge from './GroupBadge';
import Confetti from './Confetti';

interface Grupo {
  nombre: string;
  color: string;
  tokens: number;
}

interface RankingTokensProps {
  grupos: Grupo[];
  etapa: number;
  onContinuar: () => void;
  variant?: 'blue' | 'purple'; // blue = flujo profesor, purple = flujo tablet
}

export default function RankingTokens({ grupos, etapa, onContinuar, variant = 'blue' }: RankingTokensProps) {
  // Ordenar grupos por tokens
  const gruposOrdenados = [...grupos].sort((a, b) => b.tokens - a.tokens);
  
  // Determinar el fondo según el variant
  const backgroundClass = variant === 'purple' 
    ? 'bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac]' 
    : 'bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac]';

  const getMedalIcon = (posicion: number) => {
    switch (posicion) {
      case 0:
        return <Trophy className="w-12 h-12 text-yellow-500" />;
      case 1:
        return <Medal className="w-10 h-10 text-gray-400" />;
      case 2:
        return <Award className="w-10 h-10 text-orange-600" />;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 ${backgroundClass} z-50 flex items-center justify-center p-8 relative overflow-hidden`}>
      {/* Animated decorations - solo para variant purple */}
      {variant === 'purple' && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-20 right-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute bottom-20 left-20 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl"
          />
        </>
      )}

      <Confetti active={true} />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl w-full relative z-10"
      >
        <Card className="p-12 bg-white rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="inline-block mb-4"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Coins className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h2 className="text-[#093c92] mb-2">
              Ranking de Tokens
            </h2>
            
            <p className="text-gray-600 text-xl">
              Resultados después de la Etapa {etapa}
            </p>
          </div>

          {/* Ranking */}
          <div className="space-y-4 mb-8">
            {gruposOrdenados.map((grupo, index) => {
              const isFirst = index === 0;
              
              return (
                <motion.div
                  key={grupo.nombre}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                >
                  <Card 
                    className={`p-6 border-4 ${
                      isFirst ? 'bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl scale-105' : 'bg-white'
                    }`}
                    style={{ 
                      borderColor: isFirst ? '#fbbf24' : grupo.color,
                    }}
                  >
                    <div className="flex items-center gap-6">
                      {/* Posición y medalla */}
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                          isFirst ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        
                        {getMedalIcon(index)}
                      </div>

                      {/* Grupo */}
                      <div className="flex-1">
                        <GroupBadge name={grupo.nombre} color={grupo.color} size="large" />
                      </div>

                      {/* Tokens */}
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <Coins className="w-6 h-6 text-yellow-600" />
                          <span className={`text-4xl ${isFirst ? 'text-[#093c92]' : 'text-gray-700'}`}>
                            {grupo.tokens}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">tokens</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Mensaje motivacional */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gruposOrdenados.length * 0.15 + 0.2 }}
            className="text-center mb-6"
          >
            <p className="text-gray-600 text-lg">
              {etapa === 4 
                ? '¡Felicitaciones a todos los equipos! 🎉' 
                : '¡Excelente trabajo! Continuemos con la siguiente etapa 🚀'
              }
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: gruposOrdenados.length * 0.15 + 0.4 }}
          >
            <Button
              onClick={onContinuar}
              className="w-full h-16 bg-gradient-to-r from-[#093c92] to-blue-600 text-white rounded-full text-xl"
            >
              {etapa === 4 ? 'Ver Resultados Finales' : 'Continuar a la Siguiente Etapa'}
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
