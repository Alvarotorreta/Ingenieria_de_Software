import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, Star } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import Confetti from '../../components/Confetti';

export default function TabletResultados() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] flex items-center justify-center p-8">
      <Confetti />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl">
        <Card className="p-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl text-center space-y-8">
          <Trophy className="w-32 h-32 text-[#fbc95c] mx-auto" />
          <h1 className="text-[#093c92]">¡Felicitaciones!</h1>
          <p className="text-gray-600 text-2xl">Excelente presentación</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-100 p-6 rounded-2xl">
              <p className="text-sm text-gray-600 mb-2">Tokens Totales</p>
              <p className="text-4xl text-[#fbc95c]">250</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-2xl">
              <p className="text-sm text-gray-600 mb-2">Puntos</p>
              <p className="text-4xl text-blue-600">485</p>
            </div>
          </div>
          <Button onClick={() => navigate('/tablet/reflexion')} size="lg" className="h-16 px-12 text-xl bg-[#f757ac] text-white rounded-full">
            Continuar a Reflexión
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
