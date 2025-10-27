// =========================================================
// Servicio API para comunicarse con el backend actual (Django + DRF)
// =========================================================

import { LOCAL_STORAGE_KEYS } from '../constants';
import type {
  Facultad,
  Carrera,
  Usuario,
  Sala,
  Equipo,
  Alumno,
  Tema,
  Desafio,
  Actividad,
  RegistroTokens,
  Pregunta,
  Respuesta,
  RespuestaEncuesta,
  LoginRequest,
  LoginResponse,
  RegistroRequest,
  CrearSalaRequest,
  CrearEquipoRequest,
  AsignarAlumnoEquipoRequest,
  CrearRespuestaRequest,
  RegistrarTokensRequest,
  ActualizarEstadoSalaRequest,
  ActualizarPuntajeEquipoRequest,
  SalaConDetalles,
  ImportStudentPayload
} from '../types/database';

// URL base del API
const runtimeEnv = ((): Record<string, string> => {
  if (typeof import.meta !== 'undefined' && (import.meta as Record<string, any>)?.env) {
    return (import.meta as Record<string, any>).env as Record<string, string>;
  }
  const globalProcess = (globalThis as Record<string, any>)?.process;
  if (globalProcess?.env) {
    return globalProcess.env as Record<string, string>;
  }
  return {};
})();

const API_BASE_URL = runtimeEnv.VITE_API_BASE_URL
  ? runtimeEnv.VITE_API_BASE_URL.replace(/\/$/, '')
  : 'http://localhost:8000/api';

const ACCESS_TOKEN_KEY = LOCAL_STORAGE_KEYS.AUTH_TOKEN;
const REFRESH_TOKEN_KEY = LOCAL_STORAGE_KEYS.REFRESH_TOKEN ?? 'refresh_token';
const USER_KEY = LOCAL_STORAGE_KEYS.USUARIO;

type RoleKey = 'teacher' | 'admin' | 'student';

const ROLE_MAP: Record<RoleKey, { id: number; nombre: string }> = {
  teacher: { id: 1, nombre: 'Profesor' },
  admin: { id: 2, nombre: 'Administrador' },
  student: { id: 3, nombre: 'Alumno' }
};

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

type SerializableBody =
  | BodyInit
  | null
  | undefined
  | Record<string, unknown>
  | Array<unknown>;

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: SerializableBody;
  skipAuth?: boolean;
  retry?: boolean;
};

const resolveUrl = (endpoint: string): string => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const storeTokens = (access: string, refresh?: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const storeUser = (usuario: Usuario) => {
  localStorage.setItem(USER_KEY, JSON.stringify(usuario));
};

const getStoredUser = (): Usuario | null => {
  const value = localStorage.getItem(USER_KEY);
  return value ? (JSON.parse(value) as Usuario) : null;
};

const roleFromTypeId = (idTipo: number | undefined): RoleKey => {
  switch (idTipo) {
    case 1:
      return 'teacher';
    case 2:
      return 'admin';
    default:
      return 'student';
  }
};

const roleInfo = (role?: string) => {
  const key = (role ?? 'student') as RoleKey;
  return ROLE_MAP[key] ?? ROLE_MAP.student;
};

const generateRoomCode = () => String(Math.floor(100000 + Math.random() * 900000));

const asArray = <T>(payload: any): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (Array.isArray(payload?.results)) {
    return payload.results as T[];
  }
  return [];
};

async function refreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) {
    return false;
  }

  const response = await fetch(resolveUrl('/auth/refresh/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh })
  });

  if (!response.ok) {
    clearTokens();
    return false;
  }

  const data = (await response.json()) as { access: string; refresh?: string };
  storeTokens(data.access, data.refresh ?? refresh);
  return true;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data?.message || data?.detail || response.statusText,
      data
    );
  }

  return data as T;
}

async function apiRequest<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
  const { skipAuth = false, retry = true, ...rest } = options;
  const url = resolveUrl(endpoint);

  const headers = new Headers(rest.headers ?? {});
  let body = rest.body ?? null;

  if (body && !(body instanceof FormData) && typeof body !== 'string' && !(body instanceof Blob)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    body = JSON.stringify(body);
  } else if (typeof body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers,
    body: body as BodyInit | null | undefined
  });

  if (response.status === 401 && !skipAuth && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiRequest<T>(endpoint, { ...options, retry: false });
    }
  }

  return handleResponse<T>(response);
}

// =========================================================
// Mapeadores de respuestas del backend a los tipos existentes del frontend
// =========================================================

const mapUsuario = (data: any): Usuario => {
  const role = (data?.role ?? 'student') as RoleKey;
  const info = roleInfo(role);

  return {
    id_usuario: data?.id ?? 0,
    nombre: data?.first_name || data?.last_name
      ? `${data.first_name ?? ''} ${data.last_name ?? ''}`.trim()
      : data?.username ?? data?.email ?? 'Usuario',
    correo_udd: data?.email ?? '',
    id_tipoUsuario: info.id,
    role,
    tipoUsuario: {
      id_tipoUsuario: info.id,
      nombreTipoUsuario: info.nombre
    }
  };
};

const mapFacultad = (data: any): Facultad => ({
  id_facultad: data?.id ?? 0,
  nombre: data?.name ?? ''
});

const mapCarrera = (data: any): Carrera => ({
  id_carrera: data?.id ?? 0,
  nombre: data?.name ?? '',
  id_facultad: data?.faculty_id ?? data?.faculty?.id ?? 0,
  facultad: data?.faculty ? mapFacultad(data.faculty) : undefined
});

const mapTema = (data: any): Tema => ({
  id_tema: data?.id ?? 0,
  nombre_tema: data?.name ?? '',
  descripcion: data?.description ?? '',
  id_facultad: data?.faculty_id ?? data?.faculty?.id ?? 0,
  facultad: data?.faculty ? mapFacultad(data.faculty) : undefined
});

const mapDesafio = (data: any): Desafio => ({
  id_desafio: data?.id ?? 0,
  nombre_desafio: data?.name ?? '',
  descripcion: data?.description ?? '',
  id_tema: data?.theme_id ?? data?.theme?.id ?? 0,
  tema: data?.theme ? mapTema(data.theme) : undefined
});

const mapEtapa = (data: any) => ({
  id_etapa: data?.id ?? 0,
  nombre_etapa: data?.name ?? '',
  descripcion: data?.description ?? ''
});

const mapTipoActividad = (data: any) => ({
  id_tipoActividad: data?.id ?? 0,
  codigo: data?.code ?? '',
  descripcion: data?.description ?? '',
  id_etapa: data?.stage_id ?? data?.stage?.id ?? 0,
  etapa: data?.stage ? mapEtapa(data.stage) : undefined
});

const mapActividad = (data: any): Actividad => ({
  id_actividad: data?.id ?? 0,
  nombre: data?.name ?? '',
  descripcion: data?.description ?? '',
  estado: data?.status ?? 'en_juego',
  imagen_url: data?.image_url ?? undefined,
  id_etapa: data?.stage_id ?? data?.stage?.id ?? 0,
  id_tipo_actividad: data?.activity_type_id ?? data?.activity_type?.id ?? 0,
  etapa: data?.stage ? mapEtapa(data.stage) : undefined,
  tipoActividad: data?.activity_type ? mapTipoActividad(data.activity_type) : undefined
});

const mapAlumno = (data: any): Alumno => ({
  id_alumno: data?.id ?? 0,
  nombre: data?.name ?? '',
  carrera: data?.career ?? undefined,
  correo_udd: data?.email ?? ''
});

const mapEquipo = (data: any): Equipo => ({
  id_equipo: data?.id ?? 0,
  nombre_equipo: data?.name ?? '',
  modalidad: data?.modality === 'known',
  puntaje_total: data?.total_score ?? 0,
  id_sala: data?.session_id ?? data?.session?.id ?? 0,
  id_desafio: data?.challenge_id ?? data?.challenge?.id ?? 0,
  sala: undefined,
  desafio: data?.challenge ? mapDesafio(data.challenge) : undefined,
  alumnos: Array.isArray(data?.members) ? data.members.map(mapAlumno) : [],
  color: data?.color ?? undefined
});

const mapSala = (data: any): Sala => ({
  id_sala: data?.id ?? 0,
  codigo_acceso: data?.code ?? '',
  fecha_creacion:
    data?.created_at ??
    data?.scheduled_for ??
    new Date().toISOString(),
  estado: data?.status ?? 'programada',
  id_usuario: data?.owner?.id ?? data?.owner_id ?? 0,
  id_carrera: data?.career?.id ?? data?.career_id ?? 0,
  usuario: data?.owner ? mapUsuario(data.owner) : undefined,
  carrera: data?.career ? mapCarrera(data.career) : undefined,
  equipos: Array.isArray(data?.teams) ? data.teams.map(mapEquipo) : []
});

const mapSalaConDetalles = (data: any): SalaConDetalles => {
  const base = mapSala(data);
  return {
    ...base,
    equipos: (base.equipos ?? []).map((equipo) => ({
      ...equipo,
      alumnos: equipo.alumnos ?? [],
      puntaje_total: equipo.puntaje_total ?? 0
    })),
    carrera: {
      ...(base.carrera ?? { id_carrera: 0, nombre: '', id_facultad: 0 }),
      facultad: base.carrera?.facultad ?? { id_facultad: 0, nombre: '' }
    }
  };
};

const mapToken = (data: any): RegistroTokens => ({
  id_registro_tokens: data?.id ?? 0,
  emisor: data?.issuer ?? undefined,
  receptor: data?.receiver ?? undefined,
  cantidad_tokens: data?.amount ?? 0,
  motivo: data?.reason ?? undefined,
  id_equipo: data?.team ?? data?.team_id ?? 0,
  id_actividad: data?.activity ?? data?.activity_id ?? 0
});

const mapRespuesta = (data: any): Respuesta => ({
  id_respuesta: data?.id ?? 0,
  respuesta_texto: data?.text ?? undefined,
  imagen_url: data?.image_url ?? undefined,
  id_equipo: data?.team ?? data?.team_id ?? 0,
  id_actividad: data?.activity ?? data?.activity_id ?? 0
});

const mapPregunta = (data: any): Pregunta => ({
  id_pregunta: data?.id ?? 0,
  descripcion: data?.description ?? '',
  id_tipoPregunta: data?.tipoPregunta?.id ?? 0,
  tipoPregunta: data?.tipoPregunta
    ? {
        id_tipoPregunta: data.tipoPregunta.id,
        descripcion: data.tipoPregunta.descripcion ?? ''
      }
    : undefined
});

const mapRespuestaEncuesta = (data: any): RespuestaEncuesta => ({
  id_respuestaEncuesta: data?.id ?? 0,
  respuesta: data?.response ?? undefined,
  id_alumno: data?.student ?? data?.student_id ?? 0,
  id_pregunta: data?.question ?? data?.question_id ?? 0,
  alumno: data?.student_detail ? mapAlumno(data.student_detail) : undefined,
  pregunta: data?.question_detail ? mapPregunta(data.question_detail) : undefined
});

// =========================================================
// Autenticación
// =========================================================

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const payload = {
      username: data.correo_udd,
      email: data.correo_udd,
      password: data.contrasena
    };

    const tokens = await apiRequest<{ access: string; refresh: string }>(
      '/auth/login/',
      {
        method: 'POST',
        body: payload,
        skipAuth: true
      }
    );

    storeTokens(tokens.access, tokens.refresh);

    const usuarioData = await apiRequest<any>('/me/');
    const usuario = mapUsuario(usuarioData);
    storeUser(usuario);

    return {
      access: tokens.access,
      refresh: tokens.refresh,
      usuario
    };
  },

  registro: async (data: RegistroRequest): Promise<Usuario> => {
    const role = data.role ?? roleFromTypeId(data.id_tipoUsuario);
    const payload = {
      username: data.correo_udd,
      email: data.correo_udd,
      password: data.contrasena,
      role,
      first_name: data.nombre
    };

    const usuarioData = await apiRequest<any>('/register/', {
      method: 'POST',
      body: payload
    });

    return mapUsuario(usuarioData);
  },

  logout: () => {
    clearTokens();
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): Usuario | null => getStoredUser(),

  isAuthenticated: (): boolean => !!getAccessToken()
};

// =========================================================
// Facultades y Carreras
// =========================================================

export const facultadApi = {
  getAll: async (): Promise<Facultad[]> => {
    const response = await apiRequest<any>('/faculties/');
    return asArray(response).map(mapFacultad);
  },

  getById: async (id: number): Promise<Facultad> => {
    const response = await apiRequest<any>(`/faculties/${id}/`);
    return mapFacultad(response);
  },

  getCarreras: async (id_facultad: number): Promise<Carrera[]> => {
    const response = await apiRequest<any>(`/careers/?faculty=${id_facultad}`);
    return asArray(response).map(mapCarrera);
  }
};

export const carreraApi = {
  getAll: async (): Promise<Carrera[]> => {
    const response = await apiRequest<any>('/careers/');
    return asArray(response).map(mapCarrera);
  },

  getById: async (id: number): Promise<Carrera> => {
    const response = await apiRequest<any>(`/careers/${id}/`);
    return mapCarrera(response);
  }
};

// =========================================================
// Salas (Sesiones)
// =========================================================

export const salaApi = {
  create: async (data: CrearSalaRequest): Promise<Sala> => {
    const payload = {
      career_id: data.id_carrera,
      code: data.codigo_acceso ?? generateRoomCode(),
      status: 'programada'
    };

    const response = await apiRequest<any>('/sessions/', {
      method: 'POST',
      body: payload
    });
    return mapSala(response);
  },

  getById: async (id: number): Promise<SalaConDetalles> => {
    const response = await apiRequest<any>(`/sessions/${id}/`);
    return mapSalaConDetalles(response);
  },

  getByCodigo: async (codigo: string): Promise<SalaConDetalles> => {
    const response = await apiRequest<any>(`/sessions/code/${codigo}/`, {
      skipAuth: true
    });
    return mapSalaConDetalles(response);
  },

  getByProfesor: async (id_usuario: number): Promise<Sala[]> => {
    const response = await apiRequest<any[]>(`/sessions/teacher/${id_usuario}/`);
    return response.map(mapSala);
  },

  updateEstado: async (data: ActualizarEstadoSalaRequest): Promise<Sala> => {
    const response = await apiRequest<any>(`/sessions/${data.id_sala}/status/`, {
      method: 'PATCH',
      body: { status: data.estado }
    });
    return mapSala(response);
  },

  importStudents: async (id_sala: number, students: ImportStudentPayload[]): Promise<SalaConDetalles> => {
    const response = await apiRequest<any>(`/sessions/${id_sala}/import-students/`, {
      method: 'POST',
      body: { students }
    });
    return mapSalaConDetalles(response);
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest<void>(`/sessions/${id}/`, { method: 'DELETE' });
  }
};

// =========================================================
// Equipos
// =========================================================

export const equipoApi = {
  create: async (data: CrearEquipoRequest): Promise<Equipo> => {
    const payload = {
      name: data.nombre_equipo,
      modality: data.modalidad ? 'known' : 'unknown',
      session_id: data.id_sala,
      challenge_id: data.id_desafio
    };
    const response = await apiRequest<any>('/teams/', {
      method: 'POST',
      body: payload
    });
    return mapEquipo(response);
  },

  getById: async (id: number): Promise<Equipo> => {
    const response = await apiRequest<any>(`/teams/${id}/`);
    return mapEquipo(response);
  },

  getBySala: async (id_sala: number): Promise<Equipo[]> => {
    const response = await apiRequest<any[]>(`/teams/?session=${id_sala}`);
    return response.map(mapEquipo);
  },

  updatePuntaje: async (data: ActualizarPuntajeEquipoRequest): Promise<Equipo> => {
    const response = await apiRequest<any>(`/teams/${data.id_equipo}/score/`, {
      method: 'POST',
      body: { puntaje_adicional: data.puntaje_adicional }
    });
    return mapEquipo(response);
  },

  asignarAlumno: async (data: AsignarAlumnoEquipoRequest): Promise<void> => {
    await apiRequest<void>(`/teams/${data.id_equipo}/enroll/`, {
      method: 'POST',
      body: { student_ids: [data.id_alumno] }
    });
  },

  removerAlumno: async (id_alumno: number, id_equipo: number): Promise<void> => {
    await apiRequest<void>(`/teams/${id_equipo}/students/${id_alumno}/`, {
      method: 'DELETE'
    });
  }
};

// =========================================================
// Alumnos
// =========================================================

export const alumnoApi = {
  create: async (data: Omit<Alumno, 'id_alumno'>): Promise<Alumno> => {
    const payload = {
      name: data.nombre,
      career: data.carrera,
      email: data.correo_udd
    };
    const response = await apiRequest<any>('/students/', {
      method: 'POST',
      body: payload
    });
    return mapAlumno(response);
  },

  getById: async (id: number): Promise<Alumno> => {
    const response = await apiRequest<any>(`/students/${id}/`);
    return mapAlumno(response);
  },

  getByEquipo: async (id_equipo: number): Promise<Alumno[]> => {
    const response = await apiRequest<any[]>(`/students/?team=${id_equipo}`);
    return response.map(mapAlumno);
  }
};

// =========================================================
// Temas y Desafíos
// =========================================================

export const temaApi = {
  getAll: async (): Promise<Tema[]> => {
    const response = await apiRequest<any>('/themes/');
    return asArray(response).map(mapTema);
  },

  getByFacultad: async (id_facultad: number): Promise<Tema[]> => {
    const response = await apiRequest<any>(`/themes/?faculty=${id_facultad}`);
    return asArray(response).map(mapTema);
  },

  getById: async (id: number): Promise<Tema> => {
    const response = await apiRequest<any>(`/themes/${id}/`);
    return mapTema(response);
  }
};

export const desafioApi = {
  getAll: async (): Promise<Desafio[]> => {
    const response = await apiRequest<any>('/challenges/');
    return asArray(response).map(mapDesafio);
  },

  getByTema: async (id_tema: number): Promise<Desafio[]> => {
    const response = await apiRequest<any>(`/challenges/?theme=${id_tema}`);
    return asArray(response).map(mapDesafio);
  },

  getById: async (id: number): Promise<Desafio> => {
    const response = await apiRequest<any>(`/challenges/${id}/`);
    return mapDesafio(response);
  }
};

// =========================================================
// Actividades
// =========================================================

export const actividadApi = {
  getAll: async (): Promise<Actividad[]> => {
    const response = await apiRequest<any>('/activities/');
    return asArray(response).map(mapActividad);
  },

  getByEtapa: async (id_etapa: number): Promise<Actividad[]> => {
    const response = await apiRequest<any>(`/activities/?stage=${id_etapa}`);
    return asArray(response).map(mapActividad);
  },

  getById: async (id: number): Promise<Actividad> => {
    const response = await apiRequest<any>(`/activities/${id}/`);
    return mapActividad(response);
  }
};

// =========================================================
// Tokens
// =========================================================

export const tokensApi = {
  registrar: async (data: RegistrarTokensRequest): Promise<RegistroTokens> => {
    const payload = {
      issuer: data.emisor ?? 'Sistema',
      receiver: data.receptor ?? 'Equipo',
      amount: data.cantidad_tokens,
      reason: data.motivo,
      team: data.id_equipo,
      activity: data.id_actividad
    };
    const response = await apiRequest<any>('/tokens/', {
      method: 'POST',
      body: payload
    });
    return mapToken(response);
  },

  getByEquipo: async (id_equipo: number): Promise<RegistroTokens[]> => {
    const response = await apiRequest<any>(`/tokens/?team=${id_equipo}`);
    return asArray(response).map(mapToken);
  },

  getByActividad: async (id_actividad: number): Promise<RegistroTokens[]> => {
    const response = await apiRequest<any>(`/tokens/?activity=${id_actividad}`);
    return asArray(response).map(mapToken);
  }
};

// =========================================================
// Respuestas (evidencias)
// =========================================================

export const respuestaApi = {
  create: async (data: CrearRespuestaRequest): Promise<Respuesta> => {
    const payload = {
      text: data.respuesta_texto,
      image_url: data.imagen_url,
      team: data.id_equipo,
      activity: data.id_actividad
    };
    const response = await apiRequest<any>('/responses/', {
      method: 'POST',
      body: payload
    });
    return mapRespuesta(response);
  },

  getByEquipo: async (id_equipo: number): Promise<Respuesta[]> => {
    const response = await apiRequest<any>(`/responses/?team=${id_equipo}`);
    return asArray(response).map(mapRespuesta);
  },

  getByActividad: async (id_actividad: number): Promise<Respuesta[]> => {
    const response = await apiRequest<any>(`/responses/?activity=${id_actividad}`);
    return asArray(response).map(mapRespuesta);
  }
};

// =========================================================
// Preguntas y Encuestas
// =========================================================

export const preguntaApi = {
  getAll: async (): Promise<Pregunta[]> => {
    const response = await apiRequest<any>('/survey-questions/');
    return asArray(response).map(mapPregunta);
  },

  getById: async (id: number): Promise<Pregunta> => {
    const response = await apiRequest<any>(`/survey-questions/${id}/`);
    return mapPregunta(response);
  }
};

export const encuestaApi = {
  responder: async (data: Omit<RespuestaEncuesta, 'id_respuestaEncuesta'>): Promise<RespuestaEncuesta> => {
    const payload = {
      response: data.respuesta,
      student: data.id_alumno,
      question: data.id_pregunta
    };
    const response = await apiRequest<any>('/survey-responses/', {
      method: 'POST',
      body: payload
    });
    return mapRespuestaEncuesta(response);
  },

  getByAlumno: async (id_alumno: number): Promise<RespuestaEncuesta[]> => {
    const response = await apiRequest<any[]>(`/survey-responses/?student=${id_alumno}`);
    return response.map(mapRespuestaEncuesta);
  }
};

// =========================================================
// Exportación agrupada
// =========================================================

export default {
  auth: authApi,
  facultades: facultadApi,
  carreras: carreraApi,
  salas: salaApi,
  equipos: equipoApi,
  alumnos: alumnoApi,
  temas: temaApi,
  desafios: desafioApi,
  actividades: actividadApi,
  tokens: tokensApi,
  respuestas: respuestaApi,
  preguntas: preguntaApi,
  encuestas: encuestaApi
};
