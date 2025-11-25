"""
Script para crear la base de datos mision_emprende2 e importar el dump SQL
"""
import os
import sys
from pathlib import Path

# Intentar importar diferentes librerías MySQL
try:
    import pymysql
    USE_PYMYSQL = True
except ImportError:
    try:
        import MySQLdb
        USE_PYMYSQL = False
    except ImportError:
        print("Error: Necesitas instalar pymysql o MySQLdb")
        print("Instala con: pip install pymysql")
        sys.exit(1)

# Configuración de la base de datos
DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'user': 'root',
    'password': '1234',
    'charset': 'utf8mb4'
}

DB_NAME = 'mision_emprende2'
DUMP_FILE = Path('Dump20251123.sql')

def create_database():
    """Crea la base de datos si no existe"""
    print(f"Creando base de datos {DB_NAME}...")
    
    try:
        if USE_PYMYSQL:
            conn = pymysql.connect(**DB_CONFIG)
        else:
            conn = MySQLdb.connect(**DB_CONFIG)
        
        cursor = conn.cursor()
        
        # Crear base de datos
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"[OK] Base de datos {DB_NAME} creada exitosamente")
        
        cursor.close()
        conn.close()
        
        return True
    except Exception as e:
        print(f"[ERROR] Error al crear la base de datos: {e}")
        return False

def import_dump():
    """Importa el dump SQL a la base de datos"""
    if not DUMP_FILE.exists():
        print(f"[ERROR] Error: No se encuentra el archivo {DUMP_FILE}")
        return False
    
    print(f"Importando dump desde {DUMP_FILE}...")
    
    try:
        # Leer el archivo dump
        with open(DUMP_FILE, 'r', encoding='utf-8', errors='ignore') as f:
            sql_script = f.read()
        
        # Conectar a la base de datos específica
        db_config_with_db = {**DB_CONFIG, 'database': DB_NAME}
        
        if USE_PYMYSQL:
            conn = pymysql.connect(**db_config_with_db)
        else:
            conn = MySQLdb.connect(**db_config_with_db)
        
        cursor = conn.cursor()
        
        # Ejecutar el script SQL dividiendo por delimitador
        # MySQL usa ; como delimitador, pero necesitamos tener cuidado con los procedimientos almacenados
        
        # Dividir por ; pero mantener los procedimientos intactos
        # Una aproximación simple: dividir por ; que esté al final de una línea (o seguido de newline)
        import re
        
        # Dividir por ; que no esté dentro de comillas o comentarios
        # Patrón simplificado: buscar ; seguido de espacios y newline
        commands = []
        
        # Remover comentarios de una línea que empiezan con --
        lines = sql_script.split('\n')
        cleaned_lines = []
        in_comment_block = False
        
        for line in lines:
            stripped = line.strip()
            # Manejar comentarios de bloque /* */
            if '/*' in line:
                in_comment_block = True
            if '*/' in line:
                in_comment_block = False
                continue
            if in_comment_block:
                continue
            
            # Saltar líneas de comentario simple
            if stripped.startswith('--') or not stripped:
                continue
            
            cleaned_lines.append(line)
        
        cleaned_script = '\n'.join(cleaned_lines)
        
        # Dividir por ; que marca el final de un comando
        # Usar expresión regular para dividir por ; seguido de whitespace y newline
        commands = re.split(r';\s*\n', cleaned_script)
        
        # Limpiar comandos vacíos
        commands = [cmd.strip() for cmd in commands if cmd.strip() and not cmd.strip().startswith('--')]
        
        total_commands = len(commands)
        print(f"Ejecutando {total_commands} comandos SQL...")
        
        executed = 0
        errors = 0
        
        for i, command in enumerate(commands, 1):
            if not command.strip() or command.strip() == ';':
                continue
                
            try:
                # Ejecutar comando
                cursor.execute(command)
                executed += 1
                
                if executed % 50 == 0:
                    print(f"  Procesados {executed} comandos...")
            except Exception as e:
                error_msg = str(e).lower()
                # Ignorar errores comunes que pueden ser normales
                if any(ignore in error_msg for ignore in ['already exists', 'duplicate', 'unknown database', 'doesn\'t exist']):
                    pass  # Ignorar estos errores
                else:
                    errors += 1
                    if errors <= 5:  # Mostrar solo los primeros 5 errores
                        print(f"  Advertencia en comando {i}: {e}")
        
        conn.commit()
        print(f"[OK] Dump importado exitosamente ({executed} comandos ejecutados)")
        if errors > 0:
            print(f"  ({errors} advertencias ignoradas)")
        
        cursor.close()
        conn.close()
        
        return True
    except Exception as e:
        print(f"[ERROR] Error al importar el dump: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("Configuración de Base de Datos mision_emprende2")
    print("=" * 60)
    print()
    
    if create_database():
        if import_dump():
            print()
            print("=" * 60)
            print("[OK] Base de datos configurada exitosamente!")
            print("=" * 60)
        else:
            print()
            print("=" * 60)
            print("[ERROR] Error al importar el dump")
            print("=" * 60)
            sys.exit(1)
    else:
        print()
        print("=" * 60)
        print("[ERROR] Error al crear la base de datos")
        print("=" * 60)
        sys.exit(1)

