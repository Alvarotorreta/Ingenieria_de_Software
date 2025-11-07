import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Trophy, Clock, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';

export default function AdminMetricas() {
  const navigate = useNavigate();
  const { salaId } = useParams();

  const grupos = [
    { nombre: 'Grupo 1', color: '#10b981', tokens: 45, completado: 100 },
    { nombre: 'Grupo 2', color: '#ef4444', tokens: 42, completado: 100 },
    { nombre: 'Grupo 3', color: '#fbbf24', tokens: 38, completado: 90 },
    { nombre: 'Grupo 4', color: '#a855f7', tokens: 40, completado: 95 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin/juegos')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-slate-900">
                Métricas de Sala {salaId}
              </h1>
              <p className="text-sm text-gray-600">Ingeniería de Software</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { title: 'Estudiantes', value: '32', icon: Users, color: '#3b82f6' },
            { title: 'Tokens Totales', value: '165', icon: Trophy, color: '#fbbf24' },
            { title: 'Duración', value: '2h 15m', icon: Clock, color: '#10b981' },
            { title: 'Satisfacción', value: '92%', icon: TrendingUp, color: '#a855f7' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-gray-600 flex items-center justify-between">
                      {stat.title}
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${stat.color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: stat.color }} />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Grupos Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Grupo</CardTitle>
            <CardDescription>Tokens y progreso de cada grupo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {grupos.map((grupo) => (
              <div key={grupo.nombre} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: grupo.color }}
                    />
                    <span className="text-slate-900">{grupo.nombre}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      {grupo.tokens} tokens
                    </span>
                    <span className="text-sm text-gray-600">
                      {grupo.completado}% completado
                    </span>
                  </div>
                </div>
                <Progress value={grupo.completado} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Etapas */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso por Etapa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { etapa: 'Etapa 1: Trabajo en Equipo', completado: 100 },
                { etapa: 'Etapa 2: Empatía (Bubble Map)', completado: 100 },
                { etapa: 'Etapa 3: Creatividad (LEGOS)', completado: 100 },
                { etapa: 'Etapa 4: Comunicación (Pitch)', completado: 100 }
              ].map((etapa) => (
                <div key={etapa.etapa} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900">{etapa.etapa}</span>
                    <span className="text-sm text-gray-600">{etapa.completado}%</span>
                  </div>
                  <Progress value={etapa.completado} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
