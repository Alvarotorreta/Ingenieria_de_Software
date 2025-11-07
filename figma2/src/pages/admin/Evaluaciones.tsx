import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Star, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';

const evaluaciones = [
  {
    pregunta: '¿Te gustó la actividad?',
    si: 87,
    no: 13
  },
  {
    pregunta: '¿Incrementó tus ganas de emprender?',
    si: 82,
    no: 18
  }
];

const comentarios = [
  'Excelente experiencia, muy dinámica y entretenida',
  'Me ayudó a entender mejor el proceso de emprendimiento',
  'Me hubiera gustado más tiempo en la etapa de LEGOS',
  'Muy buena la dinámica de grupos',
  'El juego me motivó a pensar en ideas innovadoras'
];

export default function AdminEvaluaciones() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-slate-900">
              Evaluaciones de Estudiantes
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Satisfacción General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              Satisfacción General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="text-6xl text-yellow-500">92%</div>
              <div className="flex-1">
                <p className="text-gray-600 mb-2">
                  De 892 estudiantes evaluados
                </p>
                <Progress value={92} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preguntas */}
        <div className="grid grid-cols-2 gap-6">
          {evaluaciones.map((ev, index) => (
            <motion.div
              key={ev.pregunta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-green-500" />
                    {ev.pregunta}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-green-600">Sí</span>
                      <span className="text-green-600">{ev.si}%</span>
                    </div>
                    <Progress value={ev.si} className="h-2 bg-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-red-600">No</span>
                      <span className="text-red-600">{ev.no}%</span>
                    </div>
                    <Progress value={ev.no} className="h-2 bg-gray-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comentarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              Comentarios Destacados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {comentarios.map((comentario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-50 rounded-xl border-l-4 border-blue-500"
              >
                <p className="text-slate-700">"{comentario}"</p>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
