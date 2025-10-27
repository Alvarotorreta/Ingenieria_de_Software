# 🎮 Juego de Emprendimiento - Integración con Backend

## 📦 Archivos Creados para la Integración

### 1. **Types y Interfaces** (`/types/database.ts`)
✅ Tipos TypeScript que coinciden 1:1 con tu base de datos MySQL
- Todas las tablas tienen su interfaz correspondiente
- DTOs para requests y responses
- Tipos auxiliares para el frontend

### 2. **Servicios API** (`/services/api.ts`)
✅ Módulo completo para comunicación con el backend
- Funciones para todas las entidades (Sala, Equipo, Alumno, etc.)
- Manejo automático de autenticación JWT
- Manejo centralizado de errores
- Headers automáticos con token

### 3. **Hook de Autenticación** (`/hooks/useAuth.ts`)
✅ Context y hook para manejar autenticación
- Login, registro y logout
- Persistencia en localStorage
- Redireccionamiento automático según tipo de usuario

### 4. **GameContext Actualizado** (`/contexts/GameContext.tsx`)
✅ Context mejorado con soporte para API
- Compatible con tipos de la DB
- Funciones para cargar desde API
- Sincronización bidireccional (local ↔ API)
- Manejo de tokens vía API

### 5. **Utilidades** (`/utils/helpers.ts`)
✅ Funciones auxiliares útiles
- Validaciones (email UDD, códigos, contraseñas)
- Formateo de fechas y números
- Copiar al portapapeles
- Generación de códigos
- Y mucho más...

### 6. **Constantes** (`/constants/index.ts`)
✅ Valores constantes del sistema
- Colores de equipos
- Estados de sala/actividad
- Mensajes de error/éxito
- Configuraciones
- Rutas del frontend

### 7. **Variables de Entorno** (`.env`)
✅ Configuración de la URL del API
```env
VITE_API_URL=http://localhost:8000/api
```

### 8. **Documentación**
- ✅ `INTEGRACION_BACKEND.md` - Guía completa de integración
- ✅ `EJEMPLO_USO_API.tsx` - Ejemplos prácticos de uso

---

## 🚀 Quick Start

### 1. Configurar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y cambia la URL según tu configuración
VITE_API_URL=http://localhost:8000/api
```

### 2. Estructura de Endpoints Requerida en Django

Tu backend debe exponer estos endpoints principales:

```
POST   /api/auth/login
POST   /api/auth/registro

GET    /api/facultades
GET    /api/facultades/:id/carreras

POST   /api/salas
GET    /api/salas/:id
GET    /api/salas/codigo/:codigo
PATCH  /api/salas/:id/estado

POST   /api/equipos
GET    /api/salas/:id_sala/equipos
PATCH  /api/equipos/:id/puntaje

POST   /api/tokens
GET    /api/equipos/:id_equipo/tokens

... (ver INTEGRACION_BACKEND.md para lista completa)
```

### 3. Datos Iniciales Requeridos en la DB

Antes de usar la aplicación, necesitas insertar estos datos:

```sql
-- Tipos de Usuario
INSERT INTO TipoUsuario (nombreTipoUsuario) VALUES 
  ('Profesor'),
  ('Administrador');

-- Etapas
INSERT INTO Etapa (nombre_etapa, descripcion) VALUES
  ('Etapa 1 - Creatividad', 'Desarrollo de pensamiento creativo'),
  ('Etapa 2 - Trabajo en Equipo', 'Colaboración efectiva'),
  ('Etapa 3 - Empatía', 'Comprensión de necesidades'),
  ('Etapa 4 - Comunicación', 'Presentación de ideas');

-- Facultades
INSERT INTO Facultad (nombre) VALUES
  ('Ingeniería'),
  ('Diseño'),
  ('Negocios'),
  ('Comunicaciones');

-- Carreras (ejemplo para Ingeniería)
INSERT INTO Carrera (nombre, id_facultad) VALUES
  ('Ingeniería Civil Informática', 1),
  ('Ingeniería Industrial', 1),
  ('Ingeniería en Construcción', 1);

-- Tipos de Pregunta
INSERT INTO TipoPregunta (descripcion) VALUES
  ('Escala 1-5'),
  ('Texto corto'),
  ('Texto largo');

-- Preguntas para la encuesta
INSERT INTO Pregunta (descripcion, id_tipoPregunta) VALUES
  ('¿Qué tan efectiva fue la comunicación en tu equipo?', 1),
  ('¿Qué tan creativa fue la solución propuesta?', 1),
  ('¿Cómo calificarías el trabajo en equipo?', 1),
  ('¿Qué tan empático fue tu equipo con el problema?', 1),
  ('¿Qué tan bien se organizaron las tareas?', 1),
  ('¿Qué tan satisfecho estás con el resultado final?', 1);
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Login

```tsx
import { useAuth } from './hooks/useAuth';

function LoginPage() {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        correo_udd: 'profesor@udd.cl',
        contrasena: 'password123'
      });
      // Redirige automáticamente a /profesor/home
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={handleLogin}>Iniciar Sesión</button>;
}
```

### Ejemplo 2: Crear Sala

```tsx
import { salaApi, equipoApi } from './services/api';
import { useGame } from './contexts/GameContext';
import { COLORES_EQUIPOS, NOMBRES_EQUIPOS } from './constants';

async function crearSalaCompleta(id_usuario: number, id_carrera: number) {
  // 1. Crear sala
  const sala = await salaApi.create({ id_usuario, id_carrera });
  
  // 2. Crear 4 equipos
  const colores = Object.values(COLORES_EQUIPOS);
  for (let i = 0; i < 4; i++) {
    await equipoApi.create({
      nombre_equipo: NOMBRES_EQUIPOS[i],
      modalidad: false,
      id_sala: sala.id_sala,
      id_desafio: 1,
      color: colores[i]
    });
  }
  
  // 3. Cargar en el contexto
  const salaCompleta = await salaApi.getById(sala.id_sala);
  return salaCompleta;
}
```

### Ejemplo 3: Tablet Entra a Sala

```tsx
import { useGame } from './contexts/GameContext';

function TabletEntrar() {
  const { loadSessionByCodigo } = useGame();

  const handleEntrar = async (codigo: string) => {
    try {
      await loadSessionByCodigo(codigo);
      // Sala cargada en session
    } catch (error) {
      console.error('Sala no encontrada');
    }
  };

  return <input onChange={(e) => handleEntrar(e.target.value)} />;
}
```

### Ejemplo 4: Otorgar Tokens

```tsx
import { useGame } from './contexts/GameContext';

function OtorgarTokens() {
  const { session, addTokensToAPI } = useGame();

  const otorgarTokens = async (equipoId: number, cantidad: number) => {
    await addTokensToAPI(
      equipoId,
      cantidad,
      'Excelente colaboración',
      1 // id_actividad
    );
  };

  return (
    <button onClick={() => otorgarTokens(session!.grupos[0].id_equipo, 50)}>
      +50 tokens
    </button>
  );
}
```

---

## 🔧 Adaptación de Componentes Existentes

### Cambios Necesarios en Componentes Actuales

#### 1. Login (`/pages/profesor/Login.tsx`)

```tsx
// ANTES
const handleLogin = () => {
  // Lógica manual de validación
  navigate('/profesor/home');
};

// DESPUÉS
import { useAuth } from '../../hooks/useAuth';

const { login, isLoading } = useAuth();

const handleLogin = async (e: FormEvent) => {
  e.preventDefault();
  try {
    await login({ correo_udd: email, contrasena: password });
    // Redirige automáticamente
  } catch (error) {
    toast.error('Credenciales inválidas');
  }
};
```

#### 2. Crear Sala (`/pages/profesor/CrearSala.tsx`)

```tsx
// ANTES
const handleCrear = () => {
  createSession({ 
    codigo: generarCodigo(),
    facultad,
    carrera 
  });
};

// DESPUÉS
import { salaApi, equipoApi } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const { usuario } = useAuth();
const { createSessionFromAPI } = useGame();

const handleCrear = async () => {
  // 1. Crear sala en DB
  const sala = await salaApi.create({
    id_usuario: usuario!.id_usuario,
    id_carrera: selectedCarrera
  });

  // 2. Crear equipos
  const colores = Object.values(COLORES_EQUIPOS);
  for (let i = 0; i < 4; i++) {
    await equipoApi.create({
      nombre_equipo: NOMBRES_EQUIPOS[i],
      modalidad: false,
      id_sala: sala.id_sala,
      id_desafio: 1,
      color: colores[i]
    });
  }

  // 3. Cargar en contexto
  const salaCompleta = await salaApi.getById(sala.id_sala);
  await createSessionFromAPI(salaCompleta);
  
  navigate(`/profesor/sala/${sala.id_sala}`);
};
```

#### 3. Sala del Profesor (`/pages/profesor/Sala.tsx`)

```tsx
// DESPUÉS
import { useParams } from 'react-router-dom';

const { id_sala } = useParams();
const { loadSession, session } = useGame();

useEffect(() => {
  if (id_sala) {
    loadSession(Number(id_sala));
  }
}, [id_sala]);

// Ahora session tiene los datos reales de la API
```

---

## 🔐 Seguridad y Mejores Prácticas

### 1. Token JWT
- Se guarda automáticamente en `localStorage` después del login
- Se incluye automáticamente en todas las peticiones
- Expira según configuración del backend

### 2. Manejo de Errores
```tsx
try {
  await salaApi.create(data);
} catch (error: any) {
  if (error.status === 401) {
    // Token expirado - redirigir a login
    authApi.logout();
    navigate('/profesor/login');
  } else if (error.status === 404) {
    toast.error('Recurso no encontrado');
  } else {
    toast.error(error.message);
  }
}
```

### 3. Validaciones
```tsx
import { validarEmailUDD, validarCodigoSala } from './utils/helpers';

// Validar antes de enviar al backend
if (!validarEmailUDD(email)) {
  toast.error('Email debe ser @udd.cl');
  return;
}
```

---

## 📋 Checklist de Integración

### Backend (Django)
- [ ] Implementar endpoints de autenticación
- [ ] Implementar endpoints de facultades/carreras
- [ ] Implementar endpoints de salas
- [ ] Implementar endpoints de equipos
- [ ] Implementar endpoints de tokens
- [ ] Configurar CORS
- [ ] Configurar JWT
- [ ] Precargar datos iniciales

### Frontend (React)
- [ ] Configurar `.env` con URL del API
- [ ] Actualizar Login para usar `useAuth`
- [ ] Actualizar Crear Sala para usar API
- [ ] Actualizar componentes de Sala
- [ ] Actualizar otorgamiento de tokens
- [ ] Probar flujo completo

---

## 🐛 Debugging

### Ver peticiones en la consola
```tsx
import { devLog } from './utils/helpers';

devLog('Sala creada:', sala);
```

### Inspeccionar token
```tsx
const token = localStorage.getItem('auth_token');
console.log('Token:', token);
```

### Ver sesión actual
```tsx
const { session } = useGame();
console.log('Sesión actual:', session);
```

---

## 📞 Soporte

Si necesitas ayuda con:
- Implementación de endpoints específicos en Django
- Adaptación de componentes existentes
- Resolución de errores
- Mejores prácticas

¡Pregunta! Estoy aquí para ayudarte a integrar todo correctamente.

---

## 🎯 Próximos Pasos

1. **Configura el backend** siguiendo `INTEGRACION_BACKEND.md`
2. **Revisa los ejemplos** en `EJEMPLO_USO_API.tsx`
3. **Adapta componente por componente** empezando por Login y Crear Sala
4. **Prueba el flujo completo** desde login hasta reflexión
5. **Optimiza y refina** según sea necesario

¡Éxito con la integración! 🚀
