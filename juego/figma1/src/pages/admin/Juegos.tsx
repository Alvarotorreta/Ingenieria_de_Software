import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Filter, Eye } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';

const juegos = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  codigo: `${100000 + i}`,
  curso: ['Ingeniería de Software', 'Emprendimiento', 'Marketing', 'Gestión'][i % 4],
  profesor: `Profesor ${i + 1}`,
  fecha: `2024-10-${(i % 30) + 1}`,
  estudiantes: 24 + (i % 8) * 4,
  estado: ['Finalizado', 'En Progreso', 'Finalizado', 'Finalizado'][i % 4]
}));

export default function AdminJuegos() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const juegosFiltrados = juegos.filter(j => 
    j.curso.toLowerCase().includes(search.toLowerCase()) ||
    j.profesor.toLowerCase().includes(search.toLowerCase()) ||
    j.codigo.includes(search)
  );

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
              Todos los Juegos
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar por curso, profesor o código..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Games List */}
        <div className="space-y-4">
          {juegosFiltrados.map((juego, index) => (
            <motion.div
              key={juego.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/admin/metricas/${juego.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Código</p>
                        <p className="text-slate-900">{juego.codigo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Curso</p>
                        <p className="text-slate-900">{juego.curso}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Profesor</p>
                        <p className="text-slate-900">{juego.profesor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Fecha</p>
                        <p className="text-slate-900">{juego.fecha}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estudiantes</p>
                        <p className="text-slate-900">{juego.estudiantes}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span 
                        className={`px-3 py-1 rounded-full text-sm ${
                          juego.estado === 'Finalizado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {juego.estado}
                      </span>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
