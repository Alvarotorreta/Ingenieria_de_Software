import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner@2.0.3';
import { useGame } from '../../contexts/GameContext';

export default function TabletEntrar() {
  const navigate = useNavigate();
  const { loadSessionByCodigo, isLoading } = useGame();
  const [codigo, setCodigo] = useState('');

  const handleJoin = async () => {
    // Validar código (6 dígitos)
    if (!/^\d{6}$/.test(codigo)) {
      toast.error('Ingresa un código válido de 6 dígitos');
      return;
    }

    try {
      await loadSessionByCodigo(codigo);
      toast.success('¡Conectado a la sala!');
      navigate('/tablet/sala');
    } catch (error: any) {
      if (error.status === 404) {
        toast.error('Sala no encontrada', {
          description: 'Verifica el código ingresado'
        });
      } else {
        toast.error('Error al conectar', {
          description: error.message
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] flex items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-12 space-y-8">
          <div className="text-center">
            <Sparkles className="w-20 h-20 text-[#f757ac] mx-auto mb-6" />
            <h1 className="text-[#093c92] mb-4">
              Ingresa el Código
            </h1>
            <p className="text-gray-600 text-xl">
              Tu profesor te dará el código de la sala
            </p>
          </div>

          <div className="space-y-6">
            <Input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              maxLength={6}
              className="h-24 text-center text-5xl tracking-widest border-4 border-[#093c92]/20 focus:border-[#f757ac] rounded-2xl"
            />

            <Button
              onClick={handleJoin}
              disabled={isLoading || codigo.length !== 6}
              className="w-full h-20 text-2xl bg-gradient-to-r from-[#f757ac] to-pink-600 hover:from-pink-600 hover:to-[#f757ac] text-white rounded-full disabled:opacity-50"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <LogIn className="w-8 h-8 mr-4" />
                  Unirse a la Sala
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
