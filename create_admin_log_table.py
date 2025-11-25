"""
Script para crear la tabla django_admin_log que falta
"""
import pymysql

DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '1234',
    'database': 'mision_emprende2',
    'charset': 'utf8mb4'
}

# SQL para crear la tabla django_admin_log según el esquema estándar de Django
CREATE_ADMIN_LOG_TABLE = """
CREATE TABLE IF NOT EXISTS `django_admin_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint(5) unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
"""

try:
    print("Creando tabla django_admin_log...")
    
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    # Crear la tabla
    cursor.execute(CREATE_ADMIN_LOG_TABLE)
    conn.commit()
    
    print("[OK] Tabla django_admin_log creada exitosamente")
    
    # Verificar que se creó
    cursor.execute("SHOW TABLES LIKE 'django_admin_log'")
    result = cursor.fetchone()
    
    if result:
        print("[OK] Verificación: La tabla existe")
    else:
        print("[ERROR] Verificación: La tabla no se encontró")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"[ERROR] Error al crear la tabla: {e}")
    import traceback
    traceback.print_exc()

