# Guía de Despliegue en EC2

## Prerrequisitos

- Instancia EC2 con Ubuntu/Debian
- Docker y Docker Compose instalados
- Acceso SSH a la instancia
- Servidor MySQL configurado (puede ser RDS o servidor separado)

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
# Copiar ejemplo
cp .env.example .env.prod

# Editar con tus valores
nano .env.prod
```

Configura estas variables:
- `DATABASE_HOST` - IP o dominio del servidor MySQL
- `DATABASE_USER` - Usuario de MySQL
- `DATABASE_PASSWORD` - Contraseña
- `DATABASE_NAME` - Nombre de la base de datos
- `SECRET_KEY` - Genera una con: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
- `REDIS_PASSWORD` - Contraseña para Redis
- `ALLOWED_HOSTS` - Tu dominio o IP de EC2
- `CORS_ALLOWED_ORIGINS` - URL del frontend
- `FRONTEND_URL` - URL completa del frontend

### 5. Desplegar con Docker Compose

```bash
# Construir y levantar servicios
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Verificar que todo funciona
docker-compose -f docker-compose.prod.yml ps
```

### 6. Configurar Base de Datos

La base de datos debe estar en un servidor MySQL separado. Asegúrate de:

1. Crear la base de datos en el servidor MySQL
2. Importar el esquema (si tienes un archivo SQL)
3. Verificar que el servidor MySQL permite conexiones remotas
4. Configurar Security Groups en AWS para permitir conexión desde EC2

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

# Reiniciar servicios
docker-compose -f docker-compose.prod.yml restart

# Detener servicios
docker-compose -f docker-compose.prod.yml down

# Actualizar código
git pull
docker-compose -f docker-compose.prod.yml up -d --build

# Ver estado de servicios
docker-compose -f docker-compose.prod.yml ps
```

## Troubleshooting

### Error de conexión a base de datos
- Verifica que el servidor MySQL permite conexiones remotas
- Verifica Security Groups en AWS
- Verifica que las credenciales son correctas
- Prueba la conexión: `mysql -h DATABASE_HOST -u DATABASE_USER -p`

### Error de permisos
```bash
sudo chown -R $USER:$USER .
```

### Verificar puertos
```bash
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :80
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

