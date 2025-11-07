import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mic, Clock, Sparkles, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Timer from '../../components/Timer';

export default function TabletRealizarPitch() {
  const navigate = useNavigate();
  // Mock data - en producción vendría del GameContext
  const [esTuTurno, setEsTuTurno] = useState(false);
  const [timerActivo, setTimerActivo] = useState(false);
  const [equipoActual, setEquipoActual] = useState('Grupo Verde');
  const [tuGrupo] = useState('Grupo Verde');
  const [posicionEnFila, setPosicionEnFila] = useState(1);

  // Para reiniciar el Timer
  const [timerKey, setTimerKey] = useState(0);

  // Simular que es tu turno después de 3 segundos (para demo)
  useEffect(() => {
    const timer = setTimeout(() => {
      setEsTuTurno(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Vista cuando NO es tu turno
  if (!esTuTurno) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 flex items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="w-full max-w-4xl"
        >
          <Card className="p-12 bg-white border-4 border-gray-300 shadow-2xl text-center space-y-8">
            <div className="relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Users className="w-32 h-32 text-gray-400 mx-auto" />
              </motion.div>
            </div>
            
            <div>
              <Badge variant="outline" className="text-lg px-6 py-2 mb-4">
                Presentando: {equipoActual}
              </Badge>
              <h1 className="text-[#093c92] mb-4">Esperando su turno...</h1>
              <p className="text-gray-600 text-2xl mb-2">
                Otro equipo está presentando
              </p>
              <p className="text-gray-500 text-lg">
                Ustedes son el {posicionEnFila}° equipo en presentar
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Tiempo para repasar</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Preparen su energía</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <Mic className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Practiquen su pitch</p>
              </div>
            </div>

            <div className="p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <p className="text-yellow-800">
                💡 <strong>Consejo:</strong> Respiren profundo y recuerden sus puntos clave
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Vista cuando ES tu turno pero el timer NO ha iniciado
  if (!timerActivo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-100 flex items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="w-full max-w-4xl"
        >
          <Card className="p-12 bg-white border-4 border-orange-400 shadow-2xl text-center space-y-8">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1
              }}
            >
              <Mic className="w-32 h-32 text-orange-500 mx-auto" />
            </motion.div>
            
            <div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Badge className="text-lg px-6 py-3 mb-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  ¡ES SU TURNO!
                </Badge>
              </motion.div>
              <h1 className="text-[#093c92] mb-4">Prepárense para presentar</h1>
              <p className="text-gray-600 text-2xl">
                El profesor iniciará el timer cuando estén listos
              </p>
            </div>

            <div className="p-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-200">
              <Clock className="w-16 h-16 text-orange-600 mx-auto mb-4" />
              <p className="text-gray-700 text-lg">
                Tómense un momento para organizarse y ubicarse al frente de la sala
              </p>

              {/* Botón de inicio manual */}
              <Button
                className="mt-6 bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => {
                  setTimerActivo(true);
                  setTimerKey(prev => prev + 1); // reinicia el Timer
                }}
              >
                Prueba de inicio manual
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-left">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">1. Problema</p>
                <p className="text-gray-800">¿Qué resuelven?</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">2. Solución</p>
                <p className="text-gray-800">¿Cómo lo resuelven?</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">3. Impacto</p>
                <p className="text-gray-800">¿A quién ayudan?</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Vista cuando ES tu turno y el timer ESTÁ ACTIVO
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] flex items-center justify-center p-8">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="w-full max-w-4xl"
      >
        <Card className="p-12 bg-white/95 backdrop-blur-sm border-0 shadow-2xl text-center space-y-8">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Mic className="w-32 h-32 text-[#f757ac] mx-auto" />
          </motion.div>
          
          <div>
            <Badge className="text-lg px-6 py-3 mb-4 bg-gradient-to-r from-[#f757ac] to-pink-600 text-white">
              PRESENTANDO AHORA
            </Badge>
            <h1 className="text-[#093c92] mb-4">¡Es su turno!</h1>
            <p className="text-gray-600 text-2xl">Presenten su pitch al curso</p>
          </div>
          
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
            <Timer key={timerKey} initialMinutes={1.5} />
          </div>

          <div className="grid grid-cols-3 gap-4 text-left">
            <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
              <p className="text-xs text-gray-600 mb-1">✓ Recuerden</p>
              <p className="text-sm text-gray-800">Hablar claro</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <p className="text-xs text-gray-600 mb-1">✓ Recuerden</p>
              <p className="text-sm text-gray-800">Mostrar entusiasmo</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
              <p className="text-xs text-gray-600 mb-1">✓ Recuerden</p>
              <p className="text-sm text-gray-800">Ser concisos</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
