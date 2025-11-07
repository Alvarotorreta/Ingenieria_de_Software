import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, ArrowRight, CheckCircle, Users, Target, Lightbulb, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

const tutorialSections = [
  {
    title: "Bienvenida al Juego",
    icon: Play,
    description: "Un juego educativo de emprendimiento diseñado para desarrollar competencias clave en tus estudiantes"
  },
  {
    title: "Trabajo en Equipo",
    icon: Users,
    description: "Los estudiantes trabajarán en 4 grupos colaborativos, aprendiendo a coordinarse y apoyarse mutuamente"
  },
  {
    title: "Creatividad",
    icon: Lightbulb,
    description: "Desarrollarán soluciones innovadoras a problemas reales mediante actividades de ideación"
  },
  {
    title: "Comunicación",
    icon: MessageSquare,
    description: "Presentarán sus ideas mediante pitch, fortaleciendo habilidades de comunicación efectiva"
  },
  {
    title: "Sistema de Tokens",
    icon: Target,
    description: "Otorga tokens a los equipos por sus logros. El equipo con más tokens al final gana"
  }
];

export default function ProfesorTutorial() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-[#093c92] mb-4">
            Tutorial del Profesor
          </h1>
          <p className="text-gray-600 text-xl">
            Aprende cómo facilitar el juego de emprendimiento
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Video explicativo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6 h-full">
              <h2 className="text-[#093c92] text-2xl mb-4">
                Video Tutorial
              </h2>
              
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center mb-4 relative overflow-hidden border-4 border-[#093c92]/20">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative z-10 cursor-pointer"
                >
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-12 h-12 text-white ml-2" />
                  </div>
                </motion.div>
              </div>

              <p className="text-gray-600">
                Este video te guiará paso a paso sobre cómo usar la plataforma y facilitar cada etapa del juego.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-[#f757ac] rounded-full" />
                  <span>Cómo crear y gestionar una sala</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-[#f757ac] rounded-full" />
                  <span>Organización de grupos y estudiantes</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-[#f757ac] rounded-full" />
                  <span>Sistema de tokens y evaluación</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-[#f757ac] rounded-full" />
                  <span>Gestión de las 4 etapas del juego</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Pasos del tutorial */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-6 h-full">
              <h2 className="text-[#093c92] text-2xl mb-6">
                Puntos Clave
              </h2>

              <div className="space-y-4">
                {tutorialSections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = currentStep === index;
                  
                  return (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setCurrentStep(index)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#093c92] to-blue-600 text-white shadow-lg scale-105' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${
                          isActive ? 'bg-white/20' : 'bg-[#093c92]/10'
                        }`}>
                          <Icon className={`w-6 h-6 ${
                            isActive ? 'text-white' : 'text-[#093c92]'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`mb-2 ${
                            isActive ? 'text-white' : 'text-[#093c92]'
                          }`}>
                            {section.title}
                          </h3>
                          <p className={`text-sm ${
                            isActive ? 'text-white/90' : 'text-gray-600'
                          }`}>
                            {section.description}
                          </p>
                        </div>
                        {isActive && (
                          <CheckCircle className="w-6 h-6 text-green-300" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Flujo del juego */}
        <Card className="p-8 mb-8">
          <h2 className="text-[#093c92] text-2xl mb-6 text-center">
            Las 4 Etapas del Juego
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { numero: 1, titulo: "Ideación", competencia: "Creatividad", color: "from-purple-500 to-pink-500" },
              { numero: 2, titulo: "Bubble Map", competencia: "Trabajo en Equipo", color: "from-blue-500 to-cyan-500" },
              { numero: 3, titulo: "LEGO", competencia: "Empatía", color: "from-orange-500 to-red-500" },
              { numero: 4, titulo: "Pitch", competencia: "Comunicación", color: "from-green-500 to-emerald-500" }
            ].map((etapa, index) => (
              <motion.div
                key={etapa.numero}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className={`p-6 rounded-2xl bg-gradient-to-br ${etapa.color} text-white text-center shadow-lg`}>
                  <div className="text-6xl opacity-20 mb-2">{etapa.numero}</div>
                  <h3 className="text-xl mb-2">{etapa.titulo}</h3>
                  <p className="text-sm text-white/90">{etapa.competencia}</p>
                </div>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 text-gray-300 w-6 h-6" />
                )}
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Action buttons */}
        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/profesor/objetivos')}
            size="lg"
            className="bg-gradient-to-r from-[#093c92] to-blue-600 text-white rounded-full px-8"
          >
            Continuar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
