# Guía de Despliegue en EC2

## Prerrequisitos

- Instancia EC2 con Ubuntu/Debian
- Docker y Docker Compose instalados
- Acceso SSH a la instancia
- **MySQL se ejecutará en un contenedor Docker** (incluido en docker-compose.prod.yml)

## Pasos de Despliegue

### 1. Conectar a EC2

```bash
ssh -i tu-key.pem ubuntu@tu-ip-ec2
```

### 2. Instalar Docker y Docker Compose

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Agregar usuario a grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar sesión
exit
# Volver a conectar
```

### 3. Clonar Repositorio

```bash
git clone https://github.com/Alvarotorreta/Ingenieria_de_Software.git
cd Ingenieria_de_Software

# Cambiar a la rama de despliegue
git checkout docker-ec2-deploy
```

### 4. Configurar Variables de Entorno

```bash
# Crear archivo .env.prod
nano .env.prod
```

**Configuración para MySQL en Docker:**

```env
# Base de datos MySQL (en contenedor Docker)
DATABASE_HOST=db
DATABASE_PORT=3306
DATABASE_NAME=proyecto_udd
DATABASE_USER=django_user
DATABASE_PASSWORD=Django123!
MYSQL_ROOT_PASSWORD=RootPassword123!

# Django
SECRET_KEY=tu_secret_key_generada_aqui
DEBUG=False
ALLOWED_HOSTS=tu-ip-ec2,tu-dominio.com
CORS_ALLOWED_ORIGINS=http://tu-ip-ec2,https://tu-dominio.com
FRONTEND_URL=http://tu-ip-ec2

# Redis
REDIS_PASSWORD=tu_contraseña_redis_segura
```

**Generar SECRET_KEY:**
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Nota importante:** 
- `DATABASE_HOST=db` apunta al servicio Docker (nombre del contenedor)
- `MYSQL_ROOT_PASSWORD` es necesaria para inicializar el contenedor MySQL
- Los datos de MySQL se guardan automáticamente en un volumen Docker (`db_prod_data`)

### 5. Desplegar con Docker Compose

```bash
# Construir y levantar servicios
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Verificar que todo funciona
docker-compose -f docker-compose.prod.yml ps
```

### 6. Ejecutar Migraciones

Una vez que los contenedores estén corriendo, ejecuta las migraciones de Django:

```bash
# Ejecutar migraciones de Django
docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate

# Crear superusuario (opcional, para acceder al admin)
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

**Nota:** La base de datos MySQL se crea automáticamente cuando el contenedor `db` inicia por primera vez, usando las variables de entorno `MYSQL_DATABASE`, `MYSQL_USER`, y `MYSQL_PASSWORD`.

### 7. Verificar Despliegue

```bash
# Verificar que los contenedores están corriendo
docker ps

# Ver logs del backend
docker-compose -f docker-compose.prod.yml logs backend

# Ver logs del frontend
docker-compose -f docker-compose.prod.yml logs frontend

# Probar backend
curl http://localhost:8000/api/health/

# Probar frontend
curl http://localhost:80
```

## Comandos Útiles

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f db

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Detener servicios
docker-compose -f docker-compose.prod.yml down

# Detener y eliminar volúmenes (¡CUIDADO! Esto borra la base de datos)
docker-compose -f docker-compose.prod.yml down -v

# Actualizar código
git pull
docker-compose -f docker-compose.prod.yml up -d --build

# Ver estado de servicios
docker-compose -f docker-compose.prod.yml ps

# Conectarse a MySQL (desde dentro del contenedor)
docker-compose -f docker-compose.prod.yml exec db mysql -u django_user -p proyecto_udd

# Hacer backup de la base de datos
docker-compose -f docker-compose.prod.yml exec db mysqldump -u django_user -p proyecto_udd > backup.sql

# Restaurar base de datos desde backup
docker-compose -f docker-compose.prod.yml exec -T db mysql -u django_user -p proyecto_udd < backup.sql
```

## Troubleshooting

### Error de conexión a base de datos

**Verificar que el contenedor MySQL está corriendo:**
```bash
docker-compose -f docker-compose.prod.yml ps db
docker-compose -f docker-compose.prod.yml logs db
```

**Verificar variables de entorno:**
```bash
docker-compose -f docker-compose.prod.yml exec backend env | grep DATABASE
```

**Probar conexión desde el contenedor backend:**
```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py dbshell
```

**Verificar que MySQL está saludable:**
```bash
docker-compose -f docker-compose.prod.yml exec db mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD}
```

**Reiniciar solo el servicio de base de datos:**
```bash
docker-compose -f docker-compose.prod.yml restart db
```

### Error de permisos
```bash
sudo chown -R $USER:$USER .
```

### Verificar puertos
```bash
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :3306
```

### MySQL no inicia o tiene errores
```bash
# Ver logs detallados de MySQL
docker-compose -f docker-compose.prod.yml logs --tail=100 db

# Verificar el estado del contenedor
docker-compose -f docker-compose.prod.yml ps db

# Reiniciar el contenedor MySQL
docker-compose -f docker-compose.prod.yml restart db

# Si el problema persiste, eliminar y recrear el contenedor (¡CUIDADO! Esto borra los datos)
docker-compose -f docker-compose.prod.yml stop db
docker-compose -f docker-compose.prod.yml rm -f db
docker-compose -f docker-compose.prod.yml up -d db
```

### Ver logs detallados
```bash
docker-compose -f docker-compose.prod.yml logs --tail=100 backend
```

## Configurar Nginx como Reverse Proxy (Opcional)

Si quieres usar un dominio y SSL:

```bash
sudo apt install nginx certbot python3-certbot-nginx

# Configurar Nginx
sudo nano /etc/nginx/sites-available/mision-emprende
```

Configuración de Nginx:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mision-emprende /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Configurar SSL
sudo certbot --nginx -d tu-dominio.com
```

