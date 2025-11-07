import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import Timer from '../../components/Timer';

export default function ProfesorEtapa2() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
            <p className="text-white">Etapa 2 de 4</p>
          </div>
          <h1 className="text-white mb-4">
            Creando el Bubble Map
          </h1>
          <p className="text-white/90">
            Los equipos están desarrollando su mapa mental
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <Timer initialMinutes={15} />
        </div>

        <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <div className="text-center mb-8">
            <Brain className="w-16 h-16 text-[#093c92] mx-auto mb-4" />
            <h2 className="text-[#093c92] mb-2">
              Bubble Map en Progreso
            </h2>
            <p className="text-gray-600">
              Los estudiantes están organizando sus ideas visualmente
            </p>
          </div>

          <Button
            onClick={() => navigate('/profesor/bubble-map')}
            className="w-full h-14 bg-gradient-to-r from-[#f757ac] to-pink-600 text-white rounded-full"
          >
            Ver Bubble Maps de los equipos
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
