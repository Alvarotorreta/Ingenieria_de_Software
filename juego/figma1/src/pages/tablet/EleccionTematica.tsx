import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

const tematicas = [
  { id: 1, nombre: 'Tecnología y Salud', icono: '🏥' },
  { id: 2, nombre: 'Educación Digital', icono: '📚' },
  { id: 3, nombre: 'Sostenibilidad', icono: '🌱' },
  { id: 4, nombre: 'Movilidad Urbana', icono: '🚗' },
  { id: 5, nombre: 'Alimentación Saludable', icono: '🥗' },
  { id: 6, nombre: 'Entretenimiento', icono: '🎮' },
];

export default function TabletEleccionTematica() {
  const navigate = useNavigate();
  const [seleccionada, setSeleccionada] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-[#093c92] mb-4">
            Elige tu Temática
          </h1>
          <p className="text-gray-600 text-xl">
            ¿Sobre qué quieren emprender?
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {tematicas.map((tematica, index) => (
            <motion.div
              key={tematica.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSeleccionada(tematica.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className={`p-8 cursor-pointer text-center border-4 transition-all ${
                seleccionada === tematica.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-transparent hover:border-gray-300'
              }`}>
                <div className="text-7xl mb-4">{tematica.icono}</div>
                <h3 className="text-[#093c92]">{tematica.nombre}</h3>
                {seleccionada === tematica.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-4"
                  >
                    <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/tablet/desafio')}
            disabled={!seleccionada}
            size="lg"
            className="h-16 px-12 text-xl bg-[#f757ac] text-white rounded-full disabled:opacity-50"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
