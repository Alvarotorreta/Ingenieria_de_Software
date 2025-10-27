import { useNavigate } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useState } from 'react';

const GRUPOS = [
  { id: 1, nombre: 'Grupo Azul', color: '#3b82f6' },
  { id: 2, nombre: 'Grupo Rojo', color: '#ef4444' },
  { id: 3, nombre: 'Grupo Verde', color: '#22c55e' },
  { id: 4, nombre: 'Grupo Amarillo', color: '#eab308' },
];

export default function PersonalizacionGrupos() {
  const navigate = useNavigate();
  const { session, updateSession } = useGame();
  const [nombres, setNombres] = useState<Record<number, string>>({});

  const handleNombreChange = (grupoId: number, nombre: string) => {
    setNombres(prev => ({ ...prev, [grupoId]: nombre }));
  };

  const handleContinuar = () => {
    // Actualizar nombres de grupos si es necesario
    if (Object.keys(nombres).length > 0 && session) {
      const gruposActualizados = session.grupos.map(grupo => {
        if (nombres[grupo.id_grupo]) {
          return { ...grupo, nombre: nombres[grupo.id_grupo] };
        }
        return grupo;
      });
      updateSession({ ...session, grupos: gruposActualizados });
    }
    
    navigate('/profesor/etapa1');
  };

  return (
    <div className="min-h-screen bg-[#093c92] flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-[#fbc95c]">Personalización de equipos</h1>
          <p className="text-white mt-4">
            Personaliza los nombres de los grupos o mantén los nombres por defecto
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GRUPOS.map(grupo => (
            <Card key={grupo.id} className="p-6" style={{ borderLeft: `4px solid ${grupo.color}` }}>
              <div className="space-y-4">
                <h3 style={{ color: grupo.color }}>{grupo.nombre}</h3>
                <Input
                  type="text"
                  placeholder={grupo.nombre}
                  value={nombres[grupo.id] || ''}
                  onChange={(e) => handleNombreChange(grupo.id, e.target.value)}
                  className="w-full"
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/profesor/sala')}
            className="bg-white text-[#093c92]"
          >
            Volver
          </Button>
          <Button
            onClick={handleContinuar}
            className="bg-[#fbc95c] text-[#093c92] hover:bg-[#fbc95c]/90"
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
}
