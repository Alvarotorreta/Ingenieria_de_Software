import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Fondo - mismo que el panel del profesor */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]" />

      <div className="max-w-6xl mx-auto w-full relative z-10 p-4 sm:p-5 font-sans flex-1 flex flex-col">
        {/* Botón Volver */}
        <Button
          onClick={() => navigate('/admin/panel')}
          className="bg-white text-blue-900 hover:bg-gray-100 flex items-center gap-2 px-3 py-2 mb-4 rounded-lg shadow-md text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Panel</span>
        </Button>

        {/* Contenido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Estadísticas y métricas del juego
            </p>
          </div>

          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Esta sección estará disponible próximamente
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Aquí encontrarás estadísticas detalladas y métricas del juego
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
