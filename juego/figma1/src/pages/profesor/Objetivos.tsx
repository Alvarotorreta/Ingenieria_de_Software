import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Target, Lightbulb, Users, Rocket, Brain, Trophy, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

const objetivos = [
  {
    title: 'Pensamiento Creativo',
    description: 'Desarrollar la capacidad de generar ideas innovadoras y soluciones creativas a problemas reales',
    icon: Lightbulb,
    color: 'from-yellow-400 to-orange-500',
    habilidades: [
      'Generación de ideas originales',
      'Pensamiento lateral',
      'Resolución creativa de problemas',
      'Innovación aplicada'
    ]
  },
  {
    title: 'Trabajo en Equipo',
    description: 'Fomentar la colaboración efectiva, comunicación y liderazgo dentro de grupos diversos',
    icon: Users,
    color: 'from-blue-400 to-cyan-500',
    habilidades: [
      'Comunicación efectiva',
      'Liderazgo colaborativo',
      'Resolución de conflictos',
      'Delegación de tareas'
    ]
  },
  {
    title: 'Emprendimiento',
    description: 'Comprender los fundamentos del emprendimiento y desarrollar habilidades empresariales',
    icon: Rocket,
    color: 'from-purple-400 to-pink-500',
    habilidades: [
      'Identificación de oportunidades',
      'Validación de ideas',
      'Modelo de negocios',
      'Presentación de pitch'
    ]
  },
  {
    title: 'Pensamiento Crítico',
    description: 'Analizar situaciones complejas y tomar decisiones fundamentadas',
    icon: Brain,
    color: 'from-green-400 to-emerald-500',
    habilidades: [
      'Análisis de información',
      'Evaluación de alternativas',
      'Toma de decisiones',
      'Argumentación sólida'
    ]
  }
];

const competencias = [
  'Creatividad e innovación',
  'Trabajo colaborativo',
  'Comunicación efectiva',
  'Liderazgo',
  'Emprendimiento',
  'Resolución de problemas',
  'Pensamiento crítico',
  'Presentación en público'
];

export default function ProfesorObjetivos() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 150 + 50,
              height: Math.random() * 150 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/profesor/home')}
            className="mb-4 rounded-full text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-4"
            >
              <Target className="w-16 h-16 text-white" />
            </motion.div>
            <h1 className="text-white mb-4">
              Objetivos de Aprendizaje
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Este juego está diseñado para desarrollar competencias clave en emprendimiento e innovación
            </p>
          </motion.div>
        </div>

        {/* Main objectives */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {objetivos.map((objetivo, index) => (
            <motion.div
              key={objetivo.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 border-0 shadow-xl bg-white/95 backdrop-blur-sm h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`bg-gradient-to-br ${objetivo.color} p-4 rounded-2xl shrink-0`}>
                    <objetivo.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[#093c92] mb-2">
                      {objetivo.title}
                    </h3>
                    <p className="text-gray-600">
                      {objetivo.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  {objetivo.habilidades.map((habilidad, i) => (
                    <motion.div
                      key={habilidad}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl"
                    >
                      <div className={`bg-gradient-to-br ${objetivo.color} p-1 rounded-md`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-gray-700">{habilidad}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Competencias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm">
            <div className="text-center mb-6">
              <Trophy className="w-12 h-12 text-[#fbc95c] mx-auto mb-4" />
              <h2 className="text-[#093c92] mb-2">
                Competencias Desarrolladas
              </h2>
              <p className="text-gray-600">
                Al finalizar el juego, los estudiantes habrán trabajado estas competencias
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {competencias.map((competencia, i) => (
                <motion.div
                  key={competencia}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-2xl text-center border border-blue-100"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-700">{competencia}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
