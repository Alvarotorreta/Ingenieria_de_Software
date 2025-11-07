import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner@2.0.3';

export default function TabletEntrar() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    if (codigo.length !== 6) {
      toast.error('Ingresa un código de 6 caracteres');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      navigate('/tablet/sala');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#093c92] via-purple-600 to-[#f757ac] flex items-center justify-center p-8">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          onClick={() => navigate('/tablet/inicio')}
          variant="outline"
          className="bg-white/90 hover:bg-white backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>

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
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="h-24 text-center text-5xl tracking-widest border-4 border-[#093c92]/20 focus:border-[#f757ac] rounded-2xl"
            />

            <Button
              onClick={handleJoin}
              disabled={loading || codigo.length !== 6}
              className="w-full h-20 text-2xl bg-gradient-to-r from-[#f757ac] to-pink-600 hover:from-pink-600 hover:to-[#f757ac] text-white rounded-full disabled:opacity-50"
            >
              {loading ? (
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
