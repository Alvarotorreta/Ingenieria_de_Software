import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner@2.0.3';

interface Estudiante {
  id: string;
  nombre: string;
  email: string;
}

interface Grupo {
  nombre: string;
  color: string;
  tokens: number;
  estudiantes: Estudiante[];
}

interface GameSession {
  codigo: string;
  facultad: string;
  carrera: string;
  nombreProfesor: string;
  grupos: Grupo[];
  etapaActual?: number;
}

interface GameContextType {
  session: GameSession | null;
  createSession: (sessionData: Partial<GameSession>) => void;
  updateSession: (updates: Partial<GameSession>) => void;
  addTokens: (grupoIndex: number, cantidad: number, motivo: string) => void;
  asignarEstudiante: (estudiante: Estudiante, grupoIndex: number) => void;
  moverEstudiante: (estudianteId: string, grupoOrigenIndex: number, grupoDestinoIndex: number) => void;
  aleatorizar: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GameSession | null>(null);

  const createSession = (sessionData: Partial<GameSession>) => {
    const newSession: GameSession = {
      codigo: sessionData.codigo || '',
      facultad: sessionData.facultad || '',
      carrera: sessionData.carrera || '',
      nombreProfesor: sessionData.nombreProfesor || '',
      grupos: sessionData.grupos || [],
      etapaActual: 0
    };

    setSession(newSession);
  };

  const updateSession = (updates: Partial<GameSession>) => {
    setSession(prev => prev ? { ...prev, ...updates } : null);
  };

  const addTokens = (grupoIndex: number, cantidad: number, motivo: string) => {
    setSession(prev => {
      if (!prev) return prev;

      const grupos = prev.grupos.map((g, index) => 
        index === grupoIndex 
          ? { ...g, tokens: g.tokens + cantidad }
          : g
      );

      const grupo = grupos[grupoIndex];
      
      if (grupo && cantidad > 0) {
        toast.success(`¡${grupo.nombre} ganó ${cantidad} token${cantidad > 1 ? 's' : ''}! 🪙`, {
          description: motivo,
          duration: 3000
        });
      }

      return { ...prev, grupos };
    });
  };

  const asignarEstudiante = (estudiante: Estudiante, grupoIndex: number) => {
    setSession(prev => {
      if (!prev) return prev;

      const grupos = prev.grupos.map((g, index) => {
        if (index === grupoIndex) {
          // Verificar si el estudiante ya está en este grupo
          if (g.estudiantes.some(e => e.id === estudiante.id)) {
            return g;
          }
          return { ...g, estudiantes: [...g.estudiantes, estudiante] };
        }
        // Remover el estudiante de otros grupos
        return { ...g, estudiantes: g.estudiantes.filter(e => e.id !== estudiante.id) };
      });

      return { ...prev, grupos };
    });
  };

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

  const aleatorizar = () => {
    setSession(prev => {
      if (!prev) return prev;

      // Obtener todos los estudiantes
      const todosLosEstudiantes = prev.grupos.flatMap(g => g.estudiantes);
      
      // Mezclar aleatoriamente
      const shuffled = [...todosLosEstudiantes].sort(() => Math.random() - 0.5);
      const grupoSize = Math.ceil(shuffled.length / 4);
      
      // Redistribuir en grupos
      const grupos = prev.grupos.map((g, index) => ({
        ...g,
        estudiantes: shuffled.slice(index * grupoSize, (index + 1) * grupoSize)
      }));

      toast.success('¡Estudiantes redistribuidos aleatoriamente!');

      return { ...prev, grupos };
    });
  };

  const value: GameContextType = {
    session,
    createSession,
    updateSession,
    addTokens,
    asignarEstudiante,
    moverEstudiante,
    aleatorizar
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
