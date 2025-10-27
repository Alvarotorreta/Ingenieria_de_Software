import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lightbulb, Factory, Heart, Leaf, ArrowRight, Coins } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import GroupBadge from '../../components/GroupBadge';
import OtorgarTokens from '../../components/OtorgarTokens';
import { useGame } from '../../contexts/GameContext';

// Temáticas según facultad
const tematicasPorFacultad = {
  'Ingeniería': [
    {
      id: 'sostenibilidad',
      titulo: 'Sostenibilidad Urbana',
      descripcion: 'Soluciones tecnológicas para ciudades sostenibles',
      icon: Leaf,
      color: 'from-green-500 to-emerald-600',
      problemas: [
        'Gestión inteligente de residuos',
        'Optimización del transporte público',
        'Sistemas de energía renovable'
      ]
    },
    {
      id: 'industria',
      titulo: 'Industria 4.0',
      descripcion: 'Automatización y digitalización industrial',
      icon: Factory,
      color: 'from-blue-500 to-cyan-600',
      problemas: [
        'Optimización de procesos productivos',
        'Internet de las cosas en manufactura',
        'Mantenimiento predictivo'
      ]
    },
    {
      id: 'salud',
      titulo: 'Tecnología en Salud',
      descripcion: 'Innovación para mejorar la atención médica',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      problemas: [
        'Telemedicina en zonas rurales',
        'Dispositivos de monitoreo remoto',
        'Apps para gestión de salud'
      ]
    }
  ],
  'Diseño': [
    {
      id: 'experiencia',
      titulo: 'Experiencia de Usuario',
      descripcion: 'Diseño centrado en las personas',
      icon: Heart,
      color: 'from-pink-500 to-purple-600',
      problemas: [
        'Apps para adultos mayores',
        'Espacios públicos inclusivos',
        'Productos para personas con discapacidad'
      ]
    },
    {
      id: 'sostenible',
      titulo: 'Diseño Sostenible',
      descripcion: 'Productos eco-amigables e innovadores',
      icon: Leaf,
      color: 'from-green-500 to-teal-600',
      problemas: [
        'Empaques biodegradables',
        'Moda circular y reutilizable',
        'Mobiliario de materiales reciclados'
      ]
    },
    {
      id: 'digital',
      titulo: 'Diseño Digital',
      descripcion: 'Experiencias digitales innovadoras',
      icon: Lightbulb,
      color: 'from-blue-500 to-indigo-600',
      problemas: [
        'Plataformas educativas interactivas',
        'Realidad aumentada para comercio',
        'Interfaces de voz y gestos'
      ]
    }
  ],
  'Negocios': [
    {
      id: 'emprendimiento',
      titulo: 'Emprendimiento Social',
      descripcion: 'Negocios con impacto positivo',
      icon: Heart,
      color: 'from-orange-500 to-red-600',
      problemas: [
        'Inclusión laboral de grupos vulnerables',
        'Comercio justo para pequeños productores',
        'Servicios financieros para comunidades'
      ]
    },
    {
      id: 'ecommerce',
      titulo: 'E-commerce Innovador',
      descripcion: 'Nuevos modelos de venta digital',
      icon: Factory,
      color: 'from-purple-500 to-pink-600',
      problemas: [
        'Marketplace de productos locales',
        'Suscripciones personalizadas',
        'Live commerce y ventas en vivo'
      ]
    },
    {
      id: 'economia',
      titulo: 'Economía Circular',
      descripcion: 'Modelos de negocio sostenibles',
      icon: Leaf,
      color: 'from-green-500 to-lime-600',
      problemas: [
        'Plataformas de segunda mano',
        'Reparación y reacondicionamiento',
        'Alquiler vs compra'
      ]
    }
  ],
  'Comunicaciones': [
    {
      id: 'social',
      titulo: 'Comunicación Social',
      descripcion: 'Impacto en comunidades',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      problemas: [
        'Campañas de concientización ambiental',
        'Comunicación en crisis',
        'Participación ciudadana digital'
      ]
    },
    {
      id: 'contenido',
      titulo: 'Creación de Contenido',
      descripcion: 'Narrativas digitales innovadoras',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-600',
      problemas: [
        'Podcasts educativos',
        'Videos interactivos',
        'Storytelling transmedia'
      ]
    },
    {
      id: 'marca',
      titulo: 'Branding & Estrategia',
      descripcion: 'Construcción de marca con propósito',
      icon: Factory,
      color: 'from-blue-500 to-purple-600',
      problemas: [
        'Rebranding de PyMEs',
        'Marca personal digital',
        'Estrategias de posicionamiento'
      ]
    }
  ]
};

export default function ProfesorEleccionTematica() {
  const navigate = useNavigate();
  const { session, addTokens } = useGame();
  const [mostrarOtorgarTokens, setMostrarOtorgarTokens] = useState(false);

  const facultad = session?.facultad || 'Ingeniería';
  const tematicas = tematicasPorFacultad[facultad as keyof typeof tematicasPorFacultad] || tematicasPorFacultad['Ingeniería'];

  const grupos = session?.grupos || [
    { nombre: 'Grupo Rojo', color: '#ff4757', tokens: 120, estudiantes: [] },
    { nombre: 'Grupo Azul', color: '#3742fa', tokens: 95, estudiantes: [] },
    { nombre: 'Grupo Verde', color: '#2ed573', tokens: 110, estudiantes: [] },
    { nombre: 'Grupo Amarillo', color: '#ffa502', tokens: 88, estudiantes: [] }
  ];

  // Mock de elecciones de los grupos
  const [elecciones] = useState([
    { grupoIndex: 0, tematicaId: tematicas[0].id },
    { grupoIndex: 1, tematicaId: tematicas[1].id },
    { grupoIndex: 2, tematicaId: tematicas[0].id },
    { grupoIndex: 3, tematicaId: tematicas[2].id }
  ]);

  const handleOtorgarTokens = (grupoIndex: number, cantidad: number, motivo: string) => {
    addTokens(grupoIndex, cantidad, motivo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      {/* Modal de otorgar tokens */}
      <OtorgarTokens
        grupos={grupos}
        onOtorgar={handleOtorgarTokens}
        onClose={() => setMostrarOtorgarTokens(false)}
        isOpen={mostrarOtorgarTokens}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full mb-4">
            <p>Etapa 2 de 4 • Trabajo en Equipo</p>
          </div>
          <h1 className="text-[#093c92] mb-2">
            Elección de Temática
          </h1>
          <p className="text-gray-600 text-lg">
            Los equipos están seleccionando su área de trabajo
          </p>
        </motion.div>

        {/* Info de facultad */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-[#093c92]/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Temáticas adaptadas para:</p>
              <p className="text-2xl text-[#093c92]">{facultad} - {session?.carrera}</p>
            </div>
            <Button
              onClick={() => setMostrarOtorgarTokens(true)}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-yellow-400 text-white rounded-full"
            >
              <Coins className="w-4 h-4 mr-2" />
              Otorgar Tokens
            </Button>
          </div>
        </Card>

        {/* Temáticas disponibles */}
        <div className="mb-8">
          <h2 className="text-2xl text-[#093c92] mb-6">Temáticas Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tematicas.map((tematica) => {
              const Icon = tematica.icon;
              const gruposQueEligieron = elecciones.filter(e => e.tematicaId === tematica.id);
              
              return (
                <motion.div
                  key={tematica.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="p-6 h-full border-2 hover:shadow-xl transition-shadow">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tematica.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl text-[#093c92] mb-2">
                      {tematica.titulo}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {tematica.descripcion}
                    </p>

                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-500">Problemas a abordar:</p>
                      {tematica.problemas.map((problema, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-[#093c92] rounded-full mt-1.5" />
                          <p className="text-sm text-gray-700">{problema}</p>
                        </div>
                      ))}
                    </div>

                    {gruposQueEligieron.length > 0 && (
                      <div className="pt-4 border-t">
                        <p className="text-xs text-gray-500 mb-2">Equipos que eligieron esta temática:</p>
                        <div className="flex flex-wrap gap-2">
                          {gruposQueEligieron.map((eleccion) => (
                            <Badge 
                              key={eleccion.grupoIndex}
                              style={{ backgroundColor: grupos[eleccion.grupoIndex].color }}
                              className="text-white border-0"
                            >
                              {grupos[eleccion.grupoIndex].nombre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Elecciones de los grupos */}
        <div className="mb-8">
          <h2 className="text-2xl text-[#093c92] mb-6">Elecciones de los Equipos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {grupos.map((grupo, index) => {
              const eleccion = elecciones.find(e => e.grupoIndex === index);
              const tematicaElegida = tematicas.find(t => t.id === eleccion?.tematicaId);
              const Icon = tematicaElegida?.icon || Lightbulb;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 border-4 h-full" style={{ borderColor: grupo.color }}>
                    <GroupBadge name={grupo.nombre} color={grupo.color} size="medium" className="mb-4" />
                    
                    {tematicaElegida && (
                      <>
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tematicaElegida.color} flex items-center justify-center mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-[#093c92] mb-2">{tematicaElegida.titulo}</p>
                        <p className="text-sm text-gray-600">{tematicaElegida.descripcion}</p>
                      </>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Continuar */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/profesor/etapa2')}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-12 h-14 text-lg"
          >
            Continuar a Bubble Map
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
