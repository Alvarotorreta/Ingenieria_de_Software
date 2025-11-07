import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from './components/ui/sonner';

// Profesor Routes
import ProfesorRegistro from './pages/profesor/Registro';
import ProfesorLogin from './pages/profesor/Login';
import ProfesorHome from './pages/profesor/Home';
import ProfesorTutorial from './pages/profesor/Tutorial';
import ProfesorHistorial from './pages/profesor/Historial';
import ProfesorObjetivos from './pages/profesor/Objetivos';
import ProfesorCrearSala from './pages/profesor/CrearSala';
import ProfesorSala from './pages/profesor/Sala';
import ProfesorPersonalizacion from './pages/profesor/PersonalizacionGrupos';
import ProfesorEtapa1 from './pages/profesor/Etapa1';
import ProfesorEleccionTematica from './pages/profesor/EleccionTematica';
import ProfesorEtapa2 from './pages/profesor/Etapa2';
import ProfesorBubbleMap from './pages/profesor/BubbleMap';
import ProfesorEtapa3Resultados from './pages/profesor/Etapa3Resultados';
import ProfesorEtapa3Lego from './pages/profesor/Etapa3Lego';
import ProfesorEtapa4Preparar from './pages/profesor/Etapa4Preparar';
import ProfesorEtapa4Realizar from './pages/profesor/Etapa4Realizar';
import ProfesorResultadosFinales from './pages/profesor/ResultadosFinales';
import ProfesorReflexion from './pages/profesor/Reflexion';

// Tablet Routes (Grupo)
import TabletInicio from './pages/tablet/Inicio';
import TabletSala from './pages/tablet/Sala';
import TabletEntrar from './pages/tablet/Entrar';
import TabletIntroduccion from './pages/tablet/Introduccion';
import TabletVideo from './pages/tablet/Video';
import TabletEleccionTematica from './pages/tablet/EleccionTematica';
import TabletDesafio from './pages/tablet/Desafio';
import TabletBubbleMap from './pages/tablet/BubbleMap';
import TabletResultadosEtapa2 from './pages/tablet/ResultadosEtapa2';
import TabletInicioEtapa3 from './pages/tablet/InicioEtapa3';
import TabletEtapa3Lego from './pages/tablet/Etapa3Lego';
import TabletResultadosEtapa3 from './pages/tablet/ResultadosEtapa3';
import TabletInicioEtapa4 from './pages/tablet/InicioEtapa4';
import TabletCrearPitch from './pages/tablet/CrearPitch';
import TabletRealizarPitch from './pages/tablet/RealizarPitch';
import TabletResultados from './pages/tablet/Resultados';
import TabletReflexion from './pages/tablet/Reflexion';
import TabletMiniJuego from './pages/tablet/MiniJuego';

// Estudiante Routes (Evaluación individual)
import EstudianteEntrar from './pages/estudiante/Entrar';
import EstudianteEvaluar from './pages/estudiante/Evaluar';
import EstudianteGracias from './pages/estudiante/Gracias';

// Admin Routes
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminJuegos from './pages/admin/Juegos';
import AdminMetricas from './pages/admin/Metricas';
import AdminEvaluaciones from './pages/admin/Evaluaciones';
import AdminConfiguracion from './pages/admin/Configuracion';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <div className="min-h-screen">
            <Routes>
            {/* Root and preview routes */}
            <Route path="/" element={<Navigate to="/profesor/login" replace />} />
            <Route path="/preview_page.html" element={<Navigate to="/profesor/login" replace />} />

            {/* Profesor Routes */}
            <Route path="/profesor">
              <Route path="registro" element={<ProfesorRegistro />} />
              <Route path="login" element={<ProfesorLogin />} />
              <Route path="home" element={<ProfesorHome />} />
              <Route path="tutorial" element={<ProfesorTutorial />} />
              <Route path="historial" element={<ProfesorHistorial />} />
              <Route path="objetivos" element={<ProfesorObjetivos />} />
              <Route path="crear-sala" element={<ProfesorCrearSala />} />
              <Route path="sala/:salaId" element={<ProfesorSala />} />
              <Route path="personalizacion-grupos" element={<ProfesorPersonalizacion />} />
              <Route path="etapa1" element={<ProfesorEtapa1 />} />
              <Route path="eleccion-tematica" element={<ProfesorEleccionTematica />} />
              <Route path="etapa2" element={<ProfesorEtapa2 />} />
              <Route path="bubble-map" element={<ProfesorBubbleMap />} />
              <Route path="etapa3-lego" element={<ProfesorEtapa3Lego />} />
              <Route path="etapa3-resultados" element={<ProfesorEtapa3Resultados />} />
              <Route path="etapa4-preparar" element={<ProfesorEtapa4Preparar />} />
              <Route path="etapa4-realizar" element={<ProfesorEtapa4Realizar />} />
              <Route path="reflexion" element={<ProfesorReflexion />} />
              <Route path="resultados-finales" element={<ProfesorResultadosFinales />} />
            </Route>

            {/* Tablet Routes */}
            <Route path="/tablet">
              <Route path="inicio" element={<TabletInicio />} />
              <Route path="entrar" element={<TabletEntrar />} />
              <Route path="sala" element={<TabletSala />} />
              <Route path="introduccion" element={<TabletIntroduccion />} />
              <Route path="mini-juego" element={<TabletMiniJuego />} />
              <Route path="video" element={<TabletVideo />} />
              <Route path="eleccion-tematica" element={<TabletEleccionTematica />} />
              <Route path="desafio" element={<TabletDesafio />} />
              <Route path="bubble-map" element={<TabletBubbleMap />} />
              <Route path="resultados-etapa2" element={<TabletResultadosEtapa2 />} />
              <Route path="inicio-etapa3" element={<TabletInicioEtapa3 />} />
              <Route path="etapa3-lego" element={<TabletEtapa3Lego />} />
              <Route path="resultados-etapa3" element={<TabletResultadosEtapa3 />} />
              <Route path="inicio-etapa4" element={<TabletInicioEtapa4 />} />
              <Route path="crear-pitch" element={<TabletCrearPitch />} />
              <Route path="realizar-pitch" element={<TabletRealizarPitch />} />
              <Route path="resultados" element={<TabletResultados />} />
              <Route path="reflexion" element={<TabletReflexion />} />
            </Route>

            {/* Estudiante Routes */}
            <Route path="/estudiante">
              <Route path="entrar" element={<EstudianteEntrar />} />
              <Route path="evaluar" element={<EstudianteEvaluar />} />
              <Route path="gracias" element={<EstudianteGracias />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="login" element={<AdminLogin />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="juegos" element={<AdminJuegos />} />
              <Route path="metricas" element={<AdminMetricas />} />
              <Route path="evaluaciones" element={<AdminEvaluaciones />} />
              <Route path="configuracion" element={<AdminConfiguracion />} />
            </Route>

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/profesor/login" replace />} />
            </Routes>
            <Toaster richColors position="top-center" />
          </div>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}