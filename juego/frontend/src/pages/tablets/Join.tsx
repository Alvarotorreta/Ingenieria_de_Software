import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tablet, Loader2, QrCode, Gamepad2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/services/api';
import { toast } from 'sonner';

export function TabletJoin() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const params = useParams();
  const [roomCode, setRoomCode] = useState('');
  const [tabletCode, setTabletCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Verificar si hay código de sala en la URL (desde QR o parámetro)
  useEffect(() => {
    // Desde query params: ?room_code=ABC123
    const roomCodeFromUrl = searchParams.get('room_code');
    if (roomCodeFromUrl) {
      setRoomCode(roomCodeFromUrl.toUpperCase());
    }

    // Desde path: /tablet/join/ABC123
    const pathParts = window.location.pathname.split('/');
    const joinIndex = pathParts.indexOf('join');
    if (joinIndex !== -1 && pathParts.length > joinIndex + 1) {
      const roomCodeFromPath = pathParts[joinIndex + 1];
      if (roomCodeFromPath && roomCodeFromPath.length === 6) {
        setRoomCode(roomCodeFromPath.toUpperCase());
      }
    }
  }, [searchParams]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedRoomCode = roomCode.trim().toUpperCase();
    const trimmedTabletCode = tabletCode.trim().toUpperCase();

    if (!trimmedRoomCode || !trimmedTabletCode) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      // El endpoint de conexión no requiere autenticación, así que hacemos la petición directamente
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/sessions/tablet-connections/connect/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_code: trimmedRoomCode,
          tablet_code: trimmedTabletCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar información de conexión en localStorage (igual que en join.html - líneas 293-297)
        localStorage.setItem('tabletConnectionId', data.connection.id);
        localStorage.setItem('teamId', data.team.id);
        localStorage.setItem('gameSessionId', data.game_session.id);
        localStorage.setItem('roomCode', data.game_session.room_code);

        toast.success(data.message || '¡Conectado exitosamente!', {
          description: 'Redirigiendo al lobby...',
        });

        // Redirigir al lobby después de 1 segundo (igual que en join.html - línea 302-304)
        setTimeout(() => {
          navigate(`/tablet/lobby?connection_id=${data.connection.id}`);
        }, 1000);
      } else {
        const errorMessage = data.error || 'Error al conectar';
        toast.error('Error', {
          description: errorMessage,
        });
        setLoading(false);
      }
    } catch (error: any) {
      toast.error('Error', {
        description: 'Error de conexión: ' + (error.message || 'Error desconocido'),
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full"
      >
        {/* Logo/Header */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-3 sm:mb-4"
          >
            <Gamepad2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#f757ac] mx-auto" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#093c92] mb-1 sm:mb-2">
            Misión Emprende
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Conectar Tablet a la Sala</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleConnect} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="roomCode" className="text-[#093c92] font-semibold text-sm sm:text-base">
              Código de Sala
            </Label>
            <Input
              id="roomCode"
              type="text"
              placeholder="Ej: ABC123"
              value={roomCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                if (value.length <= 6) {
                  setRoomCode(value);
                }
              }}
              maxLength={6}
              className="h-12 sm:h-14 text-center text-xl sm:text-2xl font-bold tracking-widest uppercase"
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tabletCode" className="text-[#093c92] font-semibold flex items-center gap-2 text-sm sm:text-base">
              <Tablet className="w-3 h-3 sm:w-4 sm:h-4" />
              Código de Tablet
            </Label>
            <Input
              id="tabletCode"
              type="text"
              placeholder="Ej: TAB1, TAB2, TAB3..."
              value={tabletCode}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                setTabletCode(value);
              }}
              className="h-12 sm:h-14 text-base sm:text-lg uppercase"
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 sm:h-14 bg-[#f757ac] hover:bg-[#f757ac]/90 text-white text-base sm:text-lg font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <Tablet className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Conectar
              </>
            )}
          </Button>
        </form>

        {/* Sección QR */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 text-center">
          <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-[#093c92]" />
            <h3 className="text-base sm:text-lg font-semibold text-[#093c92]">Código QR</h3>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
            Si tienes un código QR, escanéalo con tu dispositivo para acceder directamente
          </p>
          <p className="text-gray-500 text-[10px] sm:text-xs">
            El código QR redirige directamente a esta página con el código de sala
          </p>
        </div>

        {/* Info adicional */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-500 text-xs sm:text-sm flex items-center justify-center gap-2">
            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            ¿Necesitas ayuda? Contacta al profesor
          </p>
        </div>
      </motion.div>
    </div>
  );
}

