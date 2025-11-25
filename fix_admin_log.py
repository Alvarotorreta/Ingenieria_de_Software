"""
Script para crear la tabla django_admin_log que faltó en la importación
"""
import pymysql
import re

DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '1234',
    'database': 'mision_emprende2',
    'charset': 'utf8mb4'
}

def extract_create_table(dump_file):
    """Extrae el comando CREATE TABLE para django_admin_log del dump"""
    with open(dump_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Buscar la sección de django_admin_log
    # Buscar desde "DROP TABLE IF EXISTS `django_admin_log`" hasta el final del CREATE TABLE
    pattern = r'DROP TABLE IF EXISTS `django_admin_log`.*?CREATE TABLE `django_admin_log`.*?ENGINE=InnoDB[^;]*;'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        sql = match.group(0)
        # Limpiar comentarios condicionales de MySQL
        sql = re.sub(r'/\*![\d]+\s+SET[^;]*;\s*\*/', '', sql)
        sql = re.sub(r'/\*![\d]+\s+.*?\*/', '', sql)
        return sql
    return None

try:
    print("Extrayendo comando CREATE TABLE desde el dump...")
    sql_commands = extract_create_table('Dump20251123.sql')
    
    if not sql_commands:
        print("[ERROR] No se pudo extraer el comando del dump")
        # Usar comando manual como fallback
        sql_commands = """DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=187 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"""
        print("Usando comando manual...")
    
    print("Creando tabla django_admin_log...")
    
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    # Ejecutar los comandos uno por uno
    commands = [cmd.strip() for cmd in sql_commands.split(';') if cmd.strip()]
    
    for cmd in commands:
        if cmd:
            try:
                cursor.execute(cmd)
            except Exception as e:
                # Si ya existe, no es problema
                if 'already exists' not in str(e).lower():
                    print(f"  Ejecutando: {cmd[:50]}...")
    
    conn.commit()
    print("[OK] Tabla django_admin_log creada exitosamente")
    
    # Verificar
    cursor.execute("SHOW TABLES LIKE 'django_admin_log'")
    result = cursor.fetchone()
    if result:
        print("[OK] Verificación: La tabla existe")
        
        # Ver estructura
        cursor.execute("DESCRIBE django_admin_log")
        columns = cursor.fetchall()
        print(f"  Columnas: {len(columns)}")
    else:
        print("[ERROR] La tabla no se encontró después de crearla")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"[ERROR] Error: {e}")
    import traceback
    traceback.print_exc()

