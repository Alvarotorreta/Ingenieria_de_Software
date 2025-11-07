# Mission Emprende Backend

## Prerrequisitos
- Python 3.11
- MySQL 8.x
- Redis 7.x
- Node.js 18 (para frontend)

## Instalación local
```bash
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

## Ejecución con Docker
```bash
docker-compose up --build
```
Backend: http://localhost:8000/api
Frontend: http://localhost:5173

## Aplicaciones
- `accounts`: usuarios y roles personalizados.
- `game`: sesiones, equipos, actividades, tokens y métricas.

## Endpoints clave
- Autenticación JWT: `POST /api/auth/login/`
- Refresco: `POST /api/auth/refresh/`
- Gestión de sesiones: `GET/POST /api/sessions/`
- Equipos y tokens: `/api/teams/`, `/api/tokens/`
- Usuarios (admin): `/api/users/`

## Tiempo real
- WebSocket: `ws://localhost:8000/ws/sessions/<session_code>/`
- Backend usa Channels + Redis para sincronización en vivo.

## Migraciones iniciales
Ejecuta `python manage.py loaddata demo_data.json` (archivo opcional a crear con datos base).
