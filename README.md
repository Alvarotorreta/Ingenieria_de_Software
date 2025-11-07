# Misión Emprende - Backend

Backend Django REST API para el sistema de juego educativo **Misión Emprende**.

## 📋 Descripción

Sistema de juego educativo diseñado para que alumnos de primer año de universidad aprendan sobre emprendimiento de manera interactiva y colaborativa. El backend proporciona una API REST completa y comunicación en tiempo real mediante WebSockets.

## 🛠️ Tecnologías

- **Django 5.0.14** - Framework web
- **Django REST Framework 3.15.2** - API REST
- **Django Channels 4.1.0** - WebSockets para tiempo real
- **MySQL** - Base de datos
- **Redis** - Cache y Channels
- **JWT** - Autenticación
- **CORS** - Soporte para frontend separado

## 📦 Requisitos Previos

- Python 3.11+
- MySQL 8.0+
- Redis 6.0+
- Virtual Environment (venv)

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd mision-emprende
```

### 2. Crear y activar entorno virtual

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=mision_emprende
DB_USER=root
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=3306

REDIS_URL=redis://127.0.0.1:6379
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 5. Crear base de datos MySQL

```sql
CREATE DATABASE mision_emprende CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

O ejecuta el esquema completo:

```bash
mysql -u root -p < database_schema.sql
```

### 6. Aplicar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Crear superusuario (opcional)

```bash
python manage.py createsuperuser
```

### 8. Iniciar servidor de desarrollo

```bash
python manage.py runserver
```

El servidor estará disponible en `http://localhost:8000`

## 📁 Estructura del Proyecto

```
mision-emprende/
├── mision_emprende_backend/    # Configuración del proyecto
│   ├── settings.py             # Configuración principal
│   ├── urls.py                 # URLs principales
│   ├── asgi.py                 # Configuración ASGI (WebSockets)
│   └── routing.py              # Rutas WebSocket
├── users/                      # App de usuarios y autenticación
├── academic/                   # App de estructura académica
├── sessions/                   # App de sesiones de juego
├── challenges/                 # App de desafíos y retos
├── logs/                       # Logs de la aplicación
├── media/                      # Archivos subidos por usuarios
├── staticfiles/                # Archivos estáticos
├── requirements.txt            # Dependencias Python
├── database_schema.sql         # Esquema de base de datos
├── flujo.md                    # Documentación del juego
└── .env                        # Variables de entorno (no versionado)
```

## 🌐 Endpoints de la API

### Documentación

- **Swagger UI**: `http://localhost:8000/api/docs/`
- **ReDoc**: `http://localhost:8000/api/redoc/`
- **Schema**: `http://localhost:8000/api/schema/`

### Autenticación

- `POST /api/auth/token/` - Obtener token JWT
- `POST /api/auth/token/refresh/` - Refrescar token
- `POST /api/auth/token/verify/` - Verificar token

### APIs por App

- `/api/auth/` - Usuarios y autenticación
- `/api/academic/` - Estructura académica (facultades, carreras, cursos)
- `/api/sessions/` - Sesiones de juego y equipos
- `/api/challenges/` - Desafíos y retos

## 🔧 Configuración de Desarrollo

### Base de Datos

El proyecto está configurado para usar MySQL. Asegúrate de tener:

1. MySQL instalado y corriendo
2. Base de datos creada
3. Usuario con permisos

### Redis (Opcional pero recomendado)

Redis se usa para:
- Cache de Django
- Channels (WebSockets)

Si no tienes Redis, puedes usar un backend en memoria para desarrollo, pero no funcionarán los WebSockets.

### CORS

El backend está configurado para aceptar peticiones del frontend en:
- `http://localhost:3000` (React)
- `http://localhost:5173` (Vite)

Puedes agregar más orígenes en `.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000
```

## 🧪 Testing

```bash
# Ejecutar tests
python manage.py test

# Con pytest
pytest

# Con coverage
pytest --cov=. --cov-report=html
```

## 📝 Comandos Útiles

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Shell de Django
python manage.py shell

# Shell mejorado (con django-extensions)
python manage.py shell_plus

# Limpiar cache
python manage.py clear_cache

# Verificar configuración
python manage.py check
```

## 🔐 Seguridad

- **JWT Authentication** - Tokens seguros para autenticación
- **CORS** - Configurado para orígenes específicos
- **Django Axes** - Protección contra ataques de fuerza bruta
- **Rate Limiting** - Límites de peticiones
- **CSRF Protection** - Protección CSRF habilitada

## 📚 Documentación Adicional

- [Documentación del Juego](flujo.md)
- [Esquema de Base de Datos](database_schema.sql)
- [Django Documentation](https://docs.djangoproject.com/)
- [DRF Documentation](https://www.django-rest-framework.org/)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un proyecto universitario.

## 👥 Autores

- Tu nombre aquí

---

**Desarrollado con ❤️ para Misión Emprende**

