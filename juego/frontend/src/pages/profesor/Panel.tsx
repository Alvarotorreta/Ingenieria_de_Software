import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Plus,
  History,
  Target,
  BookOpen,
  LogOut,
  GraduationCap,
  Users,
  FileSpreadsheet,
  Loader2,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api, { authAPI } from '@/services/api';
import { toast } from 'sonner';

interface Professor {
  id: number;
  full_name?: string;
  user?: {
    username: string;
  };
}

interface GameSession {
  id: number;
  room_code: string;
  status: 'lobby' | 'running' | 'completed' | 'cancelled';
  course_name?: string;
  created_at: string;
  started_at?: string;
  ended_at?: string;
  current_stage_name?: string;
  current_stage_number?: number;
  current_activity_name?: string;
}

interface Faculty {
  id: number;
  name: string;
}

interface Career {
  id: number;
  name: string;
}

interface Course {
  id: number;
  name: string;
}

interface LearningObjective {
  id: number;
  title: string;
  description?: string;
  evaluation_criteria?: string;
  pedagogical_recommendations?: string;
  estimated_time?: number;
  stage_name?: string;
}

type Section = 'dashboard' | 'create-session' | 'history' | 'learning-objectives' | 'tutorial';

export function ProfesorPanel() {
  const navigate = useNavigate();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [activeSession, setActiveSession] = useState<GameSession | null>(null);
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sessions: 0, students: 0 });

  // Formulario crear sesión
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [creatingSession, setCreatingSession] = useState(false);

  // Historial
  const [historySessions, setHistorySessions] = useState<GameSession[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Objetivos de aprendizaje
  const [learningObjectives, setLearningObjectives] = useState<LearningObjective[]>([]);
  const [loadingObjectives, setLoadingObjectives] = useState(false);

  // Tutorial accordions
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set(['checklist']));

  useEffect(() => {
    checkAuth();
    
    // Refrescar datos del panel cada 5 segundos si hay una sesión activa
    const interval = setInterval(() => {
      loadActiveSession();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentSection === 'history') {
      loadHistory();
    } else if (currentSection === 'learning-objectives') {
      loadLearningObjectives();
    }
  }, [currentSection]);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/profesor/login');
      return;
    }

    try {
      const profile = await authAPI.getProfile();
      setProfessor(profile);
      await loadPanelData();
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      navigate('/profesor/login');
    }
  };

  const loadPanelData = async () => {
    setLoading(true);
    try {
      // Cargar sesión activa
      await loadActiveSession();

      // Cargar todas las sesiones
      const response = await api.get('/sessions/game-sessions/');
      const data = response.data;
      const sessionsList = data.results || data;
      setSessions(sessionsList);
      setStats({ sessions: data.count || sessionsList.length, students: 0 });

      // Cargar facultades
      await loadFaculties();
    } catch (error) {
      console.error('Error loading panel:', error);
      toast.error('Error al cargar el panel');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveSession = async () => {
    try {
      const response = await api.get('/sessions/game-sessions/active_session/');
      const session = response.data.active_session || response.data;
      if (session && session !== null) {
        // Verificar si está en reflexión (etapa 4 sin actividad)
        if (session.current_stage_number === 4 && !session.current_activity_name) {
          // Verificar si hay flag de reflexión en el SessionStage
          try {
            const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${session.id}`);
            const stagesData = stagesResponse.data.results || stagesResponse.data;
            if (Array.isArray(stagesData)) {
              const stage4 = stagesData.find((s: any) => s.stage_number === 4);
              if (stage4?.presentation_timestamps?._reflection === true) {
                // Está en reflexión, actualizar el nombre de actividad
                session.current_activity_name = 'Reflexión';
              }
            }
          } catch (error) {
            // Si no se puede verificar, asumir que está en resultados
            console.warn('No se pudo verificar estado de reflexión:', error);
          }
        }
        setActiveSession(session);
      } else {
        setActiveSession(null);
      }
    } catch (error) {
      setActiveSession(null);
    }
  };

  const loadFaculties = async () => {
    try {
      const response = await api.get('/academic/faculties/');
      const data = response.data;
      setFaculties(data.results || data);
    } catch (error) {
      console.error('Error loading faculties:', error);
    }
  };

  const loadCareers = async (facultyId: string) => {
    setSelectedCareer('');
    setSelectedCourse('');
    setCareers([]);
    setCourses([]);
    
    try {
      const response = await api.get(`/academic/careers/?faculty=${facultyId}`);
      const data = response.data;
      setCareers(data.results || data);
    } catch (error) {
      console.error('Error loading careers:', error);
      toast.error('Error al cargar carreras');
    }
  };

  const loadCourses = async (careerId: string) => {
    setSelectedCourse('');
    setCourses([]);
    
    try {
      const response = await api.get(`/academic/courses/?career=${careerId}`);
      const data = response.data;
      setCourses(data.results || data);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Error al cargar cursos');
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await api.get('/sessions/game-sessions/?ordering=-created_at');
      const data = response.data;
      const sessionsList = data.results || data;
      setHistorySessions(sessionsList);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Error al cargar historial');
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadLearningObjectives = async () => {
    setLoadingObjectives(true);
    try {
      const response = await api.get('/challenges/learning-objectives/');
      const data = response.data;
      setLearningObjectives(data.results || data);
    } catch (error) {
      console.error('Error loading objectives:', error);
      toast.error('Error al cargar objetivos');
    } finally {
      setLoadingObjectives(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFaculty || !selectedCareer || !selectedCourse) {
      toast.error('Por favor completa todos los campos: Facultad, Carrera y Curso');
      return;
    }

    if (!excelFile) {
      toast.error('Por favor selecciona un archivo Excel');
      return;
    }

    setCreatingSession(true);

    try {
      const formData = new FormData();
      formData.append('file', excelFile);
      formData.append('course_id', selectedCourse);
      formData.append('min_team_size', '3');
      formData.append('max_team_size', '8');

      // No establecer Content-Type manualmente - el navegador lo hace automáticamente con FormData
      const response = await api.post('/sessions/game-sessions/create_with_excel/', formData);

      const data = response.data;

      toast.success(
        `¡Sala creada exitosamente! Código: ${data.game_session.room_code}. ` +
        `${data.students_processed} estudiantes procesados, ` +
        `${data.teams_created} equipos creados automáticamente.`
      );

      // Recargar sesión activa
      await loadActiveSession();

      // Redirigir al lobby después de 2 segundos
      setTimeout(() => {
        navigate(`/profesor/lobby/${data.game_session.id}`);
      }, 2000);
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData?.error === 'Ya tienes una sesión activa' && errorData.active_session_id) {
        const continueMsg = `Ya tienes una sesión activa (Sala: ${errorData.active_session_room_code}). ¿Deseas continuar con esa sesión?`;
        if (confirm(continueMsg)) {
          if (errorData.active_session_status === 'lobby') {
            window.location.href = `/lobby/${errorData.active_session_id}/`;
          } else {
            window.location.href = `/game-control/${errorData.active_session_id}/`;
          }
        } else {
          toast.error(errorData.message || errorData.error);
        }
      } else {
        toast.error(errorData?.error || 'Error al crear la sesión');
      }
    } finally {
      setCreatingSession(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    navigate('/profesor/login');
  };

  const continueActiveSession = async () => {
    if (!activeSession) return;

    if (activeSession.status === 'lobby') {
      navigate(`/profesor/lobby/${activeSession.id}`);
    } else if (activeSession.status === 'running') {
      // Determinar URL según etapa y actividad
      const activityName = (activeSession.current_activity_name || '').toLowerCase();
      const stageNumber = activeSession.current_stage_number || 1;

      let redirectUrl = '';
      if (stageNumber === 1) {
        if (activityName.includes('personaliz')) {
          redirectUrl = `/profesor/etapa1/personalizacion/${activeSession.id}/`;
        } else if (activityName.includes('presentaci')) {
          redirectUrl = `/profesor/etapa1/presentacion/${activeSession.id}/`;
        } else {
          redirectUrl = `/profesor/etapa1/personalizacion/${activeSession.id}/`;
        }
      } else if (stageNumber === 2) {
        if (activityName.includes('tema') || activityName.includes('seleccionar')) {
          redirectUrl = `/profesor/etapa2/seleccionar-tema/${activeSession.id}/`;
        } else if (activityName.includes('bubble') || activityName.includes('mapa')) {
          redirectUrl = `/profesor/etapa2/bubble-map/${activeSession.id}/`;
        } else {
          redirectUrl = `/profesor/etapa2/seleccionar-tema/${activeSession.id}/`;
        }
      } else if (stageNumber === 3) {
        redirectUrl = `/profesor/etapa3/prototipo/${activeSession.id}/`;
      } else if (stageNumber === 4) {
        // Si no hay actividad, verificar si está en reflexión
        if (!activityName || activityName.trim() === '') {
          // Verificar si hay flag de reflexión
          try {
            const stagesResponse = await api.get(`/sessions/session-stages/?game_session=${activeSession.id}`);
            const stagesData = stagesResponse.data.results || stagesResponse.data;
            if (Array.isArray(stagesData)) {
              const stage4 = stagesData.find((s: any) => s.stage_number === 4);
              if (stage4?.presentation_timestamps?._reflection === true) {
                // Está en reflexión, ir a reflexión
                redirectUrl = `/profesor/reflexion/${activeSession.id}`;
              } else {
                // No está en reflexión, ir a resultados
                redirectUrl = `/profesor/resultados/${activeSession.id}/?stage_id=4`;
              }
            } else {
              redirectUrl = `/profesor/resultados/${activeSession.id}/?stage_id=4`;
            }
          } catch (error) {
            console.warn('No se pudo verificar estado de reflexión:', error);
            redirectUrl = `/profesor/resultados/${activeSession.id}/?stage_id=4`;
          }
        } else if (activityName.includes('presentacion') || activityName.includes('presentación')) {
          redirectUrl = `/profesor/etapa4/presentacion-pitch/${activeSession.id}/`;
        } else {
          redirectUrl = `/profesor/etapa4/formulario-pitch/${activeSession.id}/`;
        }
      } else {
        redirectUrl = `/profesor/etapa1/personalizacion/${activeSession.id}/`;
      }

      window.location.href = redirectUrl;
    }
  };

  const handleFinishSession = async () => {
    if (!activeSession) return;

    if (!confirm('¿Estás seguro de que deseas finalizar esta sesión? Se desconectarán todas las tablets y no podrás acceder al lobby nuevamente.')) {
      return;
    }

    if (!confirm('⚠️ ADVERTENCIA: Esta acción no se puede deshacer. ¿Continuar?')) {
      return;
    }

    try {
      const response = await api.post(`/sessions/game-sessions/${activeSession.id}/end/`);

      if (response.data) {
        toast.success(
          `¡Sesión finalizada exitosamente! Se desconectaron ${response.data.tablets_disconnected || 0} tablets.`
        );
        
        // Recargar datos del panel
        await loadPanelData();
      }
    } catch (error: any) {
      console.error('Error finalizing session:', error);
      toast.error(
        error.response?.data?.error || 'Error al finalizar la sesión'
      );
    }
  };

  const viewSessionDetail = (sessionId: number) => {
    navigate(`/profesor/lobby/${sessionId}`);
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      lobby: 'Lobby',
      running: 'En Curso',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classMap: Record<string, string> = {
      lobby: 'bg-yellow-100 text-yellow-800',
      running: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
  };

  const toggleAccordion = (id: string) => {
    const newOpen = new Set(openAccordions);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenAccordions(newOpen);
  };

  const getStageName = (stageName: string) => {
    const stageMap: Record<string, string> = {
      'Etapa 1': '🎯 Etapa 1: Trabajo en Equipo',
      'Etapa 2': '💡 Etapa 2: Empatía',
      'Etapa 3': '🧩 Etapa 3: Creatividad',
      'Etapa 4': '📢 Etapa 4: Comunicación',
      'General': '📖 Objetivos Generales',
    };
    return stageMap[stageName] || stageName;
  };

  const recentSessions = sessions
    .filter((s) => !activeSession || s.id !== activeSession.id)
    .filter((s) => s.status !== 'lobby' && s.status !== 'running')
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#093c92] via-blue-600 to-[#f757ac] p-4 sm:p-6 w-full">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#093c92] flex items-center gap-2 sm:gap-3">
                <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                Panel del Profesor
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                {professor?.full_name || professor?.user?.username || 'Profesor'}
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="flex items-center gap-2 w-full sm:w-auto text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-gradient-to-br from-[#093c92] to-[#1e5bb8] text-white p-4 sm:p-6 rounded-xl shadow-lg">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{stats.sessions}</div>
              <div className="text-xs sm:text-sm opacity-90">Sesiones Realizadas</div>
            </div>
            <div className="bg-gradient-to-br from-[#f757ac] to-[#e91e63] text-white p-4 sm:p-6 rounded-xl shadow-lg">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">{stats.students}</div>
              <div className="text-xs sm:text-sm opacity-90">Estudiantes Participantes</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-4 sm:mt-6 border-b-2 border-gray-200 overflow-x-auto">
            {[
              { id: 'dashboard' as Section, label: 'Dashboard', icon: LayoutDashboard },
              { id: 'create-session' as Section, label: 'Crear Sala', icon: Plus },
              { id: 'history' as Section, label: 'Historial', icon: History },
              { id: 'learning-objectives' as Section, label: 'Objetivos', icon: Target },
              { id: 'tutorial' as Section, label: 'Tutorial', icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentSection(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 font-semibold transition-all relative text-xs sm:text-sm whitespace-nowrap ${
                    currentSection === tab.id
                      ? 'text-[#093c92]'
                      : 'text-gray-500 hover:text-[#093c92]'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  {currentSection === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#093c92]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
          {/* Dashboard */}
          {currentSection === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[#093c92]">Resumen de Actividad</h2>

              {/* Active Session Card */}
              {activeSession && (
                <div className="bg-gradient-to-br from-[#093c92] to-[#1e5bb8] text-white p-4 sm:p-6 rounded-xl shadow-lg">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-3 sm:mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">🎮 Sesión Activa</h3>
                      <p className="opacity-90 text-sm sm:text-base">
                        Sala: <strong>{activeSession.room_code}</strong>
                      </p>
                    </div>
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusClass(activeSession.status)}`}>
                      {getStatusText(activeSession.status)}
                    </span>
                  </div>
                  <div className="mb-3 sm:mb-4 space-y-1">
                    <p className="opacity-90 text-xs sm:text-sm">Curso: {activeSession.course_name || '---'}</p>
                    <p className="opacity-90 text-xs sm:text-sm">
                      Etapa {activeSession.current_stage_number || ''}: {activeSession.current_stage_name || 'No iniciada'}
                    </p>
                    <p className="opacity-90 text-xs sm:text-sm">
                      Actividad: {activeSession.current_activity_name || (activeSession.current_stage_number === 4 ? 'Resultados' : 'No iniciada')}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button
                      onClick={continueActiveSession}
                      className="bg-white text-[#093c92] hover:bg-gray-100 w-full sm:w-auto text-sm sm:text-base"
                    >
                      Continuar Sesión
                    </Button>
                    <Button
                      onClick={handleFinishSession}
                      variant="outline"
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      Finalizar Sesión
                    </Button>
                  </div>
                </div>
              )}

              {/* Recent Sessions */}
              {recentSessions.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#093c92] mb-3 sm:mb-4">Sesiones Recientes</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {recentSessions.map((session) => (
                      <div
                        key={session.id}
                        onClick={() => viewSessionDetail(session.id)}
                        className="bg-gray-50 p-3 sm:p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-[#093c92]"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                          <h4 className="font-semibold text-[#093c92] text-sm sm:text-base">
                            Sala: {session.room_code}
                          </h4>
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusClass(session.status)}`}
                          >
                            {getStatusText(session.status)}
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm">{session.course_name || 'Curso'}</p>
                        <p className="text-gray-400 text-[10px] sm:text-xs mt-1">
                          {session.ended_at
                            ? `Finalizada: ${new Date(session.ended_at).toLocaleDateString('es-CL')}`
                            : session.started_at
                            ? `Iniciada: ${new Date(session.started_at).toLocaleDateString('es-CL')}`
                            : `Creada: ${new Date(session.created_at).toLocaleDateString('es-CL')}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recentSessions.length === 0 && !activeSession && (
                <p className="text-center text-gray-500 py-8">
                  No hay sesiones recientes. Crea una nueva sesión para comenzar.
                </p>
              )}
            </motion.div>
          )}

          {/* Create Session */}
          {currentSection === 'create-session' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4 sm:mb-6">Crear Nueva Sala</h2>
              <form onSubmit={handleCreateSession} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="faculty" className="text-sm sm:text-base">Facultad</Label>
                    <select
                      id="faculty"
                      value={selectedFaculty}
                      onChange={(e) => {
                        setSelectedFaculty(e.target.value);
                        if (e.target.value) {
                          loadCareers(e.target.value);
                        } else {
                          setCareers([]);
                          setCourses([]);
                        }
                      }}
                      className="w-full h-11 sm:h-12 px-3 border-2 border-gray-300 rounded-lg focus:border-[#093c92] text-sm sm:text-base"
                      required
                    >
                      <option value="">Seleccionar Facultad...</option>
                      {faculties.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="career" className="text-sm sm:text-base">Carrera</Label>
                    <select
                      id="career"
                      value={selectedCareer}
                      onChange={(e) => {
                        setSelectedCareer(e.target.value);
                        if (e.target.value) {
                          loadCourses(e.target.value);
                        } else {
                          setCourses([]);
                        }
                      }}
                      disabled={!selectedFaculty}
                      className="w-full h-11 sm:h-12 px-3 border-2 border-gray-300 rounded-lg focus:border-[#093c92] disabled:opacity-50 text-sm sm:text-base"
                      required
                    >
                      <option value="">
                        {selectedFaculty ? 'Seleccionar Carrera...' : 'Primero selecciona una Facultad'}
                      </option>
                      {careers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="course" className="text-sm sm:text-base">Curso</Label>
                    <select
                      id="course"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      disabled={!selectedCareer}
                      className="w-full h-11 sm:h-12 px-3 border-2 border-gray-300 rounded-lg focus:border-[#093c92] disabled:opacity-50 text-sm sm:text-base"
                      required
                    >
                      <option value="">
                        {selectedCareer ? 'Seleccionar Curso...' : 'Primero selecciona una Carrera'}
                      </option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="excelFile" className="flex items-center gap-2 text-sm sm:text-base">
                    <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4" />
                    Archivo Excel con Estudiantes (XLSX)
                  </Label>
                  <Input
                    id="excelFile"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
                    className="mt-2 text-xs sm:text-sm"
                    required
                  />
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                    Columnas requeridas: Nombre completo, Correo UDD, RUT
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={creatingSession}
                  className="w-full h-11 sm:h-12 bg-[#f757ac] hover:bg-[#f757ac]/90 text-sm sm:text-base"
                >
                  {creatingSession ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                      Creando Sala...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Crear Sala
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          )}

          {/* History */}
          {currentSection === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4 sm:mb-6">Historial de Sesiones</h2>
              {loadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-[#093c92]" />
                </div>
              ) : historySessions.length === 0 ? (
                <p className="text-center text-gray-500 py-8 text-sm sm:text-base">
                  No hay sesiones registradas aún.
                </p>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {historySessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => viewSessionDetail(session.id)}
                      className="bg-gray-50 p-3 sm:p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-[#093c92]"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                        <h4 className="font-semibold text-[#093c92] text-sm sm:text-base">
                          Sala: {session.room_code}
                        </h4>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusClass(session.status)}`}
                        >
                          {getStatusText(session.status)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm">{session.course_name || 'Curso'}</p>
                      <p className="text-gray-400 text-[10px] sm:text-xs mt-1">
                        {session.started_at
                          ? `Iniciada: ${new Date(session.started_at).toLocaleDateString('es-CL')}`
                          : session.status === 'lobby'
                          ? 'En lobby - Click para ver'
                          : 'No iniciada'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Learning Objectives */}
          {currentSection === 'learning-objectives' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4 sm:mb-6">Objetivos de Aprendizaje</h2>
              {loadingObjectives ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#093c92]" />
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(
                    learningObjectives.reduce((acc, obj) => {
                      const stageName = obj.stage_name || 'General';
                      if (!acc[stageName]) acc[stageName] = [];
                      acc[stageName].push(obj);
                      return acc;
                    }, {} as Record<string, LearningObjective[]>)
                  ).map(([stageName, objs]) => (
                    <div
                      key={stageName}
                      className="bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200"
                    >
                      <button
                        onClick={() => toggleAccordion(stageName)}
                        className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center font-semibold text-left"
                      >
                        <span>{getStageName(stageName)}</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            openAccordions.has(stageName) ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openAccordions.has(stageName) && (
                        <div className="p-4 space-y-4">
                          {objs.map((obj) => (
                            <div
                              key={obj.id}
                              className="bg-white p-4 rounded-lg border border-gray-200"
                            >
                              <h4 className="font-semibold text-[#093c92] mb-2">{obj.title}</h4>
                              {obj.description && (
                                <p className="text-gray-600 text-sm mb-2">{obj.description}</p>
                              )}
                              {obj.evaluation_criteria && (
                                <p className="text-sm">
                                  <strong>Criterios de Evaluación:</strong> {obj.evaluation_criteria}
                                </p>
                              )}
                              {obj.pedagogical_recommendations && (
                                <p className="text-sm">
                                  <strong>Recomendaciones:</strong> {obj.pedagogical_recommendations}
                                </p>
                              )}
                              {obj.estimated_time && (
                                <p className="text-sm">
                                  <strong>Tiempo Estimado:</strong> {obj.estimated_time} minutos
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Tutorial */}
          {currentSection === 'tutorial' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[#093c92] mb-4 sm:mb-6">Tutorial y Guía</h2>
              <div className="space-y-3">
                {/* Checklist */}
                <div className="bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
                  <button
                    onClick={() => toggleAccordion('checklist')}
                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center font-semibold text-left"
                  >
                    <span>📋 Checklist Previo a la Sesión</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        openAccordions.has('checklist') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordions.has('checklist') && (
                    <div className="p-4 space-y-2">
                      {[
                        'Archivo XLSX con estudiantes correcto (Nombre, Correo UDD, RUT)',
                        'Tablets listas y cargadas (1 por cada equipo)',
                        'Códigos QR generados para acceso de tablets',
                        'Material físico preparado (Legos para prototipos, etc.)',
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 bg-white rounded">
                          <CheckCircle2 className="w-5 h-5 text-gray-400" />
                          <label className="text-sm">{item}</label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Guía Paso a Paso */}
                <div className="bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
                  <button
                    onClick={() => toggleAccordion('guia')}
                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center font-semibold text-left"
                  >
                    <span>📹 Guía Paso a Paso</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        openAccordions.has('guia') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordions.has('guia') && (
                    <div className="p-4">
                      <ol className="space-y-2 list-decimal list-inside text-sm">
                        <li>
                          <strong>Crear Sala:</strong> Selecciona Facultad, Carrera, Curso y sube
                          el archivo XLSX con estudiantes
                        </li>
                        <li>
                          <strong>Lobby:</strong> Revisa los equipos generados automáticamente,
                          espera que todas las tablets se conecten
                        </li>
                        <li>
                          <strong>Iniciar Juego:</strong> Una vez todas las tablets conectadas,
                          presiona "Iniciar Juego"
                        </li>
                        <li>
                          <strong>Control de Etapas:</strong> Controla cada etapa y actividad, puedes
                          avanzar cuando todos terminen o el temporizador expire
                        </li>
                        <li>
                          <strong>Validar Retos:</strong> En cada ruleta, valida los retos
                          completados por los equipos
                        </li>
                        <li>
                          <strong>Ver Resultados:</strong> Al finalizar, revisa los resultados y
                          métricas de cada equipo
                        </li>
                      </ol>
                    </div>
                  )}
                </div>

                {/* FAQ */}
                <div className="bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
                  <button
                    onClick={() => toggleAccordion('faq')}
                    className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 flex justify-between items-center font-semibold text-left"
                  >
                    <span>❓ FAQ y Soluciones Rápidas</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        openAccordions.has('faq') ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openAccordions.has('faq') && (
                    <div className="p-4 space-y-4">
                      <div>
                        <strong>Q: ¿Qué hacer si una tablet no se conecta?</strong>
                        <p className="text-sm text-gray-600 mt-1">
                          A: Verifica que el código QR sea correcto. Puedes desconectar y reconectar
                          la tablet desde el lobby.
                        </p>
                      </div>
                      <div>
                        <strong>Q: ¿Qué hacer si falta un equipo?</strong>
                        <p className="text-sm text-gray-600 mt-1">
                          A: Puedes reorganizar los equipos manualmente desde el lobby antes de
                          iniciar el juego.
                        </p>
                      </div>
                      <div>
                        <strong>Q: ¿Cómo interpretar las métricas?</strong>
                        <p className="text-sm text-gray-600 mt-1">
                          A: Los tokens reflejan participación y completitud. Los tiempos muestran
                          eficiencia. La participación mide el compromiso del equipo.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

