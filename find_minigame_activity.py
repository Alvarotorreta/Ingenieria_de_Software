import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mision_emprende_backend.settings')
django.setup()

from challenges.models import Activity

print("Buscando actividades de Etapa 1:")
activities = Activity.objects.filter(stage__number=1)
for a in activities:
    print(f"  ID: {a.id}, Nombre: {a.name}, Tipo: {a.activity_type.name if a.activity_type else 'sin tipo'}")



