import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';
import type { Sala, Equipo, Alumno, Carrera, Facultad } from '../types/database';
import { salaApi, equipoApi, tokensApi } from '../services/api';

// Tipos locales que coinciden con la DB
interface Estudiante extends Alumno {
  id: string; // Alias para compatibilidad
}

interface Grupo extends Equipo {
  tokens: number; // Alias para puntaje_total
  estudiantes: Estudiante[];
}

interface GameSession {
  // Datos de la sala
  id_sala?: number;
  codigo: string;
  facultad: string;
  carrera: string;
  nombreProfesor: string;
  grupos: Grupo[];
  etapaActual?: number;
  estado?: 'programada' | 'en_juego' | 'finalizado';
  
  // Datos adicionales
  id_carrera?: number;
  id_usuario?: number;
  fecha_creacion?: string;
}

interface GameContextType {
  session: GameSession | null;
  isLoading: boolean;
  createSession: (sessionData: Partial<GameSession>) => void;
  createSessionFromAPI: (salaData: Sala) => Promise<void>;
  loadSession: (id_sala: number) => Promise<void>;
  loadSessionByCodigo: (codigo: string) => Promise<void>;
  updateSession: (updates: Partial<GameSession>) => void;
  addTokens: (grupoIndex: number, cantidad: number, motivo: string) => void;
  addTokensToAPI: (id_equipo: number, cantidad: number, motivo: string, id_actividad?: number) => Promise<void>;
  asignarEstudiante: (estudiante: Estudiante, grupoIndex: number) => void;
  moverEstudiante: (estudianteId: string, grupoOrigenIndex: number, grupoDestinoIndex: number) => void;
  aleatorizar: () => void;
  syncWithAPI: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Crear sesión local (sin API)
  const createSession = (sessionData: Partial<GameSession>) => {
    const newSession: GameSession = {
      codigo: sessionData.codigo || '',
      facultad: sessionData.facultad || '',
      carrera: sessionData.carrera || '',
      nombreProfesor: sessionData.nombreProfesor || '',
      grupos: sessionData.grupos || [],
      etapaActual: 0,
      estado: 'programada'
    };

    setSession(newSession);
  };

  // Crear sesión desde datos de API
  const createSessionFromAPI = async (salaData: any) => {
    try {
      setIsLoading(true);
      
      // Mapear grupos con sus alumnos
      const grupos: Grupo[] = (salaData.equipos || []).map((equipo: any) => ({
        ...equipo,
        id: equipo.id_equipo.toString(),
        tokens: equipo.puntaje_total,
        estudiantes: (equipo.alumnos || []).map((alumno: any) => ({
          ...alumno,
          id: alumno.id_alumno.toString()
        }))
      }));

      const newSession: GameSession = {
        id_sala: salaData.id_sala,
        codigo: salaData.codigo_acceso,
        facultad: salaData.carrera?.facultad?.nombre || '',
        carrera: salaData.carrera?.nombre || '',
        nombreProfesor: salaData.usuario?.nombre || '',
        grupos,
        etapaActual: 0,
        estado: salaData.estado,
        id_carrera: salaData.id_carrera,
        id_usuario: salaData.id_usuario,
        fecha_creacion: salaData.fecha_creacion
      };

      setSession(newSession);
    } catch (error: any) {
      toast.error('Error al crear sesión: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar sesión por ID
  const loadSession = async (id_sala: number) => {
    try {
      setIsLoading(true);
      const salaData = await salaApi.getById(id_sala);
      await createSessionFromAPI(salaData);
    } catch (error: any) {
      toast.error('Error al cargar sala: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar sesión por código
  const loadSessionByCodigo = async (codigo: string) => {
    try {
      setIsLoading(true);
      const salaData = await salaApi.getByCodigo(codigo);
      await createSessionFromAPI(salaData);
    } catch (error: any) {
      toast.error('Error al cargar sala: ' + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar sesión local
  const updateSession = (updates: Partial<GameSession>) => {
    setSession(prev => prev ? { ...prev, ...updates } : null);
  };

  // Agregar tokens localmente
  const addTokens = (grupoIndex: number, cantidad: number, motivo: string) => {
    setSession(prev => {
      if (!prev) return prev;

      const grupos = prev.grupos.map((g, index) => 
        index === grupoIndex 
          ? { ...g, tokens: g.tokens + cantidad, puntaje_total: (g.puntaje_total || 0) + cantidad }
          : g
      );

      const grupo = grupos[grupoIndex];
      
      if (grupo && cantidad > 0) {
        toast.success(`¡${grupo.nombre_equipo} ganó ${cantidad} token${cantidad > 1 ? 's' : ''}! 🪙`, {
          description: motivo,
          duration: 3000
        });
      }

      return { ...prev, grupos };
    });
  };

  // Agregar tokens a través de API
  const addTokensToAPI = async (id_equipo: number, cantidad: number, motivo: string, id_actividad: number = 1) => {
    try {
      await tokensApi.registrar({
        id_equipo,
        cantidad_tokens: cantidad,
        motivo,
        id_actividad,
        emisor: session?.nombreProfesor || 'Sistema',
        receptor: 'Equipo'
      });

      // Actualizar localmente también
      const grupoIndex = session?.grupos.findIndex(g => g.id_equipo === id_equipo) || -1;
      if (grupoIndex !== -1) {
        addTokens(grupoIndex, cantidad, motivo);
      }

      // Actualizar puntaje en API
      await equipoApi.updatePuntaje({
        id_equipo,
        puntaje_adicional: cantidad
      });
    } catch (error: any) {
      toast.error('Error al otorgar tokens: ' + error.message);
      throw error;
    }
  };

  // Asignar estudiante a grupo
  const asignarEstudiante = (estudiante: Estudiante, grupoIndex: number) => {
    setSession(prev => {
      if (!prev) return prev;

      const grupos = prev.grupos.map((g, index) => {
        if (index === grupoIndex) {
          if (g.estudiantes.some(e => e.id === estudiante.id)) {
            return g;
          }
          return { ...g, estudiantes: [...g.estudiantes, estudiante] };
        }
        return { ...g, estudiantes: g.estudiantes.filter(e => e.id !== estudiante.id) };
      });

      return { ...prev, grupos };
    });
  };

  // Mover estudiante entre grupos
  const moverEstudiante = (estudianteId: string, grupoOrigenIndex: number, grupoDestinoIndex: number) => {
    setSession(prev => {
      if (!prev) return prev;

      const estudianteAMover = prev.grupos[grupoOrigenIndex].estudiantes.find(e => e.id === estudianteId);
      if (!estudianteAMover) return prev;

      const grupos = prev.grupos.map((g, index) => {
        if (index === grupoOrigenIndex) {
          return { ...g, estudiantes: g.estudiantes.filter(e => e.id !== estudianteId) };
        }
        if (index === grupoDestinoIndex) {
          return { ...g, estudiantes: [...g.estudiantes, estudianteAMover] };
        }
        return g;
      });

      return { ...prev, grupos };
    });
  };

  // Aleatorizar estudiantes
  const aleatorizar = () => {
    setSession(prev => {
      if (!prev) return prev;

      const todosLosEstudiantes = prev.grupos.flatMap(g => g.estudiantes);
      const shuffled = [...todosLosEstudiantes].sort(() => Math.random() - 0.5);
      const grupoSize = Math.ceil(shuffled.length / 4);
      
      const grupos = prev.grupos.map((g, index) => ({
        ...g,
        estudiantes: shuffled.slice(index * grupoSize, (index + 1) * grupoSize)
      }));

      toast.success('¡Estudiantes redistribuidos aleatoriamente!');

      return { ...prev, grupos };
    });
  };

  // Sincronizar con API (recargar datos)
  const syncWithAPI = async () => {
    if (!session?.id_sala) return;
    await loadSession(session.id_sala);
  };

  const value: GameContextType = {
    session,
    isLoading,
    createSession,
    createSessionFromAPI,
    loadSession,
    loadSessionByCodigo,
    updateSession,
    addTokens,
    addTokensToAPI,
    asignarEstudiante,
    moverEstudiante,
    aleatorizar,
    syncWithAPI
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
