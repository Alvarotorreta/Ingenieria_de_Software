// =========================================================
// Tipos TypeScript que coinciden con la base de datos MySQL
// =========================================================

export interface Facultad {
  id_facultad: number;
  nombre: string;
}

export interface Carrera {
  id_carrera: number;
  nombre: string;
  id_facultad: number;
  facultad?: Facultad; // Opcional para cuando se incluye en consultas
}

export interface TipoUsuario {
  id_tipoUsuario: number;
  nombreTipoUsuario: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  correo_udd: string;
  contrasena?: string; // No se envía desde el backend por seguridad
  id_tipoUsuario: number;
  role?: 'student' | 'teacher' | 'admin';
  tipoUsuario?: TipoUsuario; // Opcional para cuando se incluye
}

export interface Etapa {
  id_etapa: number;
  nombre_etapa: string;
  descripcion?: string;
}

export interface TipoActividad {
  id_tipoActividad: number;
  codigo: string;
  descripcion?: string;
  id_etapa: number;
  etapa?: Etapa;
}

export interface Actividad {
  id_actividad: number;
  nombre: string;
  descripcion?: string;
  estado: 'programada' | 'en_juego' | 'finalizado';
  imagen_url?: string;
  id_etapa: number;
  id_tipo_actividad: number;
  etapa?: Etapa;
  tipoActividad?: TipoActividad;
}

export interface Tema {
  id_tema: number;
  nombre_tema: string;
  descripcion?: string;
  id_facultad: number;
  facultad?: Facultad;
}

export interface Desafio {
  id_desafio: number;
  nombre_desafio: string;
  descripcion?: string;
  id_tema: number;
  tema?: Tema;
}

export interface Sala {
  id_sala: number;
  codigo_acceso: string;
  fecha_creacion: string; // ISO date string
  estado: 'programada' | 'en_juego' | 'finalizado';
  id_usuario: number;
  id_carrera: number;
  usuario?: Usuario;
  carrera?: Carrera;
  equipos?: Equipo[];
}

export interface Alumno {
  id_alumno: number;
  nombre: string;
  carrera?: string;
  correo_udd: string;
}

export interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
  modalidad: boolean; // 0 = presencial, 1 = virtual
  puntaje_total: number;
  id_sala: number;
  id_desafio: number;
  sala?: Sala;
  desafio?: Desafio;
  alumnos?: Alumno[];
  color?: string; // Campo adicional para el frontend
}

export interface AlumnoEquipo {
  id_alumno: number;
  id_equipo: number;
  alumno?: Alumno;
  equipo?: Equipo;
}

export interface Respuesta {
  id_respuesta: number;
  respuesta_texto?: string;
  imagen_url?: string;
  id_equipo: number;
  id_actividad: number;
  equipo?: Equipo;
  actividad?: Actividad;
}

export interface RegistroTokens {
  id_registro_tokens: number;
  emisor?: string;
  receptor?: string;
  cantidad_tokens: number;
  motivo?: string;
  id_equipo: number;
  id_actividad: number;
  equipo?: Equipo;
  actividad?: Actividad;
}

export interface TipoPregunta {
  id_tipoPregunta: number;
  descripcion?: string;
}

export interface Pregunta {
  id_pregunta: number;
  descripcion: string;
  id_tipoPregunta: number;
  tipoPregunta?: TipoPregunta;
}

export interface RespuestaEncuesta {
  id_respuestaEncuesta: number;
  respuesta?: string;
  id_alumno: number;
  id_pregunta: number;
  alumno?: Alumno;
  pregunta?: Pregunta;
}

// =========================================================
// DTOs (Data Transfer Objects) para requests
// =========================================================

export interface LoginRequest {
  correo_udd: string;
  contrasena: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  usuario: Usuario;
}

export interface RegistroRequest {
  nombre: string;
  correo_udd: string;
  contrasena: string;
  id_tipoUsuario: number;
  role?: 'student' | 'teacher' | 'admin';
}

export interface CrearSalaRequest {
  id_usuario: number;
  id_carrera: number;
  codigo_acceso?: string; // Opcional, se genera automáticamente si no se provee
}

export interface CrearEquipoRequest {
  nombre_equipo: string;
  modalidad: boolean;
  id_sala: number;
  id_desafio: number;
  color?: string;
}

export interface AsignarAlumnoEquipoRequest {
  id_alumno: number;
  id_equipo: number;
}

export interface CrearRespuestaRequest {
  respuesta_texto?: string;
  imagen_url?: string;
  id_equipo: number;
  id_actividad: number;
}

export interface RegistrarTokensRequest {
  emisor?: string;
  receptor?: string;
  cantidad_tokens: number;
  motivo?: string;
  id_equipo: number;
  id_actividad: number;
}

export interface ActualizarEstadoSalaRequest {
  id_sala: number;
  estado: 'programada' | 'en_juego' | 'finalizado';
}

export interface ActualizarPuntajeEquipoRequest {
  id_equipo: number;
  puntaje_adicional: number;
}

export interface ImportStudentPayload {
  name: string;
  email: string;
  career?: string;
}

// =========================================================
// Tipos auxiliares para el frontend
// =========================================================

export interface SalaConDetalles extends Sala {
  equipos: (Equipo & { 
    alumnos: Alumno[];
    puntaje_total: number;
  })[];
  carrera: Carrera & { facultad: Facultad };
}

export interface EstadisticasSala {
  total_alumnos: number;
  total_equipos: number;
  equipos_conectados: number;
  promedio_puntaje: number;
}
