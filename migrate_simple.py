"""
Script simple para migrar datos usando comandos de Django directamente
"""
import os
import sys

# Agregar el directorio del proyecto al path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, BASE_DIR)

# Cambiar temporalmente settings para usar SQLite
os.environ['DJANGO_SETTINGS_MODULE'] = 'mision_emprende_backend.settings'

# Importar y modificar settings ANTES de django.setup()
from django.conf import settings

# Guardar configuración MySQL original
mysql_config = settings.DATABASES['default'].copy()

# Cambiar a SQLite
settings.DATABASES['default'] = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
}

# Ahora sí hacer setup
import django
django.setup()

from django.core.management import call_command
import json

print("=" * 60)
print("📦 EXPORTANDO DATOS DE SQLITE")
print("=" * 60)

# Apps a exportar (en orden de dependencias)
apps = [
    # Django core (sin dependencias)
    'contenttypes',
    'auth',
    'sessions',
    'admin',  # django_admin_log
    
    # Third-party security
    'axes',  # axes_accesslog, axes_accessattempt, etc.
    
    # Project apps
    'academic',
    'challenges',
    'users',
    'game_sessions',
]

output_file = 'data_export.json'

try:
    with open(output_file, 'w', encoding='utf-8') as f:
        call_command('dumpdata', *apps, 
                    natural_foreign=True, 
                    natural_primary=True,
                    indent=2,
                    stdout=f,
                    verbosity=1)
    
    # Verificar contenido
    with open(output_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"\n✅ Exportado: {len(data)} objetos a {output_file}")
    
    # Contar por app
    from collections import defaultdict
    counts = defaultdict(int)
    for item in data:
        app_label = item['model'].split('.')[0]
        counts[app_label] += 1
    
    print("\n📋 Distribución:")
    for app, count in sorted(counts.items()):
        print(f"   {app}: {count}")
    
    print("\n" + "=" * 60)
    print("✅ EXPORTACIÓN COMPLETADA")
    print("=" * 60)
    print(f"\nAhora ejecuta: python manage.py loaddata {output_file}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

