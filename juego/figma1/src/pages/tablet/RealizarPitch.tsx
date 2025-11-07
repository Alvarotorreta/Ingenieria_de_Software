import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mic } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import Timer from '../../components/Timer';

export default function TabletRealizarPitch() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] flex items-center justify-center p-8">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl">
        <Card className="p-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl text-center space-y-8">
          <Mic className="w-32 h-32 text-[#f757ac] mx-auto" />
          <h1 className="text-[#093c92]">¡Es su turno!</h1>
          <p className="text-gray-600 text-2xl">Presenten su pitch al curso</p>
          <Timer initialMinutes={3} />
          <Button onClick={() => navigate('/tablet/resultados')} size="lg" className="h-16 px-12 text-xl bg-[#f757ac] text-white rounded-full">
            Finalizar Presentación
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
