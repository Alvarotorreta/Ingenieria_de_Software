import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Copy, Check, Tablet, Play, QrCode, Sparkles, Shuffle, Users, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { toast } from 'sonner@2.0.3';
import { useGame } from '../../contexts/GameContext';
import GroupBadge from '../../components/GroupBadge';

// Estudiantes de prueba
const estudiantesMock = [
  { id: '1', nombre: 'Ana García', email: 'ana@udd.cl' },
  { id: '2', nombre: 'Carlos López', email: 'carlos@udd.cl' },
  { id: '3', nombre: 'María Silva', email: 'maria@udd.cl' },
  { id: '4', nombre: 'José Rodríguez', email: 'jose@udd.cl' },
  { id: '5', nombre: 'Laura Martínez', email: 'laura@udd.cl' },
  { id: '6', nombre: 'Pedro González', email: 'pedro@udd.cl' },
  { id: '7', nombre: 'Sofía Fernández', email: 'sofia@udd.cl' },
  { id: '8', nombre: 'Diego Pérez', email: 'diego@udd.cl' },
  { id: '9', nombre: 'Valentina Torres', email: 'valentina@udd.cl' },
  { id: '10', nombre: 'Mateo Ramírez', email: 'mateo@udd.cl' },
  { id: '11', nombre: 'Isabella Castro', email: 'isabella@udd.cl' },
  { id: '12', nombre: 'Sebastián Morales', email: 'sebastian@udd.cl' },
  { id: '13', nombre: 'Camila Rojas', email: 'camila@udd.cl' },
  { id: '14', nombre: 'Lucas Vargas', email: 'lucas@udd.cl' },
  { id: '15', nombre: 'Emma Ortiz', email: 'emma@udd.cl' },
  { id: '16', nombre: 'Martín Herrera', email: 'martin@udd.cl' },
];

export default function ProfesorSala() {
  const { salaId } = useParams();
  const navigate = useNavigate();
  const { session, updateSession, aleatorizar, asignarEstudiante } = useGame();
  const [copied, setCopied] = useState(false);
  const [tabletsConectadas, setTabletsConectadas] = useState(0);
  const [estudianteDrag, setEstudianteDrag] = useState<{ id: string; grupoIndex: number } | null>(null);

  const codigoSala = session?.codigo || salaId || '123456';
  const tabletsRequeridas = 4;

  // Simular tablets conectándose
  useEffect(() => {
    const interval = setInterval(() => {
      setTabletsConectadas(prev => {
        if (prev < tabletsRequeridas) {
          return prev + 1;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Inicializar grupos con estudiantes si no existen
  useEffect(() => {
    if (session && session.grupos.every(g => g.estudiantes.length === 0)) {
      // Distribuir estudiantes aleatoriamente
      const shuffled = [...estudiantesMock].sort(() => Math.random() - 0.5);
      const grupoSize = Math.ceil(shuffled.length / 4);
      
      const gruposConEstudiantes = session.grupos.map((g, index) => ({
        ...g,
        estudiantes: shuffled.slice(index * grupoSize, (index + 1) * grupoSize)
      }));

      updateSession({ grupos: gruposConEstudiantes });
    }
  }, [session]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codigoSala);
    setCopied(true);
    toast.success('Código copiado');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAleatorizar = () => {
    aleatorizar();
  };

  const handleDragStart = (estudianteId: string, grupoIndex: number) => {
    setEstudianteDrag({ id: estudianteId, grupoIndex });
  };

  const handleDrop = (grupoDestinoIndex: number) => {
    if (estudianteDrag && estudianteDrag.grupoIndex !== grupoDestinoIndex) {
      const estudiante = session?.grupos[estudianteDrag.grupoIndex].estudiantes.find(
        e => e.id === estudianteDrag.id
      );
      
      if (estudiante && session) {
        // Remover del grupo origen
        const gruposActualizados = session.grupos.map((g, index) => {
          if (index === estudianteDrag.grupoIndex) {
            return { ...g, estudiantes: g.estudiantes.filter(e => e.id !== estudianteDrag.id) };
          }
          if (index === grupoDestinoIndex) {
            return { ...g, estudiantes: [...g.estudiantes, estudiante] };
          }
          return g;
        });

        updateSession({ grupos: gruposActualizados });
        toast.success(`${estudiante.nombre} movido a ${session.grupos[grupoDestinoIndex].nombre}`);
      }
    }
    setEstudianteDrag(null);
  };

  const handleStartGame = () => {
    if (tabletsConectadas < tabletsRequeridas) {
      toast.error('Se necesitan las 4 tablets conectadas para comenzar');
      return;
    }
    navigate('/profesor/etapa1');
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-[#093c92] mb-2">
            Sala Creada
          </h1>
          <p className="text-gray-600 text-lg">
            {session.facultad} - {session.carrera}
          </p>
        </motion.div>

        {/* Código de sala */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-[#093c92]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">
                Comparte este código con las tablets
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-white px-8 py-4 rounded-xl shadow-lg">
                  <p className="text-5xl tracking-wider text-[#093c92] select-all">
                    {codigoSala}
                  </p>
                </div>
                
                <Button
                  onClick={handleCopyCode}
                  size="lg"
                  className="rounded-full bg-[#f757ac] hover:bg-[#f757ac]/90"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            <Button variant="outline" className="rounded-full">
              <QrCode className="w-4 h-4 mr-2" />
              Mostrar QR
            </Button>
          </div>

          {/* Tablets status */}
          <div className="mt-6 pt-6 border-t-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Tablet className="w-6 h-6 text-purple-600" />
                <span className="text-lg">
                  <strong>{tabletsConectadas} / {tabletsRequeridas}</strong> Tablets Conectadas
                </span>
              </div>
              <div className="h-3 flex-1 max-w-md mx-8 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(tabletsConectadas / tabletsRequeridas) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Acción de reorganizar */}
        <div className="flex justify-center">
          <Button
            onClick={handleAleatorizar}
            size="lg"
            variant="outline"
            className="rounded-full border-2"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Reorganizar Aleatoriamente
          </Button>
        </div>

        {/* Grupos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {session.grupos.map((grupo, grupoIndex) => {
            const tabletConectada = grupoIndex < tabletsConectadas;
            
            return (
              <motion.div
                key={grupoIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: grupoIndex * 0.1 }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(grupoIndex)}
              >
                <Card 
                  className="p-6 border-4 h-full"
                  style={{ borderColor: grupo.color }}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <GroupBadge name={grupo.nombre} color={grupo.color} size="medium" />
                      
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-md ${
                        tabletConectada ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <Tablet className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* Estudiantes */}
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {grupo.estudiantes.map((estudiante) => (
                        <motion.div
                          key={estudiante.id}
                          draggable
                          onDragStart={() => handleDragStart(estudiante.id, grupoIndex)}
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-white rounded-lg shadow-sm border-2 cursor-move hover:shadow-md transition-all"
                          style={{ borderColor: `${grupo.color}40` }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                              style={{ backgroundColor: grupo.color }}
                            >
                              {estudiante.nombre.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{estudiante.nombre}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {grupo.estudiantes.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Sin estudiantes</p>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-500 text-center pt-2 border-t">
                      {grupo.estudiantes.length} estudiantes
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Botón iniciar */}
        <div className="pt-6">
          <Button
            onClick={handleStartGame}
            disabled={tabletsConectadas < tabletsRequeridas}
            className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white rounded-full text-xl disabled:opacity-50"
          >
            {tabletsConectadas < tabletsRequeridas ? (
              <>Esperando {tabletsRequeridas - tabletsConectadas} tablet{tabletsRequeridas - tabletsConectadas > 1 ? 's' : ''} más...</>
            ) : (
              <>
                <Play className="w-6 h-6 mr-2" />
                ¡Comenzar Juego!
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          {tabletsConectadas >= tabletsRequeridas && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-green-600 mt-4 text-lg"
            >
              ✓ ¡Todas las tablets conectadas! Listo para comenzar
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
