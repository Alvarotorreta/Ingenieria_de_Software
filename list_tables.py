"""Listar todas las tablas en SQLite"""
import sqlite3
import os

db_path = 'db.sqlite3'
if not os.path.exists(db_path):
    print(f"❌ No se encontró {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Obtener todas las tablas
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = [row[0] for row in cursor.fetchall()]

print(f"📊 Total de tablas encontradas: {len(tables)}\n")
print("=" * 60)
for table in tables:
    # Contar registros
    try:
        cursor.execute(f"SELECT COUNT(*) FROM {table}")
        count = cursor.fetchone()[0]
        print(f"  {table:40} {count:>6} registros")
    except:
        print(f"  {table:40} {'ERROR':>6}")

conn.close()

print("=" * 60)

