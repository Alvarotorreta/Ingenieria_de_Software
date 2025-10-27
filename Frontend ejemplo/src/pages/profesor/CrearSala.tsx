import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner@2.0.3';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../hooks/useAuth';
import { facultadApi, salaApi, equipoApi, temaApi, desafioApi } from '../../services/api';
import type { Facultad, Carrera } from '../../types/database';
import { COLORES_EQUIPOS, NOMBRES_EQUIPOS } from '../../constants';

export default function ProfesorCrearSala() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { createSessionFromAPI } = useGame();
  
  const [facultades, setFacultades] = useState<Facultad[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [selectedFacultad, setSelectedFacultad] = useState<number | null>(null);
  const [selectedCarrera, setSelectedCarrera] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar facultades al montar
  useEffect(() => {
    facultadApi.getAll()
      .then(setFacultades)
      .catch(err => toast.error('Error al cargar facultades'));
  }, []);

  // Cargar carreras cuando cambia la facultad
  useEffect(() => {
    if (selectedFacultad) {
      facultadApi.getCarreras(selectedFacultad)
        .then(setCarreras)
        .catch(err => toast.error('Error al cargar carreras'));
    }
  }, [selectedFacultad]);

  const handleCreateSala = async () => {
    if (!usuario || !selectedCarrera || !selectedFacultad) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      // 1. Crear la sala
      const sala = await salaApi.create({
        id_usuario: usuario.id_usuario,
        id_carrera: selectedCarrera
      });

      toast.success(`Sala creada. Código: ${sala.codigo_acceso}`);

      // 2. Obtener un tema/desafío para la sala
      const temas = await temaApi.getByFacultad(selectedFacultad);
      const desafios = temas.length > 0 
        ? await desafioApi.getByTema(temas[0].id_tema)
        : [];
      
      const desafioId = desafios.length > 0 ? desafios[0].id_desafio : 1;

      // 3. Crear los 4 equipos
      const colores = Object.values(COLORES_EQUIPOS);
      
      for (let i = 0; i < 4; i++) {
        await equipoApi.create({
          nombre_equipo: NOMBRES_EQUIPOS[i],
          modalidad: false, // Presencial
          id_sala: sala.id_sala,
          id_desafio: desafioId,
          color: colores[i]
        });
      }

      // 4. Cargar la sala completa con equipos
      const salaCompleta = await salaApi.getById(sala.id_sala);

      // 5. Crear sesión en el contexto
      await createSessionFromAPI(salaCompleta);

      // 6. Navegar a la sala
      navigate(`/profesor/sala/${sala.id_sala}`);

    } catch (error: any) {
      toast.error(error.message || 'Error al crear sala');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-12 bg-white rounded-3xl shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-6"
              >
                <Sparkles className="w-16 h-16 text-[#fbc95c]" />
              </motion.div>
              
              <h1 className="text-[#093c92] mb-4">
                Crear Nueva Sala
              </h1>
              <p className="text-gray-600 text-lg">
                Configura la información de tu sesión de juego
              </p>
            </div>

            <div className="space-y-6">
              {/* Facultad */}
              <div>
                <Label htmlFor="facultad" className="text-gray-700">
                  Facultad
                </Label>
                <Select 
                  value={selectedFacultad?.toString() || ''} 
                  onValueChange={(value) => {
                    setSelectedFacultad(Number(value));
                    setSelectedCarrera(null); // Reset carrera cuando cambia facultad
                  }}
                >
                  <SelectTrigger className="h-14 text-lg border-2 rounded-xl mt-2">
                    <SelectValue placeholder="Selecciona una facultad" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultades.map((fac) => (
                      <SelectItem key={fac.id_facultad} value={fac.id_facultad.toString()} className="text-lg">
                        {fac.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Carrera */}
              <div>
                <Label htmlFor="carrera" className="text-gray-700">
                  Carrera
                </Label>
                <Select 
                  value={selectedCarrera?.toString() || ''} 
                  onValueChange={(value) => setSelectedCarrera(Number(value))}
                  disabled={!selectedFacultad}
                >
                  <SelectTrigger className="h-14 text-lg border-2 rounded-xl mt-2">
                    <SelectValue placeholder={selectedFacultad ? "Selecciona una carrera" : "Primero selecciona una facultad"} />
                  </SelectTrigger>
                  <SelectContent>
                    {carreras.map((car) => (
                      <SelectItem key={car.id_carrera} value={car.id_carrera.toString()} className="text-lg">
                        {car.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  💡 <strong>Importante:</strong> Las temáticas del juego se adaptarán según la facultad seleccionada.
                </p>
              </div>

              {/* Botón crear */}
              <Button
                onClick={handleCreateSala}
                disabled={!selectedFacultad || !selectedCarrera || loading}
                className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white rounded-full text-xl disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Creando sala...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-3" />
                    Crear Sala
                    <Sparkles className="w-5 h-5 ml-3" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
