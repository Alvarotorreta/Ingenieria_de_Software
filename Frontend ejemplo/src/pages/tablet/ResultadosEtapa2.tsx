import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

export default function TabletResultadosEtapa2() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] flex items-center justify-center p-8">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl">
        <Card className="p-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl text-center space-y-8">
          <Trophy className="w-24 h-24 text-[#fbc95c] mx-auto" />
          <h1 className="text-[#093c92]">¡Excelente Trabajo!</h1>
          <p className="text-gray-600 text-2xl">Han completado el Bubble Map con éxito</p>
          <div className="bg-yellow-100 p-6 rounded-2xl">
            <p className="text-3xl text-[#fbc95c]">+50 Tokens</p>
          </div>
          <Button onClick={() => navigate('/tablet/inicio-etapa3')} size="lg" className="h-16 px-12 text-xl bg-[#f757ac] text-white rounded-full">
            Continuar <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
