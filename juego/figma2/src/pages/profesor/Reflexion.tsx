import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { QrCode, Smartphone, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';

export default function ProfesorReflexion() {
  const navigate = useNavigate();

  // Mock de estudiantes que han respondido
  const totalEstudiantes = 16;
  const estudiantesRespondidos = 12;
  const porcentajeCompletado = (estudiantesRespondidos / totalEstudiantes) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full mb-4">
            <p>Reflexión Final</p>
          </div>
          <h1 className="text-[#093c92] mb-4">
            Encuesta de Reflexión
          </h1>
          <p className="text-gray-600 text-lg">
            Los estudiantes completarán una encuesta sobre su experiencia
          </p>
        </motion.div>

        {/* QR Code Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Card className="p-12 bg-white shadow-2xl border-2 border-[#093c92]/20 mb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl text-[#093c92] mb-2">
                Escanea el código QR
              </h2>
              <p className="text-gray-600">
                Los estudiantes deben escanear este código con sus teléfonos móviles
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.8 }}
                className="relative"
              >
                <div className="w-80 h-80 bg-white border-8 border-[#093c92] rounded-3xl flex items-center justify-center shadow-2xl">
                  {/* Mock QR Code */}
                  <div className="w-64 h-64 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div
                          key={i}
                          className={`${
                            Math.random() > 0.5 ? 'bg-white' : 'bg-black'
                          }`}
                        />
                      ))}
                    </div>
                    {/* Esquinas del QR */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-4 border-white" />
                    <div className="absolute top-4 right-4 w-12 h-12 border-4 border-white" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-white" />
                  </div>
                </div>

                {/* Ícono de escaneo animado */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <Smartphone className="w-8 h-8 text-white" />
                </motion.div>
              </motion.div>
            </div>

            {/* URL alternativa */}
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 mb-2">O ingresar manualmente:</p>
              <div className="inline-block bg-gray-100 px-6 py-3 rounded-xl border-2 border-gray-200">
                <code className="text-[#093c92] text-lg">
                  encuesta.juego-emprendimiento.cl
                </code>
              </div>
            </div>

            {/* Instrucciones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-purple-50 rounded-xl text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">1</span>
                </div>
                <p className="text-sm text-gray-700">Abre la cámara de tu teléfono</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-xl text-center">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">2</span>
                </div>
                <p className="text-sm text-gray-700">Escanea el código QR</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">3</span>
                </div>
                <p className="text-sm text-gray-700">Completa la encuesta</p>
              </div>
            </div>

            {/* Progreso */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Progreso de respuestas</span>
                </div>
                <Badge className="bg-[#093c92] text-white border-0">
                  {estudiantesRespondidos} / {totalEstudiantes}
                </Badge>
              </div>
              <Progress value={porcentajeCompletado} className="h-3 mb-2" />
              <p className="text-sm text-gray-600 text-right">
                {porcentajeCompletado.toFixed(0)}% completado
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Preguntas de la encuesta (info para el profesor) */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 mb-8">
          <h3 className="text-[#093c92] text-xl mb-4">
            Preguntas de la Encuesta
          </h3>
          <div className="space-y-3">
            {[
              '¿Qué tan efectiva fue la comunicación en tu equipo?',
              '¿Qué tan creativa fue la solución propuesta?',
              '¿Cómo calificarías el trabajo en equipo?',
              '¿Qué tan empático fue tu equipo con el problema?',
              '¿Qué tan bien se organizaron las tareas?',
              '¿Qué tan satisfecho estás con el resultado final?'
            ].map((pregunta, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="w-6 h-6 bg-[#093c92] rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-sm">{pregunta}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Botón continuar */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/profesor/home')}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-12 h-14 text-lg"
          >
            Finalizar Sesión
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
