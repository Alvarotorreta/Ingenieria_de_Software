import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain } from 'lucide-react';
import { Card } from '../../components/ui/card';

export default function TabletReflexion() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] flex items-center justify-center p-8">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl">
        <Card className="p-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl text-center space-y-8">
          <Brain className="w-24 h-24 text-[#093c92] mx-auto" />
          <h1 className="text-[#093c92]">Reflexión Final</h1>
          <p className="text-gray-600 text-2xl">Por favor completen la reflexión desde sus dispositivos móviles</p>
          <div className="bg-blue-50 p-8 rounded-2xl">
            <p className="text-lg text-gray-700">El profesor les indicará cómo acceder a la encuesta de reflexión</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
