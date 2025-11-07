import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Play, Sparkles, Upload } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { toast } from 'sonner@2.0.3';
import { useGame } from '../../contexts/GameContext';

const facultades = [
  {
    nombre: "Ingeniería",
    carreras: ["Ingeniería Civil Industrial", "Ingeniería Civil Informática", "Ingeniería Comercial"]
  },
  {
    nombre: "Diseño",
    carreras: ["Diseño Gráfico", "Diseño Industrial", "Diseño de Vestuario"]
  },
  {
    nombre: "Negocios",
    carreras: ["Administración de Empresas", "Contabilidad y Auditoría", "Marketing"]
  },
  {
    nombre: "Comunicaciones",
    carreras: ["Periodismo", "Publicidad", "Comunicación Audiovisual"]
  }
];

export default function ProfesorCrearSala() {
  const navigate = useNavigate();
  const { createSession } = useGame();
  const [facultad, setFacultad] = useState('');
  const [carrera, setCarrera] = useState('');
  const [nombreProfesor, setNombreProfesor] = useState('');
  const [archivoAlumnos, setArchivoAlumnos] = useState(null);

  const carrerasDisponibles = facultades.find(f => f.nombre === facultad)?.carreras || [];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setArchivoAlumnos(file);
      toast.success(`Archivo "${file.name}" cargado correctamente`);
    } else {
      toast.error('Por favor sube un archivo con formato .xlsx');
      e.target.value = null;
    }
  };

  const handleCreateSala = () => {
    if (!facultad || !carrera || !nombreProfesor) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Generar código de 6 dígitos
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();

    createSession({
      codigo,
      facultad,
      carrera,
      nombreProfesor,
      archivoAlumnos,
      grupos: [
        { nombre: 'Grupo Rojo', color: '#ff4757', tokens: 0, estudiantes: [] },
        { nombre: 'Grupo Azul', color: '#3742fa', tokens: 0, estudiantes: [] },
        { nombre: 'Grupo Verde', color: '#2ed573', tokens: 0, estudiantes: [] },
        { nombre: 'Grupo Amarillo', color: '#ffa502', tokens: 0, estudiantes: [] },
      ]
    });

    navigate(`/profesor/sala/${codigo}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-700 to-[#f757ac] relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="p-12 bg-white rounded-3xl shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-6"
              >
                <Sparkles className="w-16 h-16 text-[#fbc95c]" />
              </motion.div>
              
              <h1 className="text-[#093c92] mb-4">
                Crear Nueva Sala
              </h1>
              <p className="text-gray-600 text-lg">
                Configura la información de tu sesión de juego
              </p>
            </div>

            <div className="space-y-6">
              {/* Nombre del Profesor */}
              <div>
                <Label htmlFor="nombreProfesor" className="text-gray-700">
                  Nombre del Profesor
                </Label>
                <Input
                  id="nombreProfesor"
                  value={nombreProfesor}
                  onChange={(e) => setNombreProfesor(e.target.value)}
                  placeholder="Ej: María González"
                  className="h-14 text-lg border-2 rounded-xl mt-2"
                />
              </div>

              {/* Agregar lista alumnos */}
              <div>
                <Label htmlFor="listaAlumnos" className="text-gray-700">
                  Agregar lista alumnos
                </Label>
                <div className="flex items-center gap-3 mt-2">
                  <Input
                    id="listaAlumnos"
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileUpload}
                    className="h-14 text-lg border-2 rounded-xl cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-gray-600" />
                </div>
                {archivoAlumnos && (
                  <p className="text-sm text-green-600 mt-2">
                    📂 Archivo seleccionado: <strong>{archivoAlumnos.name}</strong>
                  </p>
                )}
              </div>

              {/* Facultad */}
              <div>
                <Label htmlFor="facultad" className="text-gray-700">
                  Facultad
                </Label>
                <Select value={facultad} onValueChange={(value) => {
                  setFacultad(value);
                  setCarrera('');
                }}>
                  <SelectTrigger className="h-14 text-lg border-2 rounded-xl mt-2">
                    <SelectValue placeholder="Selecciona una facultad" />
                  </SelectTrigger>
                  <SelectContent>
                    {facultades.map((fac) => (
                      <SelectItem key={fac.nombre} value={fac.nombre} className="text-lg">
                        {fac.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Carrera */}
              <div>
                <Label htmlFor="carrera" className="text-gray-700">
                  Carrera
                </Label>
                <Select 
                  value={carrera} 
                  onValueChange={setCarrera}
                  disabled={!facultad}
                >
                  <SelectTrigger className="h-14 text-lg border-2 rounded-xl mt-2">
                    <SelectValue placeholder={facultad ? "Selecciona una carrera" : "Primero selecciona una facultad"} />
                  </SelectTrigger>
                  <SelectContent>
                    {carrerasDisponibles.map((car) => (
                      <SelectItem key={car} value={car} className="text-lg">
                        {car}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  💡 <strong>Importante:</strong> Las temáticas del juego se adaptarán según la facultad seleccionada.
                </p>
              </div>

              {/* Botón crear */}
              <Button
                onClick={handleCreateSala}
                disabled={!facultad || !carrera || !nombreProfesor}
                className="w-full h-16 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-500 text-white rounded-full text-xl disabled:opacity-50"
              >
                <Play className="w-6 h-6 mr-3" />
                Crear Sala
                <Sparkles className="w-5 h-5 ml-3" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
