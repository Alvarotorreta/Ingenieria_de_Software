# Misión Emprende

Sistema educativo gamificado para la enseñanza de emprendimiento, desarrollado con Django (backend) y React/TypeScript (frontend).

## 🚀 Características

- **Sesiones de Juego**: Sistema de salas con códigos QR para unirse
- **Múltiples Etapas**: Trabajo en equipo, Empatía, Creatividad, Comunicación
- **Desafíos y Retos**: Sistema de actividades y minijuegos
- **Evaluación**: Sistema de evaluación entre pares y reflexión
- **Panel de Profesor**: Gestión completa de sesiones y estudiantes
- **Interfaz para Tablets**: Experiencia optimizada para dispositivos móviles

## 📋 Requisitos

### Backend
- Python 3.11+
- MySQL
- Redis (para WebSockets)

### Frontend
- Node.js 18+
- npm o yarn

## 🛠️ Instalación

### Backend

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar base de datos (crear .env con configuración)
# Ejecutar migraciones
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser
```

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

## 📝 Uso de Git

Este proyecto está configurado para hacer commits y push regulares. Para facilitar el proceso, se incluyen scripts:

### Windows (PowerShell)
```powershell
.\git-commit-push.ps1 "Descripción de los cambios"
```

### Linux/Mac (Bash)
```bash
chmod +x git-commit-push.sh
./git-commit-push.sh "Descripción de los cambios"
```

### Configurar remoto (primera vez)

```bash
git remote add origin <url-del-repositorio>
git branch -M main
git push -u origin main
```

## 📁 Estructura del Proyecto

```
mision-emprende/
├── academic/          # Modelos académicos (cursos, facultades)
├── challenges/        # Desafíos, retos, actividades
├── game_sessions/     # Sesiones de juego, equipos, progreso
├── users/             # Usuarios, profesores, estudiantes
├── frontend/          # Aplicación React/TypeScript
├── mision_emprende_backend/  # Configuración Django
└── manage.py
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
SECRET_KEY=tu-secret-key
DEBUG=True
DATABASE_URL=mysql://usuario:password@localhost:3306/nombre_db
REDIS_URL=redis://localhost:6379/0
```

## 📚 API Documentation

Una vez que el servidor esté corriendo, la documentación de la API está disponible en:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

## 🧪 Testing

```bash
# Backend
pytest

# Frontend
npm test
```

## 📄 Licencia

[Especificar licencia]

## 👥 Contribuidores

[Especificar contribuidores]

