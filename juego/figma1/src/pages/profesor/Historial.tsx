import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Users, Trophy, TrendingUp, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Preguntas que responden los estudiantes
const preguntasEvaluacion = [
  "¿Qué tan efectiva fue la comunicación en tu equipo?",
  "¿Qué tan creativa fue la solución propuesta?",
  "¿Cómo calificarías el trabajo en equipo?",
  "¿Qué tan empático fue tu equipo con el problema?",
  "¿Qué tan bien se organizaron las tareas?",
  "¿Qué tan satisfecho estás con el resultado final?"
];

// Mock data de sesiones pasadas
const sesionesHistorial = [
  {
    id: '1',
    fecha: '2025-10-15',
    facultad: 'Ingeniería',
    carrera: 'Ingeniería Civil Informática',
    profesor: 'María González',
    participantes: 16,
    ganador: 'Grupo Rojo',
    duracion: '90 min',
    respuestas: [
      { pregunta: preguntasEvaluacion[0], promedio: 4.2, respuestas: [5, 4, 4, 5, 3, 5, 4, 4, 5, 4, 4, 5, 4, 3, 5, 4] },
      { pregunta: preguntasEvaluacion[1], promedio: 4.5, respuestas: [5, 5, 4, 5, 4, 5, 5, 4, 5, 4, 5, 5, 4, 4, 5, 5] },
      { pregunta: preguntasEvaluacion[2], promedio: 4.7, respuestas: [5, 5, 5, 5, 4, 5, 5, 5, 5, 4, 5, 5, 5, 4, 5, 5] },
      { pregunta: preguntasEvaluacion[3], promedio: 4.1, respuestas: [4, 4, 4, 5, 3, 5, 4, 4, 5, 4, 4, 5, 3, 3, 5, 4] },
      { pregunta: preguntasEvaluacion[4], promedio: 3.9, respuestas: [4, 4, 3, 5, 3, 4, 4, 4, 5, 3, 4, 5, 3, 3, 5, 4] },
      { pregunta: preguntasEvaluacion[5], promedio: 4.3, respuestas: [5, 4, 4, 5, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4] }
    ],
    competencias: [
      { competencia: 'Comunicación', puntaje: 85 },
      { competencia: 'Creatividad', puntaje: 90 },
      { competencia: 'Trabajo en Equipo', puntaje: 94 },
      { competencia: 'Empatía', puntaje: 82 },
      { competencia: 'Organización', puntaje: 78 }
    ],
    resultados: [
      { grupo: 'Rojo', tokens: 850 },
      { grupo: 'Azul', tokens: 720 },
      { grupo: 'Verde', tokens: 680 },
      { grupo: 'Amarillo', tokens: 590 }
    ]
  },
  {
    id: '2',
    fecha: '2025-10-10',
    facultad: 'Diseño',
    carrera: 'Diseño Gráfico',
    profesor: 'Carlos López',
    participantes: 12,
    ganador: 'Grupo Verde',
    duracion: '85 min',
    respuestas: [
      { pregunta: preguntasEvaluacion[0], promedio: 4.0, respuestas: [4, 4, 4, 5, 3, 5, 4, 4, 5, 3, 4, 4] },
      { pregunta: preguntasEvaluacion[1], promedio: 4.8, respuestas: [5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 4] },
      { pregunta: preguntasEvaluacion[2], promedio: 4.4, respuestas: [5, 4, 4, 5, 4, 5, 5, 4, 5, 4, 4, 5] },
      { pregunta: preguntasEvaluacion[3], promedio: 4.6, respuestas: [5, 5, 4, 5, 5, 5, 5, 4, 5, 4, 5, 4] },
      { pregunta: preguntasEvaluacion[4], promedio: 4.2, respuestas: [4, 4, 4, 5, 4, 5, 4, 4, 5, 4, 4, 4] },
      { pregunta: preguntasEvaluacion[5], promedio: 4.5, respuestas: [5, 4, 5, 5, 4, 5, 5, 4, 5, 4, 5, 4] }
    ],
    competencias: [
      { competencia: 'Comunicación', puntaje: 80 },
      { competencia: 'Creatividad', puntaje: 96 },
      { competencia: 'Trabajo en Equipo', puntaje: 88 },
      { competencia: 'Empatía', puntaje: 92 },
      { competencia: 'Organización', puntaje: 84 }
    ],
    resultados: [
      { grupo: 'Verde', tokens: 920 },
      { grupo: 'Rojo', tokens: 780 },
      { grupo: 'Azul', tokens: 650 },
      { grupo: 'Amarillo', tokens: 540 }
    ]
  },
  {
    id: '3',
    fecha: '2025-10-05',
    facultad: 'Negocios',
    carrera: 'Administración de Empresas',
    profesor: 'Ana Martínez',
    participantes: 16,
    ganador: 'Grupo Azul',
    duracion: '95 min',
    respuestas: [
      { pregunta: preguntasEvaluacion[0], promedio: 4.6, respuestas: [5, 5, 4, 5, 5, 5, 4, 5, 5, 4, 5, 5, 4, 4, 5, 5] },
      { pregunta: preguntasEvaluacion[1], promedio: 4.1, respuestas: [4, 4, 4, 5, 3, 5, 4, 4, 5, 4, 4, 5, 4, 3, 5, 4] },
      { pregunta: preguntasEvaluacion[2], promedio: 4.5, respuestas: [5, 4, 5, 5, 4, 5, 5, 4, 5, 4, 5, 5, 4, 4, 5, 5] },
      { pregunta: preguntasEvaluacion[3], promedio: 4.3, respuestas: [5, 4, 4, 5, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4] },
      { pregunta: preguntasEvaluacion[4], promedio: 4.4, respuestas: [5, 4, 4, 5, 4, 5, 5, 4, 5, 4, 5, 5, 4, 4, 5, 4] },
      { pregunta: preguntasEvaluacion[5], promedio: 4.7, respuestas: [5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 5, 5, 4, 4, 5, 5] }
    ],
    competencias: [
      { competencia: 'Comunicación', puntaje: 92 },
      { competencia: 'Creatividad', puntaje: 82 },
      { competencia: 'Trabajo en Equipo', puntaje: 90 },
      { competencia: 'Empatía', puntaje: 86 },
      { competencia: 'Organización', puntaje: 88 }
    ],
    resultados: [
      { grupo: 'Azul', tokens: 880 },
      { grupo: 'Rojo', tokens: 840 },
      { grupo: 'Verde', tokens: 710 },
      { grupo: 'Amarillo', tokens: 670 }
    ]
  }
];

export default function ProfesorHistorial() {
  const navigate = useNavigate();
  const [sesionExpandida, setSesionExpandida] = useState<string | null>(null);

  const toggleSesion = (id: string) => {
    setSesionExpandida(sesionExpandida === id ? null : id);
  };

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

        {/* Sesiones */}
        <div className="space-y-4">
          {sesionesHistorial.map((sesion, index) => {
            const expandida = sesionExpandida === sesion.id;
            
            return (
              <motion.div
                key={sesion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  {/* Header de la sesión */}
                  <div
                    onClick={() => toggleSesion(sesion.id)}
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-[#093c92]" />
                          <span className="text-gray-700">
                            {new Date(sesion.fecha).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>

                        <div className="h-8 w-px bg-gray-300" />

                        <div>
                          <p className="text-sm text-gray-500">Facultad</p>
                          <p className="text-gray-900">{sesion.facultad}</p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Carrera</p>
                          <p className="text-gray-900">{sesion.carrera}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700">{sesion.participantes} estudiantes</span>
                        </div>

                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                          <Trophy className="w-3 h-3 mr-1" />
                          {sesion.ganador}
                        </Badge>
                      </div>

                      <Button variant="ghost" size="icon">
                        {expandida ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Detalles expandidos */}
                  {expandida && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t bg-gray-50"
                    >
                      <div className="p-6 space-y-8">
                        {/* Gráfico de resultados por grupo */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-[#093c92]" />
                            <h3 className="text-[#093c92] text-xl">Tokens por Grupo</h3>
                          </div>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={sesion.resultados}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="grupo" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="tokens" fill="#093c92" radius={[8, 8, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Gráfico de competencias */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-[#f757ac]" />
                            <h3 className="text-[#093c92] text-xl">Desarrollo de Competencias</h3>
                          </div>
                          <ResponsiveContainer width="100%" height={350}>
                            <RadarChart data={sesion.competencias}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="competencia" />
                              <PolarRadiusAxis angle={90} domain={[0, 100]} />
                              <Radar 
                                name="Puntaje" 
                                dataKey="puntaje" 
                                stroke="#f757ac" 
                                fill="#f757ac" 
                                fillOpacity={0.6} 
                              />
                              <Tooltip />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Respuestas de evaluación */}
                        <div>
                          <h3 className="text-[#093c92] text-xl mb-4">Respuestas de Evaluación</h3>
                          <div className="space-y-6">
                            {sesion.respuestas.map((item, idx) => (
                              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-gray-700">{item.pregunta}</p>
                                  <Badge variant="outline" className="text-lg px-4">
                                    {item.promedio.toFixed(1)} / 5.0
                                  </Badge>
                                </div>
                                
                                {/* Distribución de respuestas */}
                                <div className="grid grid-cols-5 gap-2">
                                  {[1, 2, 3, 4, 5].map((valor) => {
                                    const cantidad = item.respuestas.filter(r => r === valor).length;
                                    const porcentaje = (cantidad / item.respuestas.length) * 100;
                                    
                                    return (
                                      <div key={valor} className="text-center">
                                        <div className="h-24 bg-gray-100 rounded-lg relative overflow-hidden">
                                          <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${porcentaje}%` }}
                                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#093c92] to-blue-400"
                                          />
                                          <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-sm font-semibold text-gray-700">
                                              {cantidad}
                                            </span>
                                          </div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{valor} ⭐</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
