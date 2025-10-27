import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Send } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';

const criterios = [
  { id: 1, titulo: 'Creatividad', descripcion: 'La idea es original e innovadora' },
  { id: 2, titulo: 'Viabilidad', descripcion: 'La solución es práctica y realizable' },
  { id: 3, titulo: 'Presentación', descripcion: 'El pitch fue claro y convincente' },
  { id: 4, titulo: 'Impacto', descripcion: 'La solución resuelve un problema real' },
];

export default function EstudianteEvaluar() {
  const navigate = useNavigate();
  const [evaluaciones, setEvaluaciones] = useState<{[key: number]: number}>({});
  const [comentarios, setComentarios] = useState('');

  const handleStarClick = (criterioId: number, rating: number) => {
    setEvaluaciones({ ...evaluaciones, [criterioId]: rating });
  };

  const handleSubmit = () => {
    navigate('/estudiante/gracias');
  };

  const isComplete = criterios.every(c => evaluaciones[c.id] > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-[#093c92] text-3xl mb-2">
            Evalúa a tu Equipo
          </h1>
          <p className="text-gray-600">
            Califica cada criterio del 1 al 5
          </p>
        </motion.div>

        <div className="space-y-6 mb-8">
          {criterios.map((criterio, index) => (
            <motion.div
              key={criterio.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 border-2">
                <div className="mb-4">
                  <h3 className="text-[#093c92] mb-1">
                    {criterio.titulo}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {criterio.descripcion}
                  </p>
                </div>

                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <motion.button
                      key={rating}
                      onClick={() => handleStarClick(criterio.id, rating)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          (evaluaciones[criterio.id] || 0) >= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-6 border-2 mb-8">
          <Label htmlFor="comentarios" className="text-[#093c92] mb-2 block">
            Comentarios (Opcional)
          </Label>
          <Textarea
            id="comentarios"
            value={comentarios}
            onChange={(e) => setComentarios(e.target.value)}
            placeholder="Comparte tus comentarios sobre el equipo..."
            className="min-h-[120px]"
          />
        </Card>

        <Button
          onClick={handleSubmit}
          disabled={!isComplete}
          className="w-full h-14 bg-gradient-to-r from-[#f757ac] to-pink-600 text-white rounded-full text-lg disabled:opacity-50"
        >
          <Send className="w-5 h-5 mr-2" />
          Enviar Evaluación
        </Button>
      </div>
    </div>
  );
}
