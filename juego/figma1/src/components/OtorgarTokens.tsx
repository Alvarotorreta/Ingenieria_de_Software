import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Coins, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import GroupBadge from './GroupBadge';

interface Grupo {
  nombre: string;
  color: string;
  tokens: number;
}

interface OtorgarTokensProps {
  grupos: Grupo[];
  onOtorgar: (grupoIndex: number, cantidad: number, motivo: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function OtorgarTokens({ grupos, onOtorgar, onClose, isOpen }: OtorgarTokensProps) {
  const [grupoSeleccionado, setGrupoSeleccionado] = useState<string>('');
  const [cantidad, setCantidad] = useState<string>('');
  const [motivo, setMotivo] = useState<string>('');

  const handleOtorgar = () => {
    if (!grupoSeleccionado || !cantidad || !motivo) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const cantidadNum = parseInt(cantidad);
    if (cantidadNum <= 0 || isNaN(cantidadNum)) {
      toast.error('La cantidad debe ser un número positivo');
      return;
    }

    const grupoIndex = parseInt(grupoSeleccionado);
    onOtorgar(grupoIndex, cantidadNum, motivo);
    
    // Reset
    setGrupoSeleccionado('');
    setCantidad('');
    setMotivo('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8"
          >
            <Card className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl text-[#093c92]">Otorgar Tokens</h3>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Grupo */}
                <div>
                  <Label htmlFor="grupo" className="text-gray-700 mb-2 block">
                    Selecciona el Grupo
                  </Label>
                  <Select value={grupoSeleccionado} onValueChange={setGrupoSeleccionado}>
                    <SelectTrigger className="h-14 border-2 rounded-xl">
                      <SelectValue placeholder="Elige un grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {grupos.map((grupo, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: grupo.color }}
                            />
                            <span>{grupo.nombre}</span>
                            <span className="text-gray-400">({grupo.tokens} tokens)</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Cantidad */}
                <div>
                  <Label htmlFor="cantidad" className="text-gray-700 mb-2 block">
                    Cantidad de Tokens
                  </Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    placeholder="Ej: 50"
                    className="h-14 text-lg border-2 rounded-xl"
                  />
                  
                  {/* Botones rápidos */}
                  <div className="flex gap-2 mt-3">
                    {[10, 25, 50, 100].map((valor) => (
                      <Button
                        key={valor}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCantidad(valor.toString())}
                        className="flex-1 rounded-lg"
                      >
                        +{valor}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Motivo */}
                <div>
                  <Label htmlFor="motivo" className="text-gray-700 mb-2 block">
                    Motivo
                  </Label>
                  <Input
                    id="motivo"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ej: Excelente colaboración"
                    className="h-14 text-lg border-2 rounded-xl"
                  />
                </div>

                {/* Preview */}
                {grupoSeleccionado && cantidad && motivo && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200"
                  >
                    <div className="flex items-center justify-between">
                      <GroupBadge 
                        name={grupos[parseInt(grupoSeleccionado)].nombre} 
                        color={grupos[parseInt(grupoSeleccionado)].color} 
                        size="small"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-2xl text-[#093c92]">+{cantidad}</span>
                        <Coins className="w-5 h-5 text-yellow-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{motivo}</p>
                  </motion.div>
                )}

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="flex-1 h-12 rounded-full"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleOtorgar}
                    className="flex-1 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-orange-500 hover:to-yellow-400 text-white rounded-full"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Otorgar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
