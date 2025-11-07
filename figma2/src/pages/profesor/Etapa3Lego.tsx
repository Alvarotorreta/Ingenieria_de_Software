import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Boxes, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import Timer from '../../components/Timer';
import IntroduccionCompetencia from '../../components/IntroduccionCompetencia';

export default function ProfesorEtapa3Lego() {
  const navigate = useNavigate();
  const [mostrarIntro, setMostrarIntro] = useState(true);

  const handleContinuarIntro = () => {
    setMostrarIntro(false);
  };

  // Si mostrar intro, solo mostrar intro
  if (mostrarIntro) {
    return <IntroduccionCompetencia etapa={3} onContinuar={handleContinuarIntro} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
            <p className="text-white">Etapa 3 de 4</p>
          </div>
          <h1 className="text-white mb-4">
            Construyendo con LEGO
          </h1>
          <p className="text-white/90">
            Los equipos están materializando su solución
          </p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <Timer initialMinutes={20} />
        </div>

        <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <div className="text-center mb-8">
            <Boxes className="w-16 h-16 text-[#093c92] mx-auto mb-4" />
            <h2 className="text-[#093c92] mb-2">
              Construcción en Progreso
            </h2>
            <p className="text-gray-600">
              Los estudiantes están creando prototipos físicos con LEGO
            </p>
          </div>

          <Button
            onClick={() => navigate('/profesor/etapa3-resultados')}
            className="w-full h-14 bg-gradient-to-r from-[#f757ac] to-pink-600 text-white rounded-full"
          >
            Ver prototipos terminados
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    </div>
  );
}
