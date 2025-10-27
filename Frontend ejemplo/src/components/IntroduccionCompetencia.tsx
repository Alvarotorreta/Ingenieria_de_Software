import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Lightbulb, Users, Heart, MessageSquare, ArrowRight } from 'lucide-react';

interface IntroduccionCompetenciaProps {
  etapa: 1 | 2 | 3 | 4;
  onContinuar: () => void;
}

const competencias = {
  1: {
    titulo: 'Creatividad',
    icono: Lightbulb,
    color: 'from-purple-500 to-pink-500',
    descripcion: 'En esta etapa desarrollaremos la capacidad de crear ideas innovadoras y soluciones originales.',
    puntos: [
      'Pensar fuera de lo común',
      'Generar múltiples alternativas',
      'Conectar ideas de forma innovadora'
    ]
  },
  2: {
    titulo: 'Trabajo en Equipo',
    icono: Users,
    color: 'from-blue-500 to-cyan-500',
    descripcion: 'Aprenderemos a colaborar efectivamente, aprovechando las fortalezas de cada miembro del equipo.',
    puntos: [
      'Colaborar y coordinarse',
      'Escuchar activamente a los demás',
      'Distribuir roles y responsabilidades'
    ]
  },
  3: {
    titulo: 'Empatía',
    icono: Heart,
    color: 'from-orange-500 to-red-500',
    descripcion: 'Desarrollaremos la capacidad de comprender y conectar con las necesidades de otros.',
    puntos: [
      'Ponerse en el lugar del otro',
      'Identificar necesidades reales',
      'Crear soluciones centradas en el usuario'
    ]
  },
  4: {
    titulo: 'Comunicación',
    icono: MessageSquare,
    color: 'from-green-500 to-emerald-500',
    descripcion: 'Fortaleceremos la habilidad de transmitir ideas de forma clara, persuasiva y efectiva.',
    puntos: [
      'Estructurar mensajes claros',
      'Presentar con confianza',
      'Adaptar el mensaje a la audiencia'
    ]
  }
};

export default function IntroduccionCompetencia({ etapa, onContinuar }: IntroduccionCompetenciaProps) {
  const competencia = competencias[etapa];
  const Icon = competencia.icono;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-2xl w-full"
      >
        <Card className="p-12 bg-white rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className={`inline-block p-6 rounded-3xl bg-gradient-to-br ${competencia.color} mb-6`}
            >
              <Icon className="w-16 h-16 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-block px-6 py-2 bg-gray-100 rounded-full mb-4">
                <p className="text-sm text-gray-600">Etapa {etapa} de 4</p>
              </div>
              
              <h2 className="text-[#093c92] mb-4">
                {competencia.titulo}
              </h2>
              
              <p className="text-gray-600 text-xl mb-8">
                {competencia.descripcion}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <p className="text-gray-700 text-center mb-4">
              En esta etapa trabajaremos:
            </p>
            
            {competencia.puntos.map((punto, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${competencia.color} flex items-center justify-center text-white flex-shrink-0`}>
                  {index + 1}
                </div>
                <p className="text-gray-700">{punto}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={onContinuar}
              className={`w-full h-14 bg-gradient-to-r ${competencia.color} text-white rounded-full text-lg`}
            >
              ¡Comenzar!
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
