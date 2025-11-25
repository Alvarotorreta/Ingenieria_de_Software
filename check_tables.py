"""
Script para verificar qué tablas existen en la base de datos
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

try:
    conn = pymysql.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    # Obtener todas las tablas
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    
    print(f"Tablas encontradas en mision_emprende2: {len(tables)}")
    print("-" * 60)
    
    # Buscar tablas de Django
    django_tables = []
    other_tables = []
    
    for table in tables:
        table_name = table[0]
        if table_name.startswith('django_') or table_name.startswith('auth_'):
            django_tables.append(table_name)
        else:
            other_tables.append(table_name)
    
    print("\nTablas de Django/Auth:")
    for table in sorted(django_tables):
        print(f"  - {table}")
    
    print(f"\nTablas de la aplicación ({len(other_tables)}):")
    for table in sorted(other_tables):
        print(f"  - {table}")
    
    # Verificar específicamente django_admin_log
    if 'django_admin_log' in [t[0] for t in tables]:
        print("\n[OK] La tabla django_admin_log EXISTE")
    else:
        print("\n[ERROR] La tabla django_admin_log NO EXISTE")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

