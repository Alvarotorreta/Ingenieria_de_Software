# Juego de Emprendimiento UDD 🎮

Plataforma educativa interactiva gamificada para enseñar emprendimiento e innovación a estudiantes universitarios.

## 🎯 Descripción

Un juego educativo estilo Kahoot que permite a los profesores gestionar sesiones interactivas donde los estudiantes trabajan en equipos para desarrollar ideas de emprendimiento, desde la conceptualización hasta el pitch final.

## 🔑 Credenciales de Acceso

### Administrador
- Email: `admin@udd.cl`
- Contraseña: `admin123`
- Acceso: `/admin/login`

### Profesor
- Email: Cualquier email válido
- Contraseña: Cualquier contraseña
- Acceso: `/profesor/login`
- Nota: Sistema de prototipo sin validación real

## 📱 Flujos de Usuario

### 1. Flujo Profesor (Desktop) - 18 Pantallas

Gestión completa del juego desde la creación hasta los resultados.

**Rutas:**
- `/profesor/login` - Inicio de sesión
- `/profesor/registro` - Registro de nuevo profesor
- `/profesor/home` - Dashboard principal
- `/profesor/tutorial` - Tutorial interactivo (primera vez)
- `/profesor/historial` - Historial de juegos anteriores
- `/profesor/objetivos` - Objetivos de aprendizaje
- `/profesor/crear-sala` - Crear nueva sesión
- `/profesor/sala/:salaId` - Sala de espera
- `/profesor/personalizacion-grupos` - Personalizar equipos
- `/profesor/etapa1` - Etapa 1: Conociendo el equipo
- `/profesor/eleccion-tematica` - Elección de temática
- `/profesor/etapa2` - Etapa 2: Bubble Map
- `/profesor/bubble-map` - Ver Bubble Maps
- `/profesor/etapa3-lego` - Etapa 3: Construcción LEGO
- `/profesor/etapa3-resultados` - Resultados Etapa 3
- `/profesor/etapa4-preparar` - Preparación del Pitch
- `/profesor/etapa4-realizar` - Presentación de Pitches
- `/profesor/reflexion` - Reflexión final
- `/profesor/resultados-finales` - Resultados y rankings

**Características:**
- ✅ Sistema de tokens dinámico (otorgar en cualquier momento)
- ✅ Timer en tiempo real
- ✅ Monitoreo de progreso por equipo
- ✅ Rankings en vivo
- ✅ Confetti y animaciones de celebración

### 2. Flujo Tablet (Grupos) - 18 Pantallas

Experiencia de estudiantes trabajando en equipos desde tablets.

**Rutas:**
- `/tablet/inicio` - Pantalla de bienvenida
- `/tablet/entrar` - Ingresar código de sala
- `/tablet/sala` - Sala de espera
- `/tablet/personalizacion` - Personalizar equipo
- `/tablet/introduccion` - Introducción al juego
- `/tablet/mini-juego` - Anagrama de emprendimiento
- `/tablet/video` - Video institucional
- `/tablet/eleccion-tematica` - Elegir temática
- `/tablet/desafio` - Presentación del desafío
- `/tablet/bubble-map` - Crear Bubble Map
- `/tablet/resultados-etapa2` - Resultados Etapa 2
- `/tablet/inicio-etapa3` - Inicio Etapa 3
- `/tablet/etapa3-lego` - Construcción LEGO
- `/tablet/resultados-etapa3` - Resultados Etapa 3
- `/tablet/inicio-etapa4` - Inicio Etapa 4
- `/tablet/crear-pitch` - Crear el Pitch
- `/tablet/realizar-pitch` - Realizar presentación
- `/tablet/resultados` - Resultados finales
- `/tablet/reflexion` - Reflexión grupal

**Características:**
- ✅ Mini-juego de anagramas para romper el hielo
- ✅ Sistema de tokens visualizado
- ✅ Bubble Map interactivo
- ✅ Timer por actividad
- ✅ Formularios de pitch estructurados

### 3. Flujo Estudiante (Móvil) - 3 Pantallas

Evaluación entre pares desde dispositivos móviles personales.

**Rutas:**
- `/estudiante/entrar` - Ingresar datos y código
- `/estudiante/evaluar` - Evaluar presentaciones
- `/estudiante/gracias` - Confirmación

**Características:**
- ✅ Evaluación por estrellas (1-5)
- ✅ 4 criterios de evaluación
- ✅ Campo de comentarios opcional
- ✅ Diseño responsive móvil

### 4. Flujo Administrador - 6 Pantallas

Panel de gestión y análisis del sistema.

**Rutas:**
- `/admin/login` - Login de administrador
- `/admin/dashboard` - Dashboard principal
- `/admin/juegos` - Gestión de juegos/sesiones
- `/admin/metricas` - Métricas y estadísticas
- `/admin/evaluaciones` - Análisis de evaluaciones
- `/admin/configuracion` - Configuración del sistema

**Características:**
- ✅ Métricas generales (participación, satisfacción, duración)
- ✅ Lista de juegos con filtros
- ✅ Gráficas de desempeño
- ✅ Análisis de evaluaciones
- ✅ Gestión de configuraciones

## 🎨 Diseño y UX

### Paleta de Colores
- **Azul Principal:** `#093c92` - Profesionalismo y confianza
- **Rosa Acento:** `#f757ac` - Energía y creatividad
- **Amarillo:** `#fbc95c` - Tokens y recompensas
- **Degradados:** Animados para fondos llamativos

### Componentes Personalizados
- `Timer` - Cuenta regresiva interactiva
- `TokenAnimation` - Animación de otorgamiento de tokens
- `GroupBadge` - Insignia de equipo con color personalizado
- `Confetti` - Celebración de logros

## 🛠️ Tecnologías

- **React** - Framework principal
- **TypeScript** - Tipado estático
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **Motion (Framer Motion)** - Animaciones
- **Shadcn/UI** - Componentes base
- **Lucide React** - Iconografía
- **Sonner** - Notificaciones toast

## 🚀 Características Principales

### 🎮 Gamificación
- Sistema de tokens dinámico
- Rankings en tiempo real
- Confetti y celebraciones
- Badges personalizados por equipo
- Animaciones interactivas

### 📊 Etapas del Juego

1. **Etapa 1: Conociendo el Equipo** (10 min)
   - Mini-juego de anagramas
   - Formación de equipos
   - Personalización de nombres

2. **Etapa 2: Ideación** (15 min)
   - Elección de temática
   - Creación de Bubble Map
   - Organización de ideas

3. **Etapa 3: Prototipado** (20 min)
   - Construcción con LEGO
   - Materialización de la solución
   - Fotografía del prototipo

4. **Etapa 4: Pitch** (3 min por equipo)
   - Preparación de presentación
   - Pitch en vivo
   - Evaluación entre pares

### 🎯 Sistema de Evaluación
- **Criterios:**
  - Creatividad
  - Viabilidad
  - Presentación
  - Impacto

- **Reflexión Final:**
  - Preguntas personalizadas
  - Aprendizajes del juego
  - Trabajo en equipo
  - Aplicación futura

## 📝 Flujo Completo del Juego

1. **Profesor** crea sala desde desktop
2. **Estudiantes** ingresan código en tablets (por grupo)
3. **Sistema** organiza en 6 equipos automáticamente
4. **Equipos** personalizan nombre y completan mini-juego
5. **Profesor** otorga tokens durante todo el juego
6. **Equipos** completan 4 etapas con actividades específicas
7. **Estudiantes** evalúan desde móviles personales
8. **Sistema** muestra resultados finales y rankings
9. **Todos** completan reflexión final

## 🎓 Objetivos de Aprendizaje

- Pensamiento creativo e innovación
- Trabajo colaborativo
- Habilidades de emprendimiento
- Pensamiento crítico
- Comunicación efectiva
- Presentación en público
- Liderazgo y delegación
- Resolución de problemas

## 💡 Próximos Pasos Sugeridos

- [ ] Integrar con Supabase para persistencia de datos
- [ ] Implementar autenticación real
- [ ] Agregar más mini-juegos
- [ ] Sistema de badges y logros
- [ ] Exportación de reportes PDF
- [ ] Análisis avanzado de datos
- [ ] Modo multijugador sincronizado
- [ ] Integración con plataformas LMS

## 📄 Licencia

Proyecto educativo desarrollado para la Universidad del Desarrollo (UDD).

---

Desarrollado con ❤️ para transformar la educación en emprendimiento
