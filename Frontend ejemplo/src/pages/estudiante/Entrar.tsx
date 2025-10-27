import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { LogIn, User } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner@2.0.3';

export default function EstudianteEntrar() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');

  const handleJoin = () => {
    if (!nombre || !codigo) {
      toast.error('Completa todos los campos');
      return;
    }
    navigate('/estudiante/evaluar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <User className="w-16 h-16 text-[#f757ac] mx-auto mb-4" />
            <h1 className="text-[#093c92] text-3xl mb-2">
              Evaluación de Equipos
            </h1>
            <p className="text-gray-600">
              Ingresa tus datos para comenzar
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="nombre">Tu Nombre</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juan Pérez"
                className="h-12 border-2"
              />
            </div>

            <div>
              <Label htmlFor="codigo">Código de Sala</Label>
              <Input
                id="codigo"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                placeholder="ABC123"
                maxLength={6}
                className="h-12 border-2 text-center tracking-widest"
              />
            </div>

            <Button
              onClick={handleJoin}
              className="w-full h-14 bg-gradient-to-r from-[#f757ac] to-pink-600 text-white rounded-full text-lg"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Ingresar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
