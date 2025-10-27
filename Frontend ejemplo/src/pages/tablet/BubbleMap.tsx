import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card } from '../../components/ui/card';

export default function TabletBubbleMap() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<string[]>(['Idea central']);
  const [nuevaIdea, setNuevaIdea] = useState('');

  const agregarIdea = () => {
    if (nuevaIdea.trim()) {
      setIdeas([...ideas, nuevaIdea]);
      setNuevaIdea('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-[#093c92] mb-4">Bubble Map</h1>
          <p className="text-gray-600 text-xl">Organicen sus ideas visualmente</p>
        </motion.div>

        <Card className="p-8 mb-8">
          <div className="flex flex-wrap gap-4 justify-center min-h-[400px] items-center">
            {ideas.map((idea, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`${index === 0 ? 'bg-[#f757ac]' : 'bg-blue-500'} text-white rounded-full p-8 ${
                  index === 0 ? 'w-48 h-48 text-2xl' : 'w-32 h-32'
                } flex items-center justify-center text-center shadow-lg`}
              >
                {idea}
              </motion.div>
            ))}
          </div>
        </Card>

        <div className="flex gap-4 mb-8">
          <Input
            value={nuevaIdea}
            onChange={(e) => setNuevaIdea(e.target.value)}
            placeholder="Nueva idea..."
            className="h-14 text-lg"
            onKeyPress={(e) => e.key === 'Enter' && agregarIdea()}
          />
          <Button onClick={agregarIdea} size="lg" className="bg-blue-500">
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        <Button onClick={() => navigate('/tablet/resultados-etapa2')} className="w-full h-14 bg-[#f757ac] text-white rounded-full">
          Finalizar Bubble Map <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
