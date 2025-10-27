import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../hooks/useAuth';
import { salaApi } from '../../services/api';
import type { Sala } from '../../types/database';
import { formatearFecha, estadoATexto } from '../../utils/helpers';
import { toast } from 'sonner@2.0.3';

export default function ProfesorHistorial() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [sesionExpandida, setSesionExpandida] = useState<number | null>(null);

  // Cargar historial de salas del profesor
  useEffect(() => {
    if (usuario) {
      salaApi.getByProfesor(usuario.id_usuario)
        .then(setSalas)
        .catch(err => {
          toast.error('Error al cargar historial');
          console.error(err);
        })
        .finally(() => setLoading(false));
    }
  }, [usuario]);

  const toggleSesion = (id: number) => {
    setSesionExpandida(sesionExpandida === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-[#093c92] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profesor/home')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-[#093c92]">
              Historial de Juegos
            </h1>
            <p className="text-gray-600 text-lg">
              Revisa los resultados y métricas de sesiones anteriores
            </p>
          </div>
        </div>

        {/* Salas */}
        <div className="space-y-4">
          {salas.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-gray-500 text-lg">No tienes salas creadas aún</p>
              <Button
                onClick={() => navigate('/profesor/crear-sala')}
                className="mt-4 bg-[#093c92] hover:bg-[#093c92]/90"
              >
                Crear Primera Sala
              </Button>
            </Card>
          ) : (
            salas.map((sala, index) => {
              const expandida = sesionExpandida === sala.id_sala;
            
              return (
                <motion.div
                  key={sala.id_sala}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => toggleSesion(sala.id_sala)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="w-5 h-5 text-[#093c92]" />
                          <span className="text-lg text-gray-700">
                            {formatearFecha(sala.fecha_creacion)}
                          </span>
                          <Badge 
                            className={`${
                              sala.estado === 'en_juego' 
                                ? 'bg-green-500/10 text-green-600' 
                                : sala.estado === 'finalizado' 
                                ? 'bg-gray-500/10 text-gray-600'
                                : 'bg-yellow-500/10 text-yellow-600'
                            }`}
                          >
                            {estadoATexto(sala.estado)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 font-mono">
                              Código: {sala.codigo_acceso}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">ID Sala: #{sala.id_sala}</span>
                          </div>
                          <div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profesor/sala/${sala.id_sala}`);
                              }}
                              variant="outline"
                              size="sm"
                              className="text-[#093c92] border-[#093c92]"
                            >
                              Ver Detalle
                            </Button>
                          </div>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: expandida ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {expandida ? (
                          <ChevronUp className="w-6 h-6 text-[#093c92]" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-[#093c92]" />
                        )}
                      </motion.div>
                    </div>

                    {/* Contenido expandido */}
                    {expandida && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 pt-6 border-t border-gray-200"
                      >
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Nota:</strong> Las métricas detalladas y análisis de competencias 
                              estarán disponibles una vez que la sala finalice y se completen las evaluaciones.
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/profesor/sala/${sala.id_sala}`);
                              }}
                              className="bg-[#093c92] hover:bg-[#093c92]/90"
                            >
                              Ir a la Sala
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
