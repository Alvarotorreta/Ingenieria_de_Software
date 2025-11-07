import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { Toaster } from './components/ui/sonner';

// Main Selection
import SeleccionUsuario from './pages/SeleccionUsuario';

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
import TabletIntroduccion from './pages/tablet/Introduccion';
import TabletSala from './pages/tablet/Sala';
import TabletEntrar from './pages/tablet/Entrar';
import TabletPersonalizarEquipo from './pages/tablet/PersonalizarEquipo';
import TabletPresentacionGrupo from './pages/tablet/PresentacionGrupo';
import TabletRompeHielos from './pages/tablet/RompeHielos';
import TabletMiniQuiz from './pages/tablet/MiniQuiz';
import TabletVideo from './pages/tablet/Video';
import TabletEleccionTematica from './pages/tablet/EleccionTematica';
import TabletVideoDesafio from './pages/tablet/VideoDesafio';
import TabletDesafio from './pages/tablet/Desafio';
import TabletBubbleMap from './pages/tablet/BubbleMap';
import TabletResultadosEtapa2 from './pages/tablet/ResultadosEtapa2';
import TabletEtapa3Lego from './pages/tablet/Etapa3Lego';
import TabletResultadosEtapa3 from './pages/tablet/ResultadosEtapa3';
import TabletInicioEtapa4 from './pages/tablet/InicioEtapa4';
import TabletCrearPitch from './pages/tablet/CrearPitch';
import TabletRealizarPitch from './pages/tablet/RealizarPitch';
import TabletResultados from './pages/tablet/Resultados';
import TabletReflexion from './pages/tablet/Reflexion';
import TabletMiniJuego from './pages/tablet/MiniJuego';
import TabletEsperaEtapa from './pages/tablet/EsperaEtapa';

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
      <GameProvider>
        <div className="min-h-screen">
          <Routes>
            {/* Root and preview routes */}
            <Route path="/" element={<SeleccionUsuario />} />
            <Route path="/preview_page.html" element={<SeleccionUsuario />} />

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
              <Route path="inicio" element={<TabletIntroduccion />} />
              <Route path="entrar" element={<TabletEntrar />} />
              <Route path="sala" element={<TabletSala />} />
              <Route path="personalizar-equipo" element={<TabletPersonalizarEquipo />} />
              <Route path="presentacion-grupo" element={<TabletPresentacionGrupo />} />
              <Route path="rompe-hielos" element={<TabletRompeHielos />} />
              <Route path="mini-quiz" element={<TabletMiniQuiz />} />
              <Route path="mini-juego" element={<TabletMiniJuego />} />
              <Route path="espera-etapa" element={<TabletEsperaEtapa />} />
              <Route path="video" element={<TabletVideo />} />
              <Route path="eleccion-tematica" element={<TabletEleccionTematica />} />
              <Route path="video-desafio" element={<TabletVideoDesafio />} />
              <Route path="desafio" element={<TabletDesafio />} />
              <Route path="bubble-map" element={<TabletBubbleMap />} />
              <Route path="resultados-etapa2" element={<TabletResultadosEtapa2 />} />
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

            {/* Catch all - redirect to selection */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster richColors position="top-center" />
        </div>
      </GameProvider>
    </Router>
  );
}