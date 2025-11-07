import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Tablet, Users } from 'lucide-react';
import GroupBadge from '../../components/GroupBadge';

const grupos = [
  { nombre: 'Grupo Rojo', color: '#ff4757' },
  { nombre: 'Grupo Azul', color: '#3742fa' },
  { nombre: 'Grupo Verde', color: '#2ed573' },
  { nombre: 'Grupo Amarillo', color: '#ffa502' },
];

export default function TabletSala() {
  const navigate = useNavigate();
  // Simular asignación automática por orden de llegada (en producción vendría del backend)
  const [grupoAsignado] = useState(() => {
    // Simular: obtener número aleatorio entre 0-3 para demo
    return grupos[Math.floor(Math.random() * 4)];
  });

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${grupoAsignado.color}dd 0%, ${grupoAsignado.color}55 100%)`
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl"
          style={{ backgroundColor: grupoAsignado.color }}
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-3xl"
          style={{ backgroundColor: grupoAsignado.color }}
        />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 text-center space-y-12 max-w-4xl"
      >
        {/* Grupo Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
          className="flex justify-center"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-4 border-white/50">
            <GroupBadge name={grupoAsignado.nombre} color={grupoAsignado.color} size="large" />
          </div>
        </motion.div>

        {/* Main message */}
        <div className="bg-white/15 backdrop-blur-md rounded-3xl p-12 border-4 border-white/30 space-y-6">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Tablet className="w-24 h-24 text-white mx-auto drop-shadow-2xl" />
          </motion.div>

          <h1 className="text-white text-6xl drop-shadow-lg">
            ¡Conectado!
          </h1>
          
          <p className="text-white/90 text-3xl">
            Has sido asignado automáticamente
          </p>

          <div className="pt-6">
            <div className="inline-flex items-center gap-3 bg-white/20 px-8 py-4 rounded-full border-2 border-white/40">
              <Users className="w-6 h-6 text-white" />
              <span className="text-white text-xl">Esperando que el profesor inicie el juego...</span>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/70 text-xl"
        >
          ✨ Prepárense para una experiencia increíble ✨
        </motion.div>

        {/* Botón temporal para demo */}
        <motion.button
          onClick={() => navigate('/tablet/introduccion')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-4 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/40 text-white text-lg hover:bg-white/30 transition-all"
        >
          [Demo: Iniciar Juego]
        </motion.button>
      </motion.div>
    </div>
  );
}
