import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ProfesorLogin } from './pages/profesor/Login';
import { ProfesorRegistro } from './pages/profesor/Registro';
import { ProfesorPanel } from './pages/profesor/Panel';
import { ProfesorLobby } from './pages/profesor/Lobby';
import { ProfesorPersonalizacion } from './pages/profesor/etapa1/Personalizacion';
import { ProfesorPresentacion } from './pages/profesor/etapa1/Presentacion';
import { ProfesorResultadosEtapa1 } from './pages/profesor/etapa1/Resultados';
import { ProfesorSeleccionarTema } from './pages/profesor/etapa2/SeleccionarTema';
import { ProfesorBubbleMap } from './pages/profesor/etapa2/BubbleMap';
import { ProfesorPrototipo } from './pages/profesor/etapa3/Prototipo';
import { ProfesorFormularioPitch } from './pages/profesor/etapa4/FormularioPitch';
import { ProfesorPresentacionPitch } from './pages/profesor/etapa4/PresentacionPitch';
import { ProfesorReflexion } from './pages/profesor/Reflexion';
import { TabletJoin } from './pages/tablets/Join';
import { TabletLobby } from './pages/tablets/Lobby';
import { TabletPersonalizacion } from './pages/tablets/etapa1/Personalizacion';
import { TabletPresentacion } from './pages/tablets/etapa1/Presentacion';
import { TabletMinijuego } from './pages/tablets/etapa1/Minijuego';
import { TabletResultadosEtapa1 } from './pages/tablets/etapa1/Resultados';
import { TabletSeleccionarTemaDesafio } from './pages/tablets/etapa2/SeleccionarTemaDesafio';
import { TabletBubbleMap } from './pages/tablets/etapa2/BubbleMap';
import { TabletPrototipo } from './pages/tablets/etapa3/Prototipo';
import { TabletFormularioPitch } from './pages/tablets/etapa4/FormularioPitch';
import { TabletPresentacionPitch } from './pages/tablets/etapa4/PresentacionPitch';
import { TabletReflexion } from './pages/tablets/Reflexion';

function RedirectToSeleccionarTema() {
  const { sessionId } = useParams<{ sessionId: string }>();
  return <Navigate to={`/profesor/etapa2/seleccionar-tema/${sessionId}`} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/profesor/login" replace />} />
      <Route path="/login" element={<Navigate to="/profesor/login" replace />} />
      <Route path="/panel" element={<Navigate to="/profesor/panel" replace />} />
      <Route path="/profesor/login" element={<ProfesorLogin />} />
      <Route path="/profesor/registro" element={<ProfesorRegistro />} />
      <Route path="/profesor/panel" element={<ProfesorPanel />} />
      <Route path="/profesor/lobby/:sessionId" element={<ProfesorLobby />} />
      <Route path="/profesor/etapa1/personalizacion/:sessionId" element={<ProfesorPersonalizacion />} />
      <Route path="/profesor/etapa1/presentacion/:sessionId" element={<ProfesorPresentacion />} />
      <Route path="/profesor/resultados/:sessionId" element={<ProfesorResultadosEtapa1 />} />
      <Route path="/profesor/etapa2/seleccionar-tema/:sessionId" element={<ProfesorSeleccionarTema />} />
      <Route path="/profesor/etapa2/seleccionar-desafio/:sessionId" element={<RedirectToSeleccionarTema />} />
      <Route path="/profesor/etapa2/ver-desafio/:sessionId" element={<RedirectToSeleccionarTema />} />
      <Route path="/profesor/etapa2/bubble-map/:sessionId" element={<ProfesorBubbleMap />} />
      <Route path="/profesor/etapa3/prototipo/:sessionId" element={<ProfesorPrototipo />} />
      <Route path="/profesor/etapa4/formulario-pitch/:sessionId" element={<ProfesorFormularioPitch />} />
      <Route path="/profesor/etapa4/presentacion-pitch/:sessionId" element={<ProfesorPresentacionPitch />} />
      <Route path="/profesor/reflexion/:sessionId" element={<ProfesorReflexion />} />
      <Route path="/tablet/join" element={<TabletJoin />} />
      <Route path="/tablet/join/:roomCode" element={<TabletJoin />} />
      <Route path="/tablet/lobby" element={<TabletLobby />} />
      <Route path="/tablet/etapa1/personalizacion" element={<TabletPersonalizacion />} />
      <Route path="/tablet/etapa1/presentacion" element={<TabletPresentacion />} />
      <Route path="/tablet/etapa1/minijuego" element={<TabletMinijuego />} />
      <Route path="/tablet/resultados" element={<TabletResultadosEtapa1 />} />
      <Route path="/tablet/etapa1/resultados" element={<TabletResultadosEtapa1 />} />
      <Route path="/tablet/etapa2/resultados" element={<TabletResultadosEtapa1 />} />
      <Route path="/tablet/etapa3/resultados" element={<TabletResultadosEtapa1 />} />
      <Route path="/tablet/etapa4/resultados" element={<TabletResultadosEtapa1 />} />
      <Route path="/tablet/etapa2/seleccionar-tema" element={<TabletSeleccionarTemaDesafio />} />
      <Route path="/tablet/etapa2/bubble-map" element={<TabletBubbleMap />} />
      <Route path="/tablet/etapa3/prototipo" element={<TabletPrototipo />} />
      <Route path="/tablet/etapa4/formulario-pitch" element={<TabletFormularioPitch />} />
      <Route path="/tablet/etapa4/presentacion-pitch" element={<TabletPresentacionPitch />} />
      <Route path="/tablet/reflexion" element={<TabletReflexion />} />
    </Routes>
  );
}

export default App;


