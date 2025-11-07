import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Boxes, Camera } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import Timer from '../../components/Timer';

export default function TabletEtapa3Lego() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-[#093c92] mb-4">Construyendo el Prototipo</h1>
          <p className="text-gray-600 text-xl">Usen los LEGO para crear su solución</p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <Timer initialMinutes={20} />
        </div>

        <Card className="p-12 mb-8">
          <div className="text-center space-y-6">
            <Boxes className="w-32 h-32 text-[#093c92] mx-auto" />
            <p className="text-gray-600 text-lg">Trabajen en equipo para construir su prototipo físico</p>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" size="lg" className="h-14 rounded-full">
            <Camera className="w-5 h-5 mr-2" />
            Tomar Foto
          </Button>
          <Button onClick={() => navigate('/tablet/resultados-etapa3')} size="lg" className="h-14 bg-[#f757ac] text-white rounded-full">
            Terminar
          </Button>
        </div>
      </div>
    </div>
  );
}
