import { motion } from 'motion/react';
import { CheckCircle, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/card';
import Confetti from '../../components/Confetti';

export default function EstudianteGracias() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] flex items-center justify-center p-6">
      <Confetti />
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              <CheckCircle className="w-32 h-32 text-green-500 mx-auto" />
            </motion.div>

            <div>
              <h1 className="text-[#093c92] text-4xl mb-4">
                ¡Gracias por Participar!
              </h1>
              <p className="text-gray-600 text-xl">
                Tu evaluación ha sido registrada exitosamente
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-3xl">
              <Sparkles className="w-12 h-12 text-[#fbc95c] mx-auto mb-4" />
              <p className="text-lg text-gray-700">
                Tu opinión es muy valiosa para mejorar el trabajo en equipo
              </p>
            </div>

            <div className="pt-4">
              <p className="text-gray-500">
                Puedes cerrar esta ventana
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
