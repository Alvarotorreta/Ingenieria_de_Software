import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Check, Wallet, GraduationCap, Smartphone, User, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { useGame } from '../../contexts/GameContext';

const desafios = [
  { 
    id: 1, 
    titulo: 'Educación Financiera Accesible',
    descripcion: 'La ausencia de educación financiera dificulta la planificación y uso responsable del dinero',
    personaje: 'Martina',
    edad: 22,
    contexto: 'Vende productos por redes sociales pero no sabe cómo organizar su dinero',
    icono: '💰',
    color: 'from-green-500 to-emerald-600',
    Icon: Wallet
  },
  { 
    id: 2, 
    titulo: 'Inicio de Vida Laboral',
    descripcion: 'Estudiantes recién titulados enfrentan barreras para conseguir su primer empleo',
    personaje: 'Andrés',
    edad: 23,
    contexto: 'Egresado de odontología, no puede trabajar porque le exigen experiencia previa',
    icono: '🎓',
    color: 'from-blue-500 to-indigo-600',
    Icon: GraduationCap
  },
  { 
    id: 3, 
    titulo: 'Tecnología para Adultos Mayores',
    descripcion: 'El avance tecnológico ha dejado a los adultos mayores con dificultades de adaptación',
    personaje: 'Osvaldo',
    edad: 70,
    contexto: 'Debe pedir ayuda a sus hijos o nietos cada vez que necesita hacer trámites digitales',
    icono: '📱',
    color: 'from-purple-500 to-pink-600',
    Icon: Smartphone
  },
];

export default function TabletEleccionTematica() {
  const navigate = useNavigate();
  const { updateSession } = useGame();
  const [seleccionado, setSeleccionado] = useState<number | null>(null);

  const handleContinuar = () => {
    if (seleccionado) {
      updateSession({ desafioSeleccionado: seleccionado });
      navigate('/tablet/video-desafio');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac] p-8 relative overflow-hidden">
      {/* Animated decorations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 right-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-20 left-20 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-white mb-4 drop-shadow-lg">
            Elige tu Desafío
          </h1>
          <p className="text-white/90 text-2xl">
            ¿Qué problema quieren resolver como emprendedores?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {desafios.map((desafio, index) => {
            const isSelected = seleccionado === desafio.id;
            
            return (
              <motion.div
                key={desafio.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                onClick={() => setSeleccionado(desafio.id)}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className={`h-full cursor-pointer border-4 transition-all duration-300 overflow-hidden ${
                  isSelected
                    ? 'border-yellow-400 shadow-2xl shadow-yellow-400/50 bg-white'
                    : 'border-white/30 hover:border-white/60 bg-white/95 backdrop-blur-sm'
                }`}>
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-r ${desafio.color} p-6 text-white relative`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-6xl">{desafio.icono}</div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring' }}
                        >
                          <div className="bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <h3 className="text-white text-xl mb-2">
                      {desafio.titulo}
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* Descripción del problema */}
                    <div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {desafio.descripcion}
                      </p>
                    </div>

                    {/* Personaje afectado */}
                    <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${desafio.color} flex items-center justify-center`}>
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[#093c92]">
                            {desafio.personaje}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {desafio.edad} años
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm italic">
                        "{desafio.contexto}"
                      </p>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      className="bg-yellow-400 px-6 py-3"
                    >
                      <p className="text-center text-white flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Desafío seleccionado
                      </p>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Botón continuar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleContinuar}
            disabled={!seleccionado}
            size="lg"
            className={`h-20 px-16 text-2xl rounded-full transition-all duration-300 ${
              seleccionado 
                ? 'bg-yellow-400 hover:bg-yellow-500 text-[#093c92] shadow-2xl shadow-yellow-400/50' 
                : 'bg-gray-400 text-gray-200'
            }`}
          >
            Continuar al Desafío
            <ArrowRight className="w-6 h-6 ml-3" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
