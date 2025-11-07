import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner@2.0.3';
import GroupBadge from '../../components/GroupBadge';
import IntroduccionCompetencia from '../../components/IntroduccionCompetencia';

const grupos = [
  { nombre: 'Grupo Rojo', color: '#ff4757' },
  { nombre: 'Grupo Azul', color: '#3742fa' },
  { nombre: 'Grupo Verde', color: '#2ed573' },
  { nombre: 'Grupo Amarillo', color: '#ffa502' },
];

export default function TabletPersonalizarEquipo() {
  const navigate = useNavigate();
  
  // Simular asignación automática del grupo (igual que en Sala)
  const [grupoAsignado] = useState(() => {
    return grupos[Math.floor(Math.random() * 4)];
  });
  
  const [seConocen, setSeConocen] = useState('');
  const [mostrarIntroduccion, setMostrarIntroduccion] = useState(true);
  const [etapaActual, setEtapaActual] = useState<1 | 2 | 3 | 4>(1);

  const handleContinuar = () => {
    if (!seConocen) {
      toast.error('Por favor indica si los integrantes se conocen');
      return;
    }

    toast.success('¡Personalización completada!');
    // Navegar según si se conocen o no
    if (seConocen === 'no') {
      navigate('/tablet/presentacion-grupo');
    } else {
      // Si se conocen, ir directo al mini-juego
      navigate('/tablet/mini-juego');
    }
  };

  const handleContinuarDespuesIntroduccion = () => {
    // Solo cerrar el popup y mostrar el formulario
    setMostrarIntroduccion(false);
  };

  return (
    <>
      //Por ahora lo voy a quitar
      {/* Popup de introducción a competencia */}
      {/* {mostrarIntroduccion && ( */}
        {/* <IntroduccionCompetencia */}
          {/* etapa={etapaActual} */}
          {/* onContinuar={handleContinuarDespuesIntroduccion} */}
        {/* /> */}
      {/* )} */}

      <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac] flex items-center justify-center p-8 relative overflow-hidden">
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

      {/* Group Badge - Bottom Left */}
      <motion.div
        initial={{ scale: 0, rotate: -180, x: -100 }}
        animate={{ scale: 1, rotate: 0, x: 0 }}
        transition={{ type: 'spring', delay: 0.2 }}
        className="absolute bottom-8 left-8 z-20"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/20">
          <GroupBadge name={grupoAsignado.nombre} color={grupoAsignado.color} size="large" />
        </div>
      </motion.div>

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-white text-5xl drop-shadow-lg">
              Personalización de equipos
            </h1>
          </div>

          {/* Form Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl border-4 border-white/20 p-10"
          >
            <div className="space-y-6">
              {/* ¿Se conocen? */}
              <div className="space-y-4">
                <Label 
                  htmlFor="seConocen" 
                  className="text-white text-3xl"
                >
                  ¿Los integrantes del grupo se conocen?
                </Label>
                <Select value={seConocen} onValueChange={setSeConocen}>
                  <SelectTrigger 
                    id="seConocen"
                    className="h-16 text-xl bg-white/90 border-2 border-white/40 focus:border-white rounded-2xl px-6"
                  >
                    <SelectValue placeholder="Selecciona una opción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="si" className="text-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        <span>Sí, nos conocemos</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="no" className="text-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>No nos conocemos</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Button */}
              <Button
                onClick={handleContinuar}
                disabled={!seConocen}
                className="w-full h-20 text-2xl bg-white/90 hover:bg-white text-[#093c92] rounded-full disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <Check className="w-8 h-8 mr-3" />
                Listo
              </Button>
            </div>
          </motion.div>

          {/* Footer decorative text */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/70 text-center text-lg"
          >
            ✨ Personaliza tu experiencia ✨
          </motion.div>
        </motion.div>
      </div>
    </div>
    </>
  );
}
