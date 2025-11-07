import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Clock, Coins, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner@2.0.3';

export default function AdminConfiguracion() {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    tiempoEtapa1: 60,
    tiempoEtapa2: 180,
    tiempoEtapa3: 600,
    tiempoEtapa4: 900,
    tokensBase: 10,
    miniJuegoHabilitado: true,
    maxGrupos: 4,
    minEstudiantesPorGrupo: 3,
    maxEstudiantesPorGrupo: 8
  });

  const handleSave = () => {
    toast.success('Configuración guardada', {
      description: 'Los cambios se aplicarán en las próximas sesiones'
    });
  };

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
              Configuración del Juego
            </h1>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
        {/* Tiempos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Tiempos por Etapa
            </CardTitle>
            <CardDescription>Configura la duración de cada etapa en segundos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Etapa 1: Trabajo en Equipo', key: 'tiempoEtapa1' },
              { label: 'Etapa 2: Empatía (Bubble Map)', key: 'tiempoEtapa2' },
              { label: 'Etapa 3: Creatividad (LEGOS)', key: 'tiempoEtapa3' },
              { label: 'Etapa 4: Comunicación (Pitch)', key: 'tiempoEtapa4' }
            ].map((etapa) => (
              <div key={etapa.key} className="flex items-center justify-between">
                <Label>{etapa.label}</Label>
                <Input
                  type="number"
                  value={config[etapa.key as keyof typeof config]}
                  onChange={(e) => setConfig({ ...config, [etapa.key]: Number(e.target.value) })}
                  className="w-32"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tokens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              Sistema de Tokens
            </CardTitle>
            <CardDescription>Configura el sistema de recompensas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Tokens base por actividad</Label>
              <Input
                type="number"
                value={config.tokensBase}
                onChange={(e) => setConfig({ ...config, tokensBase: Number(e.target.value) })}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Mini-juego habilitado</Label>
                <p className="text-sm text-gray-600">Cuando los grupos se conocen</p>
              </div>
              <Switch
                checked={config.miniJuegoHabilitado}
                onCheckedChange={(checked) => setConfig({ ...config, miniJuegoHabilitado: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Grupos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              Configuración de Grupos
            </CardTitle>
            <CardDescription>Define los límites de grupos y estudiantes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Número máximo de grupos</Label>
              <Input
                type="number"
                value={config.maxGrupos}
                onChange={(e) => setConfig({ ...config, maxGrupos: Number(e.target.value) })}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Mínimo estudiantes por grupo</Label>
              <Input
                type="number"
                value={config.minEstudiantesPorGrupo}
                onChange={(e) => setConfig({ ...config, minEstudiantesPorGrupo: Number(e.target.value) })}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Máximo estudiantes por grupo</Label>
              <Input
                type="number"
                value={config.maxEstudiantesPorGrupo}
                onChange={(e) => setConfig({ ...config, maxEstudiantesPorGrupo: Number(e.target.value) })}
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
