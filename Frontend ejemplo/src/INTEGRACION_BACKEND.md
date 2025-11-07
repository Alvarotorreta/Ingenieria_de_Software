# Guía de Integración con Backend

## 📋 Estructura Creada

### 1. Tipos TypeScript (`/types/database.ts`)
- ✅ Todos los tipos coinciden con las tablas de la base de datos MySQL
- ✅ Interfaces para DTOs (Data Transfer Objects)
- ✅ Tipos auxiliares para el frontend

### 2. Servicios API (`/services/api.ts`)
- ✅ Funciones para todas las entidades de la DB
- ✅ Manejo de autenticación con JWT
- ✅ Manejo de errores centralizado
- ✅ Headers automáticos con token

### 3. Hook de Autenticación (`/hooks/useAuth.ts`)
- ✅ Context de autenticación
- ✅ Login, registro y logout
- ✅ Persistencia en localStorage
- ✅ Redireccionamiento automático

### 4. GameContext Actualizado (`/contexts/GameContext.tsx`)
- ✅ Compatible con tipos de la DB
- ✅ Funciones para cargar desde API
- ✅ Sincronización bidireccional
- ✅ Manejo de tokens vía API

## 🔧 Configuración Necesaria

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000/api
```

**Importante:** Cambia la URL según donde esté desplegado tu backend Django.

### 2. Endpoints del Backend

Tu backend Django debe exponer estos endpoints:

#### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/registro` - Registro de usuario

#### Facultades y Carreras
- `GET /api/facultades` - Listar todas las facultades
- `GET /api/facultades/:id` - Obtener facultad por ID
- `GET /api/facultades/:id/carreras` - Carreras de una facultad
- `GET /api/carreras` - Listar todas las carreras
- `GET /api/carreras/:id` - Obtener carrera por ID

#### Salas
- `POST /api/salas` - Crear nueva sala
- `GET /api/salas/:id` - Obtener sala por ID (con equipos y alumnos)
- `GET /api/salas/codigo/:codigo` - Obtener sala por código
- `GET /api/salas/profesor/:id_usuario` - Salas de un profesor
- `PATCH /api/salas/:id/estado` - Actualizar estado de sala
- `DELETE /api/salas/:id` - Eliminar sala

#### Equipos
- `POST /api/equipos` - Crear equipo
- `GET /api/equipos/:id` - Obtener equipo por ID
- `GET /api/salas/:id_sala/equipos` - Equipos de una sala
- `PATCH /api/equipos/:id/puntaje` - Actualizar puntaje
- `POST /api/equipos/asignar-alumno` - Asignar alumno a equipo
- `DELETE /api/equipos/:id_equipo/alumnos/:id_alumno` - Remover alumno

#### Alumnos
- `POST /api/alumnos` - Crear alumno
- `GET /api/alumnos/:id` - Obtener alumno
- `GET /api/equipos/:id_equipo/alumnos` - Alumnos de un equipo

#### Temas y Desafíos
- `GET /api/temas` - Todos los temas
- `GET /api/facultades/:id_facultad/temas` - Temas de una facultad
- `GET /api/temas/:id` - Tema por ID
- `GET /api/desafios` - Todos los desafíos
- `GET /api/temas/:id_tema/desafios` - Desafíos de un tema
- `GET /api/desafios/:id` - Desafío por ID

#### Actividades
- `GET /api/actividades` - Todas las actividades
- `GET /api/etapas/:id_etapa/actividades` - Actividades de una etapa
- `GET /api/actividades/:id` - Actividad por ID

#### Tokens
- `POST /api/tokens` - Registrar tokens
- `GET /api/equipos/:id_equipo/tokens` - Tokens de un equipo
- `GET /api/actividades/:id_actividad/tokens` - Tokens de una actividad

#### Respuestas
- `POST /api/respuestas` - Crear respuesta
- `GET /api/equipos/:id_equipo/respuestas` - Respuestas de un equipo
- `GET /api/actividades/:id_actividad/respuestas` - Respuestas de una actividad

#### Encuestas
- `GET /api/preguntas` - Todas las preguntas
- `GET /api/preguntas/:id` - Pregunta por ID
- `POST /api/encuestas/responder` - Responder encuesta
- `GET /api/alumnos/:id_alumno/encuestas` - Respuestas de un alumno

## 🚀 Cómo Usar en los Componentes

### Ejemplo 1: Login de Profesor

```tsx
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        correo_udd: email,
        contrasena: password
      });
      // Redirige automáticamente
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button disabled={isLoading}>Iniciar Sesión</button>
    </form>
  );
}
```

### Ejemplo 2: Crear Sala

```tsx
import { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { useAuth } from '../hooks/useAuth';
import { facultadApi, salaApi, equipoApi } from '../services/api';

function CrearSala() {
  const { usuario } = useAuth();
  const { createSessionFromAPI } = useGame();
  const [facultades, setFacultades] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [selectedFacultad, setSelectedFacultad] = useState('');
  const [selectedCarrera, setSelectedCarrera] = useState('');

  // Cargar facultades
  useEffect(() => {
    facultadApi.getAll().then(setFacultades);
  }, []);

  // Cargar carreras cuando cambia la facultad
  useEffect(() => {
    if (selectedFacultad) {
      facultadApi.getCarreras(Number(selectedFacultad)).then(setCarreras);
    }
  }, [selectedFacultad]);

  const handleCrearSala = async () => {
    try {
      // 1. Crear sala en la DB
      const sala = await salaApi.create({
        id_usuario: usuario!.id_usuario,
        id_carrera: Number(selectedCarrera)
        // codigo_acceso se genera automáticamente
      });

      // 2. Crear los 4 equipos
      const colores = ['#ff4757', '#3742fa', '#2ed573', '#ffa502'];
      const nombres = ['Grupo Rojo', 'Grupo Azul', 'Grupo Verde', 'Grupo Amarillo'];
      
      for (let i = 0; i < 4; i++) {
        await equipoApi.create({
          nombre_equipo: nombres[i],
          modalidad: false,
          id_sala: sala.id_sala,
          id_desafio: 1, // Ajustar según corresponda
          color: colores[i]
        });
      }

      // 3. Cargar sala con equipos y crear sesión
      const salaCompleta = await salaApi.getById(sala.id_sala);
      await createSessionFromAPI(salaCompleta);

      // 4. Navegar a la sala
      navigate(`/profesor/sala/${sala.id_sala}`);
    } catch (error) {
      console.error('Error al crear sala:', error);
    }
  };

  return (
    <div>
      <select value={selectedFacultad} onChange={e => setSelectedFacultad(e.target.value)}>
        {facultades.map(f => (
          <option key={f.id_facultad} value={f.id_facultad}>{f.nombre}</option>
        ))}
      </select>

      <select value={selectedCarrera} onChange={e => setSelectedCarrera(e.target.value)}>
        {carreras.map(c => (
          <option key={c.id_carrera} value={c.id_carrera}>{c.nombre}</option>
        ))}
      </select>

      <button onClick={handleCrearSala}>Crear Sala</button>
    </div>
  );
}
```

### Ejemplo 3: Cargar Sala (Tablet entra con código)

```tsx
import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useNavigate } from 'react-router-dom';

function TabletEntrar() {
  const { loadSessionByCodigo, isLoading } = useGame();
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();

  const handleEntrar = async () => {
    try {
      await loadSessionByCodigo(codigo);
      navigate('/tablet/sala');
    } catch (error) {
      console.error('Error al entrar:', error);
    }
  };

  return (
    <div>
      <input 
        value={codigo} 
        onChange={e => setCodigo(e.target.value)} 
        placeholder="Código de 6 dígitos"
        maxLength={6}
      />
      <button onClick={handleEntrar} disabled={isLoading}>
        Entrar
      </button>
    </div>
  );
}
```

### Ejemplo 4: Otorgar Tokens

```tsx
import { useGame } from '../contexts/GameContext';

function OtorgarTokensComponent() {
  const { session, addTokensToAPI } = useGame();

  const handleOtorgar = async (equipoIndex: number, cantidad: number) => {
    const equipo = session?.grupos[equipoIndex];
    if (!equipo?.id_equipo) return;

    try {
      await addTokensToAPI(
        equipo.id_equipo,
        cantidad,
        'Excelente trabajo en equipo',
        1 // id_actividad actual
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      {session?.grupos.map((grupo, index) => (
        <button key={index} onClick={() => handleOtorgar(index, 50)}>
          Dar 50 tokens a {grupo.nombre_equipo}
        </button>
      ))}
    </div>
  );
}
```

## 🔐 Autenticación

El sistema usa JWT (JSON Web Tokens). El token se guarda automáticamente en `localStorage` después del login y se envía en todas las peticiones subsiguientes.

### Proteger Rutas

```tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/profesor/login" />;

  return <>{children}</>;
}
```

## 📊 Datos que Necesitas Precargar en la DB

Para que el juego funcione, necesitas tener en la base de datos:

1. **TipoUsuario**
   - ID 1: "Profesor"
   - ID 2: "Administrador"

2. **Etapas** (4 etapas del juego)
   - ID 1: "Etapa 1 - Creatividad"
   - ID 2: "Etapa 2 - Trabajo en Equipo"
   - ID 3: "Etapa 3 - Empatía"
   - ID 4: "Etapa 4 - Comunicación"

3. **Facultades**
   - Ingeniería
   - Diseño
   - Negocios
   - Comunicaciones

4. **Carreras** (por cada facultad)

5. **Temas** (por cada facultad) - Ver archivo `EleccionTematica.tsx` para las temáticas

6. **TipoActividad** (tipos de actividades por etapa)
   - Anagrama, Bubble Map, Lego, Pitch, etc.

7. **Preguntas** (para la encuesta de reflexión) - 6 preguntas

## 🛠️ Troubleshooting

### Error: CORS
Si ves errores de CORS, asegúrate de configurar Django:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # URL del frontend
]
```

### Error: 401 Unauthorized
El token expiró o no está presente. Hacer logout y login nuevamente.

### Error: 404 Not Found
Verifica que los endpoints del backend coincidan con los del archivo `api.ts`.

## 📝 Próximos Pasos

1. ✅ Configurar variables de entorno (`.env`)
2. ✅ Implementar endpoints en Django
3. ✅ Precargar datos iniciales en la DB
4. ✅ Actualizar componentes para usar API en lugar de datos mock
5. ✅ Probar flujo completo: Login → Crear Sala → Jugar → Reflexión

## 🤝 Necesitas Ayuda?

Si tienes dudas sobre:
- Cómo adaptar un componente específico
- Cómo estructurar un endpoint en Django
- Cómo manejar casos especiales

¡Pregunta! Estoy aquí para ayudarte.
