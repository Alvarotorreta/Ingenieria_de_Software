import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Users, Trophy, Activity, TrendingUp, Eye, Settings, LogOut } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

const stats = [
  { title: 'Total Salas', value: '48', change: '+12%', icon: Users, color: '#10b981' },
  { title: 'Estudiantes Activos', value: '1,234', change: '+8%', icon: Activity, color: '#3b82f6' },
  { title: 'Evaluaciones', value: '892', change: '+15%', icon: Trophy, color: '#fbbf24' },
  { title: 'Tasa de Satisfacción', value: '94%', change: '+5%', icon: TrendingUp, color: '#a855f7' }
];

const recentGames = [
  { id: 1, curso: 'Ingeniería de Software', fecha: '2024-10-23', estudiantes: 32, estado: 'Finalizado' },
  { id: 2, curso: 'Emprendimiento e Innovación', fecha: '2024-10-22', estudiantes: 28, estado: 'En Progreso' },
  { id: 3, curso: 'Gestión de Proyectos', fecha: '2024-10-21', estudiantes: 24, estado: 'Finalizado' },
  { id: 4, curso: 'Marketing Digital', fecha: '2024-10-20', estudiantes: 30, estado: 'Finalizado' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-slate-900">
            Panel de Administrador
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/configuracion')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin/login')}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
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
                    <div className="flex items-end justify-between">
                      <p className="text-3xl">{stat.value}</p>
                      <span className="text-green-600 text-sm">{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Games */}
        <Card>
          <CardHeader>
            <CardTitle>Juegos Recientes</CardTitle>
            <CardDescription>Últimas sesiones de juego realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGames.map((game) => (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/metricas/${game.id}`)}
                >
                  <div className="flex-1">
                    <h3 className="text-slate-900">{game.curso}</h3>
                    <p className="text-sm text-gray-600">{game.fecha}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Estudiantes</p>
                      <p className="text-slate-900">{game.estudiantes}</p>
                    </div>
                    <div>
                      <span 
                        className={`px-3 py-1 rounded-full text-sm ${
                          game.estado === 'Finalizado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {game.estado}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button
            onClick={() => navigate('/admin/juegos')}
            className="h-24 bg-purple-600 hover:bg-purple-700 text-white text-lg"
          >
            Ver Todos los Juegos
          </Button>
          <Button
            onClick={() => navigate('/admin/evaluaciones')}
            className="h-24 bg-blue-600 hover:bg-blue-700 text-white text-lg"
          >
            Ver Evaluaciones
          </Button>
          <Button
            onClick={() => navigate('/admin/configuracion')}
            className="h-24 bg-slate-600 hover:bg-slate-700 text-white text-lg"
          >
            Configuración del Juego
          </Button>
        </div>
      </div>
    </div>
  );
}
