import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Trophy } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

const palabras = [
  { original: 'EMPRENDEDOR', anagrama: 'DERDOPREME', pista: 'Persona que inicia un negocio' },
  { original: 'INNOVACION', anagrama: 'NOIVACION', pista: 'Crear algo nuevo' },
  { original: 'CREATIVIDAD', anagrama: 'DIVADTAERIC', pista: 'Capacidad de crear' },
];

export default function TabletMiniJuego() {
  const navigate = useNavigate();
  const [palabraActual, setPalabraActual] = useState(0);
  const [respuesta, setRespuesta] = useState('');
  const [correctas, setCorrectas] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(300); // 5 minutos

  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoRestante(prev => {
        if (prev <= 1) {
          navigate('/tablet/eleccion-tematica');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSubmit = () => {
    if (respuesta.toUpperCase() === palabras[palabraActual].original) {
      setCorrectas(prev => prev + 1);
      
      if (palabraActual < palabras.length - 1) {
        setPalabraActual(prev => prev + 1);
        setRespuesta('');
      } else {
        setTimeout(() => navigate('/tablet/eleccion-tematica'), 1000);
      }
    }
  };

  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] flex items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl"
      >
        <Card className="p-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <div className="text-center space-y-8">
            <div className="flex justify-between items-center">
              <div className="text-xl text-[#093c92]">
                Palabra {palabraActual + 1} de {palabras.length}
              </div>
              <div className="text-2xl text-[#f757ac]">
                ⏱️ {minutos}:{segundos.toString().padStart(2, '0')}
              </div>
            </div>

            <div>
              <h1 className="text-[#093c92] mb-4">
                Anagrama de Emprendimiento
              </h1>
              <p className="text-gray-600 text-xl">
                ¡Ordena las letras para formar la palabra!
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8">
              <p className="text-6xl tracking-widest mb-4 text-[#093c92]">
                {palabras[palabraActual].anagrama}
              </p>
              <p className="text-gray-600 text-lg">
                💡 Pista: {palabras[palabraActual].pista}
              </p>
            </div>

            <Input
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value.toUpperCase())}
              placeholder="Tu respuesta..."
              className="h-20 text-center text-3xl tracking-widest border-4 border-[#093c92]/20 focus:border-[#f757ac] rounded-2xl"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />

            <div className="flex items-center justify-center gap-4">
              <div className="bg-green-100 px-6 py-3 rounded-full">
                <Trophy className="w-6 h-6 text-green-600 inline mr-2" />
                <span className="text-green-700">Correctas: {correctas}</span>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!respuesta}
              className="w-full h-16 text-xl bg-gradient-to-r from-[#f757ac] to-pink-600 text-white rounded-full disabled:opacity-50"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Verificar Respuesta
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
