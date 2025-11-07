import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mic, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';

export default function TabletCrearPitch() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-[#093c92] mb-4">Creen su Pitch</h1>
          <p className="text-gray-600 text-xl">Organicen sus ideas para la presentación</p>
        </motion.div>

        <Card className="p-8 space-y-6">
          <div>
            <h3 className="text-[#093c92] mb-2">1. El Problema</h3>
            <Textarea placeholder="¿Qué problema resuelven?" className="min-h-[100px]" />
          </div>

          <div>
            <h3 className="text-[#093c92] mb-2">2. La Solución</h3>
            <Textarea placeholder="¿Cuál es su solución?" className="min-h-[100px]" />
          </div>

          <div>
            <h3 className="text-[#093c92] mb-2">3. Beneficios</h3>
            <Textarea placeholder="¿Por qué es valiosa?" className="min-h-[100px]" />
          </div>
        </Card>

        <div className="mt-8">
          <Button onClick={() => navigate('/tablet/realizar-pitch')} className="w-full h-14 bg-[#f757ac] text-white rounded-full">
            Ir a Presentar <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
