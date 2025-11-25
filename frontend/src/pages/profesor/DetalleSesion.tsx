import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  FileImage,
  FileText,
  Network,
  Trophy,
  Users,
  TrendingUp,
  BarChart3,
  Award,
  Target,
  CheckCircle2,
  X,
  Eye,
  Maximize2,
  UserCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  sessionsAPI, 
  teamsAPI, 
  reflectionEvaluationsAPI, 
  teamActivityProgressAPI, 
  teamBubbleMapsAPI, 
  tokenTransactionsAPI 
} from '@/services';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from 'recharts';

interface GameSession {
  id: number;
  room_code: string;
  status: string;
  course_name?: string;
  created_at: string;
  started_at?: string;
  ended_at?: string;
}

interface Team {
  id: number;
  name: string;
  color: string;
  tokens_total: number;
  students?: Student[];
}

interface Student {
  id: number;
  full_name: string;
  email: string;
}

interface ReflectionEvaluation {
  satisfaction: string;
  entrepreneurship_interest: string;
  value_areas: string[];
}

interface TeamActivityProgress {
  id: number;
  team_name: string;
  activity_name: string;
  stage_name: string;
  prototype_image_url?: string;
  pitch_intro_problem?: string;
  pitch_solution?: string;
  pitch_value?: string;
  pitch_impact?: string;
  pitch_closing?: string;
}

interface TeamBubbleMap {
  id: number;
  team_name: string;
  stage_name: string;
  map_data: any;
}

interface TokenTransaction {
  id: number;
  team_name: string;
  amount: number;
  source_type: string;
  session_stage?: number;
  stage_name?: string | null;
  stage_number?: number | null;
  activity_name?: string;
}

// Colores vibrantes para gráficos
const GRADIENT_COLORS = [
  '#667eea',
  '#f093fb',
  '#4facfe',
  '#43e97b',
  '#fa709a',
  '#30cfd0',
  '#ffd89b',
  '#a8edea',
];

const SATISFACTION_COLORS = {
  mucho: '#43e97b',
  si: '#4facfe',
  masomenos: '#ffd89b',
  nomucho: '#fa709a',
  no: '#f5576c',
};

const ENTREPRENEURSHIP_COLORS = {
  ya_tenia: '#667eea',
  me_encantaria: '#43e97b',
  posible_opcion: '#4facfe',
  no_interesa: '#f5576c',
};

export function DetalleSesion() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [reflectionEvaluations, setReflectionEvaluations] = useState<ReflectionEvaluation[]>([]);
  const [teamFiles, setTeamFiles] = useState<{
    prototypes: TeamActivityProgress[];
    pitches: TeamActivityProgress[];
    bubbleMaps: TeamBubbleMap[];
  }>({ prototypes: [], pitches: [], bubbleMaps: [] });
  const [tokenData, setTokenData] = useState<{
    byTeam: { team: string; tokens: number; color: string }[];
    byStage: { stage: string; tokens: number }[];
    byStageAndTeam: Array<{ stage: string; [teamName: string]: number | string }>;
  }>({ byTeam: [], byStage: [], byStageAndTeam: [] });
  const [totalStudents, setTotalStudents] = useState(0);
  const [reflectionResponseRate, setReflectionResponseRate] = useState(0);
  const [selectedPrototype, setSelectedPrototype] = useState<TeamActivityProgress | null>(null);
  const [selectedBubbleMap, setSelectedBubbleMap] = useState<TeamBubbleMap | null>(null);
  const [selectedPitch, setSelectedPitch] = useState<TeamActivityProgress | null>(null);
  const [bubbleMapCanvasSize, setBubbleMapCanvasSize] = useState({ width: 1000, height: 1000 });
  const [bubbleMapViewportSize, setBubbleMapViewportSize] = useState({ width: 0, height: 0 });
  const [bubbleMapZoomLevel, setBubbleMapZoomLevel] = useState(1);
  const bubbleMapContainerRef = useRef<HTMLDivElement | null>(null);
  const bubbleMapCanvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sessionId) {
      loadSessionData();
    }
  }, [sessionId]);

  // Calcular tamaño del canvas del bubble map cuando se abre el modal (ajustar para que quepa completo)
  useEffect(() => {
    if (!selectedBubbleMap) {
      bubbleMapContainerRef.current = null;
      bubbleMapCanvasRef.current = null;
      setBubbleMapViewportSize({ width: 0, height: 0 });
      setBubbleMapCanvasSize({ width: 1000, height: 1000 });
      setBubbleMapZoomLevel(1);
      return;
    }

    const updateBubbleMapSize = () => {
      const container = bubbleMapContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width || container.clientWidth || container.offsetWidth;
      const containerHeight = rect.height || container.clientHeight || container.offsetHeight;

      if (containerWidth > 0 && containerHeight > 0) {
        setBubbleMapViewportSize({ width: containerWidth, height: containerHeight });
        
        // Calcular el tamaño del canvas para que quepa completamente en el viewport
        // Dejar un padding de 40px en cada lado
        const padding = 40;
        const availableWidth = containerWidth - (padding * 2);
        const availableHeight = containerHeight - (padding * 2);
        
        // El canvas base es 1000x1000, pero lo ajustamos para que quepa completamente
        const baseCanvasSize = 1000;
        const scaleX = availableWidth / baseCanvasSize;
        const scaleY = availableHeight / baseCanvasSize;
        // Usar el menor de los dos para que quepa en ambas dimensiones
        const scale = Math.min(scaleX, scaleY);
        
        // Calcular el tamaño ajustado (siempre debe quedar dentro del viewport)
        const width = baseCanvasSize * scale;
        const height = baseCanvasSize * scale;
        
        setBubbleMapCanvasSize({ width, height });
        setBubbleMapZoomLevel(1); // Resetear zoom cuando se calcula el tamaño
      }
    };

    const timeouts = [
      setTimeout(updateBubbleMapSize, 50),
      setTimeout(updateBubbleMapSize, 100),
      setTimeout(updateBubbleMapSize, 200),
      setTimeout(updateBubbleMapSize, 400),
      setTimeout(updateBubbleMapSize, 600),
      setTimeout(updateBubbleMapSize, 800),
      setTimeout(updateBubbleMapSize, 1000)
    ];

    window.addEventListener('resize', updateBubbleMapSize);
    
    let resizeObserver: ResizeObserver | null = null;
    if (bubbleMapContainerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        setTimeout(updateBubbleMapSize, 10);
      });
      resizeObserver.observe(bubbleMapContainerRef.current);
    }

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('resize', updateBubbleMapSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [selectedBubbleMap]);

  // Referencias para rastrear scroll manual
  const bubbleMapHasUserScrolledRef = useRef<boolean>(false);
  const bubbleMapInitialScrollCenteredRef = useRef<boolean>(false);

  // Centrar el scroll del bubble map solo una vez cuando se abre el modal
  useEffect(() => {
    if (!selectedBubbleMap) {
      // Resetear cuando se cierra el modal
      bubbleMapHasUserScrolledRef.current = false;
      bubbleMapInitialScrollCenteredRef.current = false;
      return;
    }

    // Si ya se centró inicialmente, no volver a centrar
    if (bubbleMapInitialScrollCenteredRef.current) return;

    const centerScroll = () => {
      const container = bubbleMapContainerRef.current;
      if (!container) return;

      // Si el usuario ya hizo scroll, no centrar
      if (bubbleMapHasUserScrolledRef.current) return;

      const scrollHeight = container.scrollHeight;
      const scrollWidth = container.scrollWidth;
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;

      if (scrollHeight > 0 && containerHeight > 0 && scrollHeight > containerHeight) {
        container.scrollTop = (scrollHeight - containerHeight) / 2;
      }

      if (scrollWidth > 0 && containerWidth > 0 && scrollWidth > containerWidth) {
        container.scrollLeft = (scrollWidth - containerWidth) / 2;
      }

      // Marcar como centrado inicialmente
      bubbleMapInitialScrollCenteredRef.current = true;
    };

    const waitForContainer = () => {
      if (!bubbleMapContainerRef.current) return false;
      const container = bubbleMapContainerRef.current;
      return container.scrollHeight > 0 && container.scrollWidth > 0;
    };

    // Solo intentar centrar una vez con delays cortos
    const timeouts: NodeJS.Timeout[] = [];
    for (let delay of [50, 100, 200, 400, 600]) {
      timeouts.push(setTimeout(() => {
        if (waitForContainer() && !bubbleMapHasUserScrolledRef.current) {
          centerScroll();
        }
      }, delay));
    }

    // Listener para detectar scroll manual del usuario
    const container = bubbleMapContainerRef.current;
    const handleScroll = () => {
      if (!bubbleMapHasUserScrolledRef.current) {
        bubbleMapHasUserScrolledRef.current = true;
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      timeouts.forEach(clearTimeout);
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [selectedBubbleMap]);

  // Funciones de zoom para bubble map
  const handleBubbleMapZoomIn = () => {
    setBubbleMapZoomLevel(prev => Math.min(prev + 0.25, 3)); // Máximo 3x
  };

  const handleBubbleMapZoomOut = () => {
    setBubbleMapZoomLevel(prev => Math.max(prev - 0.25, 0.5)); // Mínimo 0.5x
  };

  const handleBubbleMapZoomReset = () => {
    setBubbleMapZoomLevel(1);
    // Centrar el scroll después de resetear
    const container = bubbleMapContainerRef.current;
    if (container) {
      const scrollHeight = container.scrollHeight;
      const scrollWidth = container.scrollWidth;
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;
      
      if (scrollHeight > containerHeight) {
        container.scrollTop = (scrollHeight - containerHeight) / 2;
      }
      if (scrollWidth > containerWidth) {
        container.scrollLeft = (scrollWidth - containerWidth) / 2;
      }
    }
  };

  const loadSessionData = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      // Cargar sesión
      const sessionData = await sessionsAPI.getById(sessionId);
      setGameSession(sessionData);

      // Cargar equipos con estudiantes
      const teamsList = await teamsAPI.list({ game_session: sessionId });
      const teamsArray = Array.isArray(teamsList) ? teamsList : [teamsList];
      setTeams(teamsArray);

      // Calcular total de estudiantes
      const total = teamsArray.reduce((sum: number, team: Team) => {
        return sum + (team.students?.length || 0);
      }, 0);
      setTotalStudents(total);

      // Cargar evaluaciones de reflexión
      try {
        const evaluationsData = await reflectionEvaluationsAPI.byRoom(sessionData.room_code);
        const evaluationsArray = Array.isArray(evaluationsData) ? evaluationsData : [evaluationsData];
        setReflectionEvaluations(evaluationsArray);

        // Calcular % de respuestas
        const responseRate = total > 0 ? (evaluationsArray.length / total) * 100 : 0;
        setReflectionResponseRate(responseRate);
      } catch (error) {
        console.error('Error loading evaluations:', error);
        setReflectionEvaluations([]);
        setReflectionResponseRate(0);
      }

      // Cargar archivos de equipos
      await loadTeamFiles(sessionId);

      // Cargar tokens
      await loadTokenData(sessionId, teamsList);
    } catch (error: any) {
      console.error('Error loading session data:', error);
      toast.error('Error al cargar los datos de la sesión');
    } finally {
      setLoading(false);
    }
  };

  const loadTeamFiles = async (sessionId: string) => {
    try {
      // Cargar progresos de actividades (prototipos y pitches)
      // Filtrar por equipos de esta sesión
      const teamsList = await teamsAPI.list({ game_session: sessionId });
      const teamsArray = Array.isArray(teamsList) ? teamsList : [teamsList];
      
      // Obtener progresos de todos los equipos
      const progressPromises = teamsArray.map((team: Team) =>
        teamActivityProgressAPI.list({ team: team.id })
      );
      const progressResponses = await Promise.all(progressPromises);
      const progressList: TeamActivityProgress[] = [];
      progressResponses.forEach((response) => {
        const data = Array.isArray(response) ? response : [response];
        progressList.push(...data);
      });

      const prototypes = progressList.filter(
        (p: TeamActivityProgress) => p.prototype_image_url && p.status === 'completed'
      );
      const pitches = progressList.filter(
        (p: TeamActivityProgress) =>
          (p.pitch_intro_problem || p.pitch_solution || p.pitch_value || p.pitch_impact || p.pitch_closing) && p.status === 'completed'
      );

      // Cargar bubble maps por equipo
      try {
        const bubbleMapsPromises = teamsArray.map((team: Team) =>
          teamBubbleMapsAPI.list({ team: team.id })
        );
        const bubbleMapsResponses = await Promise.all(bubbleMapsPromises);
        const bubbleMapsList: TeamBubbleMap[] = [];
        bubbleMapsResponses.forEach((response) => {
          const data = Array.isArray(response) ? response : [response];
          bubbleMapsList.push(...data);
        });

        setTeamFiles({
          prototypes,
          pitches,
          bubbleMaps: bubbleMapsList,
        });
      } catch (error) {
        console.error('Error loading bubble maps:', error);
        setTeamFiles({ prototypes, pitches, bubbleMaps: [] });
      }
    } catch (error) {
      console.error('Error loading team files:', error);
    }
  };

  const loadTokenData = async (sessionId: string, teamsList: Team[]) => {
    try {
      // Cargar transacciones de tokens
      const tokensList = await tokenTransactionsAPI.list({ game_session: sessionId });
      const tokensArray = Array.isArray(tokensList) ? tokensList : [tokensList];

      // Crear mapa de colores de equipos
      const teamColorMap = new Map<string, string>();
      teamsList.forEach((team) => {
        teamColorMap.set(team.name, team.color);
      });

      // Agrupar por equipo
      const byTeamMap = new Map<string, number>();
      tokensArray.forEach((t: TokenTransaction) => {
        const current = byTeamMap.get(t.team_name) || 0;
        byTeamMap.set(t.team_name, current + t.amount);
      });
      const byTeam = Array.from(byTeamMap.entries())
        .map(([team, tokens]) => ({
          team,
          tokens,
          color: teamColorMap.get(team) || '#667eea',
        }))
        .sort((a, b) => b.tokens - a.tokens);

      // Agrupar por número de etapa (Etapa 1, Etapa 2, Etapa 3, Etapa 4)
      const byStageMap = new Map<number, number>();
      
      // Primero, intentar obtener las etapas desde session_stage para inicializar todas
      let allStageNumbers = [1, 2, 3, 4]; // Por defecto, todas las etapas
      try {
        const stagesData = await sessionsAPI.getSessionStages(Number(sessionId));
        const stagesList = Array.isArray(stagesData) ? stagesData : [stagesData];
        
        if (stagesList.length > 0) {
          // Usar las etapas que realmente existen en la sesión
          allStageNumbers = stagesList
            .map((stage: any) => stage.stage_number)
            .filter((num: number) => num !== null && num !== undefined)
            .sort((a: number, b: number) => a - b);
        }
        
        // Inicializar todas las etapas con 0 tokens
        allStageNumbers.forEach((stageNumber: number) => {
          byStageMap.set(stageNumber, 0);
        });
      } catch (error) {
        console.error('Error loading stages for token grouping:', error);
        // Si hay error, inicializar con etapas por defecto
        allStageNumbers.forEach((stageNumber: number) => {
          byStageMap.set(stageNumber, 0);
        });
      }
      
      // Agregar los tokens reales por etapa
      tokensArray.forEach((t: TokenTransaction) => {
        if (t.stage_number) {
          const current = byStageMap.get(t.stage_number) || 0;
          byStageMap.set(t.stage_number, current + t.amount);
        }
      });
      
      // Convertir a array con formato "Etapa X" y ordenar por número de etapa
      const byStage = Array.from(byStageMap.entries())
        .map(([stageNumber, tokens]) => ({ 
          stage: `Etapa ${stageNumber}`, 
          tokens,
          stageNumber // Mantener el número para ordenar
        }))
        .sort((a, b) => a.stageNumber - b.stageNumber) // Ordenar por número de etapa
        .map(({ stage, tokens }) => ({ stage, tokens })); // Remover stageNumber del resultado final

      // Agrupar por etapa Y por equipo para gráfico de barras múltiples
      const byStageAndTeamMap = new Map<number, Map<string, number>>();
      
      // Inicializar todas las etapas con todos los equipos en 0
      const stageNumbersForGrouping = Array.from(byStageMap.keys()).sort();
      teamsList.forEach((team: Team) => {
        stageNumbersForGrouping.forEach((stageNumber) => {
          if (!byStageAndTeamMap.has(stageNumber)) {
            byStageAndTeamMap.set(stageNumber, new Map<string, number>());
          }
          const teamMap = byStageAndTeamMap.get(stageNumber)!;
          teamMap.set(team.name, 0);
        });
      });
      
      // Agregar los tokens reales por equipo y etapa
      tokensArray.forEach((t: TokenTransaction) => {
        if (t.stage_number) {
          const teamName = t.team_name;
          if (!byStageAndTeamMap.has(t.stage_number)) {
            byStageAndTeamMap.set(t.stage_number, new Map<string, number>());
          }
          const teamMap = byStageAndTeamMap.get(t.stage_number)!;
          const current = teamMap.get(teamName) || 0;
          teamMap.set(teamName, current + t.amount);
        }
      });
      
      // Convertir a formato para gráfico de barras múltiples
      const byStageAndTeam = Array.from(byStageAndTeamMap.entries())
        .sort((a, b) => a[0] - b[0]) // Ordenar por número de etapa
        .map(([stageNumber, teamTokensMap]) => {
          const dataPoint: { stage: string; [teamName: string]: number | string } = {
            stage: `Etapa ${stageNumber}`
          };
          
          // Agregar tokens de cada equipo
          teamTokensMap.forEach((tokens, teamName) => {
            dataPoint[teamName] = tokens;
          });
          
          return dataPoint;
        });

      setTokenData({ byTeam, byStage, byStageAndTeam });
    } catch (error) {
      console.error('Error loading token data:', error);
    }
  };

  // Preparar datos para gráficos
  const satisfactionData = [
    {
      name: 'Sí, mucho',
      value: reflectionEvaluations.filter((e) => e.satisfaction === 'mucho').length,
      color: SATISFACTION_COLORS.mucho,
    },
    {
      name: 'Sí',
      value: reflectionEvaluations.filter((e) => e.satisfaction === 'si').length,
      color: SATISFACTION_COLORS.si,
    },
    {
      name: 'Más o menos',
      value: reflectionEvaluations.filter((e) => e.satisfaction === 'masomenos').length,
      color: SATISFACTION_COLORS.masomenos,
    },
    {
      name: 'No mucho',
      value: reflectionEvaluations.filter((e) => e.satisfaction === 'nomucho').length,
      color: SATISFACTION_COLORS.nomucho,
    },
    {
      name: 'No',
      value: reflectionEvaluations.filter((e) => e.satisfaction === 'no').length,
      color: SATISFACTION_COLORS.no,
    },
  ].filter((item) => item.value > 0);

  const entrepreneurshipData = [
    {
      name: 'Ya tenía ganas',
      value: reflectionEvaluations.filter((e) => e.entrepreneurship_interest === 'ya_tenia').length,
      color: ENTREPRENEURSHIP_COLORS.ya_tenia,
    },
    {
      name: 'Me encantaría',
      value: reflectionEvaluations.filter((e) => e.entrepreneurship_interest === 'me_encantaria').length,
      color: ENTREPRENEURSHIP_COLORS.me_encantaria,
    },
    {
      name: 'Posible opción',
      value: reflectionEvaluations.filter((e) => e.entrepreneurship_interest === 'posible_opcion').length,
      color: ENTREPRENEURSHIP_COLORS.posible_opcion,
    },
    {
      name: 'No interesa',
      value: reflectionEvaluations.filter((e) => e.entrepreneurship_interest === 'no_interesa').length,
      color: ENTREPRENEURSHIP_COLORS.no_interesa,
    },
  ].filter((item) => item.value > 0);

  const valueAreasMap = new Map<string, number>();
  reflectionEvaluations.forEach((e) => {
    e.value_areas?.forEach((area) => {
      const current = valueAreasMap.get(area) || 0;
      valueAreasMap.set(area, current + 1);
    });
  });
  const valueAreasData = Array.from(valueAreasMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const totalResponses = reflectionEvaluations.length;

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* Fondo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
          <motion.div
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-white relative z-10" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <motion.div
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-30"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
              }}
              animate={{
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 p-4 sm:p-6">
        <Button
          onClick={() => navigate('/profesor/historial')}
          className="mb-4 bg-white/90 hover:bg-white text-blue-900 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Historial
        </Button>

        {/* Header con métricas */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-xl p-6 mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
            Sesión: {gameSession?.room_code}
          </h1>
          <p className="text-gray-600 mb-6">{gameSession?.course_name}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Estudiantes</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{totalStudents}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Respuestas</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {reflectionEvaluations.length}
                <span className="text-sm font-normal text-gray-600 ml-1">
                  ({reflectionResponseRate.toFixed(1)}%)
                </span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Equipos</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{teams.length}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Tokens Totales</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {tokenData.byTeam.reduce((sum, t) => sum + t.tokens, 0)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Gráficos de Evaluación */}
        {reflectionEvaluations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-xl p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Evaluaciones de Reflexión
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Satisfacción - Donut Chart */}
              {satisfactionData.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                    Satisfacción con la Actividad
                  </h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={satisfactionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        animationBegin={0}
                        animationDuration={800}
                      >
                        {satisfactionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      {/* Texto central */}
                      <text
                        x="50%"
                        y="45%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '32px', fontWeight: 'bold', fill: '#093c92' }}
                      >
                        {totalResponses}
                      </text>
                      <text
                        x="50%"
                        y="55%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '14px', fill: '#666' }}
                      >
                        Respuestas
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {satisfactionData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interés en Emprender - Donut Chart */}
              {entrepreneurshipData.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                    Interés en Emprender
                  </h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={entrepreneurshipData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        animationBegin={100}
                        animationDuration={800}
                      >
                        {entrepreneurshipData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <text
                        x="50%"
                        y="45%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '32px', fontWeight: 'bold', fill: '#093c92' }}
                      >
                        {totalResponses}
                      </text>
                      <text
                        x="50%"
                        y="55%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: '14px', fill: '#666' }}
                      >
                        Respuestas
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {entrepreneurshipData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-700">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Áreas de Valor - Bar Chart */}
            {valueAreasData.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Áreas de Valor Más Seleccionadas
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={valueAreasData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[0, 8, 8, 0]}
                      animationBegin={200}
                      animationDuration={800}
                    >
                      {valueAreasData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        )}

        {/* Tokens y Rendimiento */}
        {tokenData.byTeam.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-xl p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Tokens y Rendimiento
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tokens por Equipo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Tokens por Equipo</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={tokenData.byTeam} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" />
                    <YAxis dataKey="team" type="category" width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Bar dataKey="tokens" radius={[0, 8, 8, 0]} animationBegin={300} animationDuration={800}>
                      {tokenData.byTeam.map((entry, index) => {
                        // Mapear colores de equipos a hex
                        const colorMap: Record<string, string> = {
                          Verde: '#28a745',
                          Azul: '#007bff',
                          Rojo: '#dc3545',
                          Amarillo: '#ffc107',
                          Naranja: '#fd7e14',
                          Morado: '#6f42c1',
                          Rosa: '#e83e8c',
                          Cian: '#17a2b8',
                          Gris: '#6c757d',
                          Marrón: '#795548',
                        };
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={colorMap[entry.color] || GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Tokens por Etapa - Gráfico de Barras Múltiples */}
              {tokenData.byStageAndTeam.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Tokens por Etapa</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tokenData.byStageAndTeam}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="rect"
                      />
                      {teams.map((team, index) => {
                        // Mapear colores de equipos a hex
                        const colorMap: Record<string, string> = {
                          Verde: '#28a745',
                          Azul: '#007bff',
                          Rojo: '#dc3545',
                          Amarillo: '#ffc107',
                          Naranja: '#fd7e14',
                          Morado: '#6f42c1',
                          Rosa: '#e83e8c',
                          Cian: '#17a2b8',
                          Gris: '#6c757d',
                          Marrón: '#795548',
                        };
                        return (
                          <Bar
                            key={team.name}
                            dataKey={team.name}
                            fill={colorMap[team.color] || GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                            radius={[4, 4, 0, 0]}
                            animationBegin={index * 100}
                            animationDuration={800}
                          />
                        );
                      })}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Archivos por Equipo */}
        {(teamFiles.prototypes.length > 0 ||
          teamFiles.pitches.length > 0 ||
          teamFiles.bubbleMaps.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-xl p-6"
          >
            <h2 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Archivos Subidos por Equipo
            </h2>

            <div className="space-y-6">
              {teams.map((team) => {
                const teamPrototypes = teamFiles.prototypes.filter((p) => p.team_name === team.name);
                const teamPitches = teamFiles.pitches.filter((p) => p.team_name === team.name);
                const teamBubbleMaps = teamFiles.bubbleMaps.filter((b) => b.team_name === team.name);

                if (teamPrototypes.length === 0 && teamPitches.length === 0 && teamBubbleMaps.length === 0) {
                  return null;
                }

                return (
                  <Card key={team.id} className="p-4 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Equipo {team.name} ({team.color})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Prototipos */}
                      {teamPrototypes.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <FileImage className="w-5 h-5 text-purple-600" />
                            Prototipos
                          </h4>
                          <div className="space-y-2">
                            {teamPrototypes.map((prototype) => (
                              <Button
                                key={prototype.id}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-100"
                                onClick={() => setSelectedPrototype(prototype)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {prototype.activity_name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Pitches */}
                      {teamPitches.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Guiones/Pitches
                          </h4>
                          <div className="space-y-2">
                            {teamPitches.map((pitch) => (
                              <Button
                                key={pitch.id}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                                onClick={() => setSelectedPitch(pitch)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {pitch.activity_name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bubble Maps */}
                      {teamBubbleMaps.length > 0 && (
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <Network className="w-5 h-5 text-green-600" />
                            Bubble Maps
                          </h4>
                          <div className="space-y-2">
                            {teamBubbleMaps.map((map) => (
                              <Button
                                key={map.id}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start text-sm text-green-700 hover:text-green-900 hover:bg-green-100"
                                onClick={() => setSelectedBubbleMap(map)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {map.stage_name}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de Prototipo */}
      {selectedPrototype && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPrototype(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPrototype.activity_name}</h3>
                  <p className="text-sm text-gray-600">Equipo {selectedPrototype.team_name} • {selectedPrototype.stage_name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPrototype(null)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {selectedPrototype.prototype_image_url ? (
                <div className="relative w-full rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
                  <img
                    src={(() => {
                      const imageUrl = selectedPrototype.prototype_image_url;
                      // Si la URL ya es completa (empieza con http:// o https://), usarla directamente
                      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
                        return imageUrl;
                      }
                      // Si es relativa, construir la URL completa con la base del backend
                      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                      const backendBaseUrl = apiBaseUrl.replace('/api', '');
                      return `${backendBaseUrl}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
                    })()}
                    alt={`Prototipo de ${selectedPrototype.team_name}`}
                    className="w-full h-auto max-h-[70vh] object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const errorDiv = target.nextElementSibling as HTMLDivElement;
                      if (errorDiv) {
                        errorDiv.style.display = 'flex';
                      }
                    }}
                  />
                  <div className="hidden items-center justify-center p-12 text-gray-500">
                    <div className="text-center">
                      <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold">No se pudo cargar la imagen</p>
                      <p className="text-sm mt-2 break-all">URL: {selectedPrototype.prototype_image_url}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full rounded-lg border-2 border-gray-200 bg-gray-50 p-12 text-center">
                  <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 font-semibold">No hay imagen disponible</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* Modal de Bubble Map */}
      {selectedBubbleMap && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBubbleMap(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Bubble Map</h3>
                  <p className="text-sm text-gray-600">Equipo {selectedBubbleMap.team_name} • {selectedBubbleMap.stage_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Controles de zoom */}
                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBubbleMapZoomOut}
                      className="h-8 w-8 rounded"
                      disabled={bubbleMapZoomLevel <= 0.5}
                      title="Alejar"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-xs font-medium px-2 min-w-[3rem] text-center">
                      {Math.round(bubbleMapZoomLevel * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBubbleMapZoomIn}
                      className="h-8 w-8 rounded"
                      disabled={bubbleMapZoomLevel >= 3}
                      title="Acercar"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleBubbleMapZoomReset}
                      className="h-8 w-8 rounded"
                      title="Restablecer zoom"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedBubbleMap(null)}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              {/* Bubble Map Preview - igual que en la vista del profesor */}
              <div 
                className="relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border-4 mb-4 shadow-lg flex-1 flex flex-col min-h-0"
                style={{ 
                  borderColor: '#28a745',
                  overflow: 'hidden'
                }}
              >
                {/* Contenedor scrollable */}
                <div 
                  ref={(el) => {
                    bubbleMapContainerRef.current = el;
                  }}
                  className="flex-1 overflow-auto"
                  style={{ 
                    minHeight: 0,
                    position: 'relative',
                    width: '100%'
                  }}
                >
                  {/* Contenedor interno que centra el canvas */}
                  <div 
                    className="flex items-center justify-center"
                    style={{
                      height: bubbleMapViewportSize.height > 0 && bubbleMapCanvasSize.height > 0 
                        ? `${bubbleMapViewportSize.height + (bubbleMapCanvasSize.height * bubbleMapZoomLevel)}px` 
                        : 'auto',
                      minHeight: bubbleMapViewportSize.height > 0 && bubbleMapCanvasSize.height > 0 
                        ? `${bubbleMapViewportSize.height + (bubbleMapCanvasSize.height * bubbleMapZoomLevel)}px` 
                        : '100vh',
                      width: bubbleMapViewportSize.width > 0 && bubbleMapCanvasSize.width > 0 
                        ? `${bubbleMapViewportSize.width + (bubbleMapCanvasSize.width * bubbleMapZoomLevel)}px` 
                        : '100%',
                      minWidth: bubbleMapViewportSize.width > 0 && bubbleMapCanvasSize.width > 0 
                        ? `${bubbleMapViewportSize.width + (bubbleMapCanvasSize.width * bubbleMapZoomLevel)}px` 
                        : '100%',
                      padding: '0',
                      boxSizing: 'border-box',
                      paddingTop: bubbleMapViewportSize.height > 0 && bubbleMapCanvasSize.height > 0 
                        ? `${bubbleMapViewportSize.height / 2}px` 
                        : '50vh',
                      paddingBottom: bubbleMapViewportSize.height > 0 && bubbleMapCanvasSize.height > 0 
                        ? `${bubbleMapViewportSize.height / 2}px` 
                        : '50vh',
                      paddingLeft: bubbleMapViewportSize.width > 0 && bubbleMapCanvasSize.width > 0 
                        ? `${bubbleMapViewportSize.width / 2}px` 
                        : '50vw',
                      paddingRight: bubbleMapViewportSize.width > 0 && bubbleMapCanvasSize.width > 0 
                        ? `${bubbleMapViewportSize.width / 2}px` 
                        : '50vw'
                    }}
                  >
                    <div
                      ref={bubbleMapCanvasRef}
                      style={{
                        transform: `scale(${bubbleMapZoomLevel})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.2s ease-out',
                      }}
                    >
                {(() => {
                  const mapData = selectedBubbleMap.map_data;
                  const isNewStructure = mapData && 'questions' in mapData;
                  
                  if (isNewStructure) {
                    const data = mapData as any;
                    const questions = data.questions || [];
                    const personName = data.central?.personName || 'Persona';
                    const profileImageRaw = data.central?.profileImage || '';
                    
                    // Construir URL completa si es relativa
                    const getImageUrl = (imageSrc: string): string => {
                      if (!imageSrc) return '';
                      // Si ya es una URL completa (http:// o https://), usarla directamente
                      if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
                        return imageSrc;
                      }
                      // Si es relativa, construir la URL completa
                      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                      const baseUrl = apiBaseUrl.replace('/api', '');
                      return `${baseUrl}${imageSrc.startsWith('/') ? '' : '/'}${imageSrc}`;
                    };
                    const profileImage = getImageUrl(profileImageRaw);
                    
                    // Usar el tamaño calculado dinámicamente
                    const canvasWidth = bubbleMapCanvasSize.width;
                    const canvasHeight = bubbleMapCanvasSize.height;
                    const centerX = canvasWidth / 2;
                    const centerY = canvasHeight / 2;
                    const centralRadius = 50;
                    const questionRadius = 40;
                    const dynamicRadius = Math.min(canvasWidth, canvasHeight) * 0.20;
                    
                    const getQuestionPosition = (index: number, total: number) => {
                      const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
                      return {
                        x: centerX + dynamicRadius * Math.cos(angle),
                        y: centerY + dynamicRadius * Math.sin(angle),
                        angle
                      };
                    };
                    
                    const getAnswerPosition = (answerIndex: number, totalAnswers: number, questionX: number, questionY: number, questionAngle: number) => {
                      const radius = 250;
                      let angleSpread: number;
                      if (totalAnswers === 1) {
                        angleSpread = 0;
                      } else if (totalAnswers === 2) {
                        angleSpread = 0.5;
                      } else if (totalAnswers === 3) {
                        angleSpread = 0.45;
                      } else if (totalAnswers === 4) {
                        angleSpread = 0.4;
                      } else {
                        angleSpread = 0.35;
                      }
                      const angleOffset = (answerIndex - (totalAnswers - 1) / 2) * angleSpread;
                      const angle = questionAngle + angleOffset;
                      return {
                        x: questionX + radius * Math.cos(angle),
                        y: questionY + radius * Math.sin(angle)
                      };
                    };
                    
                    const getAnswerBubbleRadius = (answerCount: number) => {
                      const totalBubbles = Math.min(answerCount + 1, 4);
                      switch(totalBubbles) {
                        case 1: return 38;
                        case 2: return 34;
                        case 3: return 32;
                        case 4: return 30;
                        default: return 30;
                      }
                    };
                    
                    return (
                      <div 
                        className="relative bg-gradient-to-br from-gray-50 to-white"
                        style={{ 
                          width: canvasWidth, 
                          height: canvasHeight,
                          minWidth: canvasWidth,
                          minHeight: canvasHeight,
                          flexShrink: 0
                        }}
                      >
                        {/* SVG para líneas */}
                        <svg 
                          className="absolute pointer-events-none" 
                          style={{ 
                            left: -300,
                            top: -300,
                            width: canvasWidth + 600,
                            height: canvasHeight + 600,
                            zIndex: 0 
                          }}
                        >
                          {questions.map((question: any, index: number) => {
                            const questionPos = getQuestionPosition(index, questions.length);
                            return (
                              <line
                                key={`line-center-${question.id}`}
                                x1={centerX + 300}
                                y1={centerY + 300}
                                x2={questionPos.x + 300}
                                y2={questionPos.y + 300}
                                stroke="#f757ac"
                                strokeWidth="3"
                                opacity="0.3"
                              />
                            );
                          })}
                          
                          {questions.map((question: any, questionIndex: number) => {
                            const questionPos = getQuestionPosition(questionIndex, questions.length);
                            return (
                              <g key={`question-lines-${question.id}`}>
                                {question.answers.map((answer: any, answerIndex: number) => {
                                  const totalItems = question.answers.length < 5 ? question.answers.length + 1 : question.answers.length;
                                  const answerPos = getAnswerPosition(answerIndex, totalItems, questionPos.x, questionPos.y, questionPos.angle);
                                  return (
                                    <line
                                      key={`line-answer-${question.id}-${answer.id}`}
                                      x1={questionPos.x + 300}
                                      y1={questionPos.y + 300}
                                      x2={answerPos.x + 300}
                                      y2={answerPos.y + 300}
                                      stroke="#a855f7"
                                      strokeWidth="2"
                                      opacity="0.4"
                                    />
                                  );
                                })}
                              </g>
                            );
                          })}
                        </svg>
                        
                        {/* Burbuja central */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", duration: 0.6 }}
                          className="absolute"
                          style={{ 
                            left: centerX,
                            top: centerY,
                            width: centralRadius * 2,
                            height: centralRadius * 2,
                            marginLeft: -centralRadius,
                            marginTop: -centralRadius,
                            zIndex: 10 
                          }}
                        >
                          <div 
                            className="w-full h-full rounded-full shadow-2xl flex flex-col items-center justify-center text-white transition-transform relative overflow-visible p-1"
                            style={{ background: 'linear-gradient(135deg, #f757ac 0%, #d946a0 100%)' }}
                          >
                            <div className="w-full h-full rounded-full overflow-hidden bg-white p-1">
                              {profileImage ? (
                                <img
                                  src={profileImage}
                                  alt={personName}
                                  className="w-full h-full object-cover rounded-full"
                                  onError={(e) => {
                                    console.error('Error loading profile image:', profileImage);
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-full ${profileImage ? 'hidden' : ''}`}>
                                <UserCircle className="w-full h-full text-gray-400" />
                              </div>
                            </div>
                          </div>
                          
                          <div 
                            className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full shadow-xl whitespace-nowrap"
                            style={{ background: '#f757ac' }}
                          >
                            <span className="text-white font-semibold">{personName}</span>
                          </div>
                        </motion.div>
                        
                        {/* Burbujas de preguntas y respuestas */}
                        {questions.map((question: any, questionIndex: number) => {
                          const questionPos = getQuestionPosition(questionIndex, questions.length);
                          
                          return (
                            <div key={question.id}>
                              {/* Burbuja de pregunta */}
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ 
                                  type: "spring", 
                                  duration: 0.5,
                                  delay: questionIndex * 0.1 
                                }}
                                className="absolute"
                                style={{ 
                                  left: questionPos.x,
                                  top: questionPos.y,
                                  width: questionRadius * 2,
                                  height: questionRadius * 2,
                                  marginLeft: -questionRadius,
                                  marginTop: -questionRadius,
                                  zIndex: 5
                                }}
                              >
                                <div
                                  className={`w-full h-full rounded-full ${question.isOptional ? 'bg-amber-500' : 'bg-[#093c92]'} shadow-2xl flex items-center justify-center text-white relative`}
                                >
                                  <span className="text-xs text-center px-3 leading-tight" style={{ hyphens: 'auto', wordBreak: 'break-word' }}>
                                    {question.question}
                                  </span>
                                </div>
                              </motion.div>
                              
                              {/* Burbujas de respuestas */}
                              {question.answers.map((answer: any, answerIndex: number) => {
                                const totalItems = question.answers.length < 5 ? question.answers.length + 1 : question.answers.length;
                                const answerPos = getAnswerPosition(answerIndex, totalItems, questionPos.x, questionPos.y, questionPos.angle);
                                const answerRadius = getAnswerBubbleRadius(question.answers.length);
                                
                                return (
                                  <motion.div
                                    key={answer.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ 
                                      type: "spring", 
                                      duration: 0.4,
                                      delay: questionIndex * 0.1 + answerIndex * 0.05
                                    }}
                                    className="absolute"
                                    style={{ 
                                      left: answerPos.x,
                                      top: answerPos.y,
                                      width: answerRadius * 2,
                                      height: answerRadius * 2,
                                      marginLeft: -answerRadius,
                                      marginTop: -answerRadius,
                                      zIndex: 4
                                    }}
                                  >
                                    <div
                                      className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 to-purple-500 shadow-lg flex items-center justify-center text-white"
                                    >
                                      <span 
                                        className="text-xs text-center px-2 leading-tight"
                                        style={{ 
                                          display: '-webkit-box',
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: 'vertical',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          wordBreak: 'break-word',
                                          hyphens: 'auto'
                                        }}
                                      >
                                        {answer.text}
                                      </span>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else {
                    // Estructura antigua (compatibilidad)
                    return (
                      <div className="text-center py-8 text-gray-500">
                        <p>Formato de bubble map no compatible</p>
                      </div>
                    );
                  }
                })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Modal de Pitch/Guion */}
      {selectedPitch && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPitch(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPitch.activity_name}</h3>
                  <p className="text-sm text-gray-600">Equipo {selectedPitch.team_name} • {selectedPitch.stage_name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedPitch(null)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {selectedPitch.pitch_intro_problem && (
                  <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Introducción del Problema
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedPitch.pitch_intro_problem}</p>
                  </div>
                )}
                
                {selectedPitch.pitch_solution && (
                  <div className="bg-green-50 rounded-lg p-5 border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Solución
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedPitch.pitch_solution}</p>
                  </div>
                )}
                
                {selectedPitch.pitch_value && (
                  <div className="bg-purple-50 rounded-lg p-5 border-l-4 border-purple-500">
                    <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Valor
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedPitch.pitch_value}</p>
                  </div>
                )}
                
                {selectedPitch.pitch_impact && (
                  <div className="bg-orange-50 rounded-lg p-5 border-l-4 border-orange-500">
                    <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Impacto
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedPitch.pitch_impact}</p>
                  </div>
                )}
                
                {selectedPitch.pitch_closing && (
                  <div className="bg-pink-50 rounded-lg p-5 border-l-4 border-pink-500">
                    <h4 className="font-semibold text-pink-900 mb-2 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Cierre
                    </h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedPitch.pitch_closing}</p>
                  </div>
                )}
                
                {!selectedPitch.pitch_intro_problem && 
                 !selectedPitch.pitch_solution && 
                 !selectedPitch.pitch_value && 
                 !selectedPitch.pitch_impact && 
                 !selectedPitch.pitch_closing && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay contenido disponible para este guion</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

