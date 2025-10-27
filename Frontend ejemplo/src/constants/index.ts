// =========================================================
// Constantes del proyecto
// =========================================================

/**
 * Colores de los equipos
 */
export const COLORES_EQUIPOS = {
  ROJO: '#ff4757',
  AZUL: '#3742fa',
  VERDE: '#2ed573',
  AMARILLO: '#ffa502'
};

/**
 * Nombres de los equipos
 */
export const NOMBRES_EQUIPOS = [
  'Grupo Rojo',
  'Grupo Azul',
  'Grupo Verde',
  'Grupo Amarillo'
];

/**
 * Estados de sala
 */
export const ESTADOS_SALA = {
  PROGRAMADA: 'programada' as const,
  EN_JUEGO: 'en_juego' as const,
  FINALIZADO: 'finalizado' as const
};

/**
 * Estados de actividad
 */
export const ESTADOS_ACTIVIDAD = {
  PROGRAMADA: 'programada' as const,
  EN_JUEGO: 'en_juego' as const,
  FINALIZADO: 'finalizado' as const
};

/**
 * Tipos de usuario
 */
export const TIPOS_USUARIO = {
  PROFESOR: 1,
  ADMINISTRADOR: 2
};

/**
 * Etapas del juego
 */
export const ETAPAS = {
  ETAPA_1: {
    id: 1,
    nombre: 'Creatividad',
    color: 'from-purple-500 to-pink-500',
    icono: '💡'
  },
  ETAPA_2: {
    id: 2,
    nombre: 'Trabajo en Equipo',
    color: 'from-blue-500 to-cyan-500',
    icono: '🤝'
  },
  ETAPA_3: {
    id: 3,
    nombre: 'Empatía',
    color: 'from-orange-500 to-red-500',
    icono: '❤️'
  },
  ETAPA_4: {
    id: 4,
    nombre: 'Comunicación',
    color: 'from-green-500 to-emerald-500',
    icono: '🎤'
  }
};

/**
 * Duraciones de actividades (en minutos)
 */
export const DURACIONES = {
  MINI_JUEGO: 10,
  BUBBLE_MAP: 15,
  LEGO: 20,
  PITCH_PREPARACION: 15,
  PITCH_PRESENTACION: 3
};

/**
 * Límites del sistema
 */
export const LIMITES = {
  MAX_EQUIPOS: 4,
  MIN_EQUIPOS: 2,
  MAX_ALUMNOS_POR_EQUIPO: 6,
  MIN_ALUMNOS_POR_EQUIPO: 2,
  CODIGO_SALA_LENGTH: 6
};

/**
 * Puntuaciones base
 */
export const PUNTUACIONES = {
  MINI_JUEGO_COMPLETADO: 50,
  BUBBLE_MAP_IDEA: 10,
  LEGO_COMPLETADO: 100,
  PITCH_EXCELENTE: 100,
  PITCH_BUENO: 75,
  PITCH_REGULAR: 50,
  EVALUACION_ENTRE_PARES: 25
};

/**
 * Mensajes de error comunes
 */
export const MENSAJES_ERROR = {
  CODIGO_INVALIDO: 'El código debe tener 6 dígitos',
  EMAIL_INVALIDO: 'Debe ser un correo @udd.cl',
  SESION_EXPIRADA: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente',
  ERROR_CONEXION: 'Error de conexión. Verifica tu internet',
  SALA_NO_ENCONTRADA: 'No se encontró la sala con ese código',
  SIN_PERMISO: 'No tienes permiso para realizar esta acción'
};

/**
 * Mensajes de éxito
 */
export const MENSAJES_EXITO = {
  SALA_CREADA: '¡Sala creada exitosamente!',
  TOKENS_OTORGADOS: '¡Tokens otorgados correctamente!',
  EQUIPO_CREADO: '¡Equipo creado exitosamente!',
  ACTIVIDAD_COMPLETADA: '¡Actividad completada!',
  GUARDADO: 'Guardado correctamente'
};

/**
 * Rutas del frontend
 */
export const RUTAS = {
  // Profesor
  PROFESOR_LOGIN: '/profesor/login',
  PROFESOR_REGISTRO: '/profesor/registro',
  PROFESOR_HOME: '/profesor/home',
  PROFESOR_TUTORIAL: '/profesor/tutorial',
  PROFESOR_HISTORIAL: '/profesor/historial',
  PROFESOR_CREAR_SALA: '/profesor/crear-sala',
  PROFESOR_SALA: '/profesor/sala',
  PROFESOR_ETAPA_1: '/profesor/etapa1',
  PROFESOR_ETAPA_2: '/profesor/etapa2',
  PROFESOR_ETAPA_3: '/profesor/etapa3-lego',
  PROFESOR_ETAPA_4: '/profesor/etapa4-realizar',
  PROFESOR_RESULTADOS: '/profesor/resultados-finales',
  PROFESOR_REFLEXION: '/profesor/reflexion',

  // Tablet
  TABLET_INICIO: '/tablet/inicio',
  TABLET_ENTRAR: '/tablet/entrar',
  TABLET_SALA: '/tablet/sala',
  TABLET_MINI_JUEGO: '/tablet/mini-juego',
  TABLET_BUBBLE_MAP: '/tablet/bubble-map',
  TABLET_LEGO: '/tablet/etapa3-lego',
  TABLET_PITCH: '/tablet/crear-pitch',
  TABLET_RESULTADOS: '/tablet/resultados',

  // Estudiante
  ESTUDIANTE_ENTRAR: '/estudiante/entrar',
  ESTUDIANTE_EVALUAR: '/estudiante/evaluar',
  ESTUDIANTE_GRACIAS: '/estudiante/gracias',

  // Admin
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_JUEGOS: '/admin/juegos',
  ADMIN_METRICAS: '/admin/metricas'
};

/**
 * Keys de localStorage
 */
export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USUARIO: 'usuario',
  SALA_ACTUAL: 'sala_actual',
  EQUIPO_ACTUAL: 'equipo_actual',
  TEMA_PREFERIDO: 'tema_preferido'
};

/**
 * Expresiones regulares útiles
 */
export const REGEX = {
  EMAIL_UDD: /^[a-zA-Z0-9._%+-]+@(udd\.cl|mail\.udd\.cl)$/,
  SOLO_NUMEROS: /^\d+$/,
  CODIGO_SALA: /^\d{6}$/,
  TELEFONO_CHILE: /^(\+?56)?[2-9]\d{8}$/
};

/**
 * Configuración de animaciones
 */
export const ANIMACIONES = {
  DURACION_CORTA: 0.2,
  DURACION_MEDIA: 0.5,
  DURACION_LARGA: 1.0,
  DELAY_STAGGER: 0.1
};

/**
 * Breakpoints responsive
 */
export const BREAKPOINTS = {
  MOBILE: 640,
  TABLET: 768,
  DESKTOP: 1024,
  WIDE: 1280
};

/**
 * Tipos de preguntas para encuestas
 */
export const TIPOS_PREGUNTA = {
  ESCALA_1_5: 1,
  TEXTO_CORTO: 2,
  TEXTO_LARGO: 3,
  OPCION_MULTIPLE: 4
};

/**
 * Temáticas por facultad
 */
export const TEMATICAS_POR_FACULTAD = {
  INGENIERIA: ['Sostenibilidad Urbana', 'Industria 4.0', 'Tecnología en Salud'],
  DISENO: ['Experiencia de Usuario', 'Diseño Sostenible', 'Diseño Digital'],
  NEGOCIOS: ['Emprendimiento Social', 'E-commerce Innovador', 'Economía Circular'],
  COMUNICACIONES: ['Comunicación Social', 'Creación de Contenido', 'Branding & Estrategia']
};

/**
 * Configuración de WebSocket (si se usa en el futuro)
 */
export const WEBSOCKET_CONFIG = {
  RECONNECT_INTERVAL: 3000,
  MAX_RECONNECT_ATTEMPTS: 5,
  HEARTBEAT_INTERVAL: 30000
};

/**
 * Configuración de toasts
 */
export const TOAST_CONFIG = {
  DURACION_CORTA: 2000,
  DURACION_MEDIA: 4000,
  DURACION_LARGA: 6000,
  POSICION: 'top-center' as const
};

/**
 * Iconos por competencia
 */
export const ICONOS_COMPETENCIAS = {
  CREATIVIDAD: '💡',
  TRABAJO_EQUIPO: '🤝',
  EMPATIA: '❤️',
  COMUNICACION: '🎤',
  LIDERAZGO: '👑',
  INNOVACION: '🚀',
  RESOLUCION_PROBLEMAS: '🧩'
};

/**
 * Configuración de paginación
 */
export const PAGINACION = {
  ITEMS_POR_PAGINA: 10,
  ITEMS_HISTORIAL: 20
};
