import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import GroupBadge from '../../components/GroupBadge';

const equipos = [
  { nombre: 'Equipo Rojo', color: '#ff4757' },
  { nombre: 'Equipo Azul', color: '#3742fa' },
  { nombre: 'Equipo Verde', color: '#2ed573' },
  { nombre: 'Equipo Amarillo', color: '#ffa502' },
  { nombre: 'Equipo Morado', color: '#5f27cd' },
  { nombre: 'Equipo Rosa', color: '#ee5a6f' },
];

export default function ProfesorEtapa3Resultados() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-[#093c92] mb-4">
            Prototipos LEGO
          </h1>
          <p className="text-gray-600">
            Revisa las soluciones creadas por cada equipo
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {equipos.map((equipo, index) => (
            <motion.div
              key={equipo.nombre}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 border-0 shadow-lg">
                <div className="mb-4">
                  <GroupBadge name={equipo.nombre} color={equipo.color} />
                </div>
                
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-gray-400">Prototipo LEGO</span>
                </div>
                
                <p className="text-sm text-gray-600">
                  Prototipo físico de la solución propuesta
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/profesor/etapa4-preparar')}
            size="lg"
            className="h-14 px-12 bg-gradient-to-r from-[#f757ac] to-pink-600 text-white rounded-full"
          >
            Continuar a Etapa 4
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
