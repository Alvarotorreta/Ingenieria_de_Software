"""
Script para crear más sopas de letras
Ejecutar: python create_word_searches.py
"""
import os
import django
import sys

# Configurar encoding para evitar errores
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mision_emprende_backend.settings')
django.setup()

from challenges.models import WordSearchOption, Activity
from challenges.services import generate_word_search
import random

print("Creando sopas de letras adicionales...")

try:
    # Buscar la actividad de minijuego
    from challenges.models import ActivityType
    minigame_type = ActivityType.objects.filter(code='minigame').first()
    if minigame_type:
        minigame_activity = Activity.objects.filter(
            activity_type=minigame_type,
            stage__number=1
        ).first()
    else:
        minigame_activity = Activity.objects.filter(
            name__icontains='minijuego',
            stage__number=1
        ).first()
    
    if not minigame_activity:
        # Buscar cualquier actividad de etapa 1 que tenga config_data con game_type='minigame'
        activities = Activity.objects.filter(stage__number=1)
        for act in activities:
            config = act.config_data or {}
            if config.get('game_type') == 'minigame':
                minigame_activity = act
                break
    
    # Si aún no se encuentra, usar la actividad con ID 2 (Presentación/Minijuego)
    if not minigame_activity:
        minigame_activity = Activity.objects.filter(id=2).first()
        if minigame_activity:
            print(f"Usando actividad ID 2: {minigame_activity.name}")
    
    if minigame_activity:
        # Crear 15 sopas de letras de ejemplo para mayor variedad
        word_sets = [
            (["IDEA", "META", "EQUIPO", "PITCH", "LIDER"], "Sopa de Letras 1"),
            (["NEGOCIO", "CLIENTE", "VENTA", "PRODUCTO", "MERCADO"], "Sopa de Letras 2"),
            (["CREATIVIDAD", "INNOVACION", "ESTRATEGIA", "PLANIFICACION", "OBJETIVO"], "Sopa de Letras 3"),
            (["COMUNICACION", "COLABORACION", "TRABAJO", "PROYECTO", "SOLUCION"], "Sopa de Letras 4"),
            (["LIDERAZGO", "MOTIVACION", "PASION", "VISION", "MISION"], "Sopa de Letras 5"),
            (["RIESGO", "EXITO", "FRACASO", "APRENDIZAJE", "EXPERIENCIA"], "Sopa de Letras 6"),
            (["CONOCIMIENTO", "HABILIDAD", "DESAFIO", "RETO", "COMPETENCIA"], "Sopa de Letras 7"),
            (["ORGANIZACION", "ADMINISTRACION", "GESTION", "DIRECCION", "SUPERVISION"], "Sopa de Letras 8"),
            (["PLANIFICACION", "EJECUCION", "EVALUACION", "MEJORA", "OPTIMIZACION"], "Sopa de Letras 9"),
            (["VALORES", "CULTURA", "ETICA", "RESPONSABILIDAD", "COMPROMISO"], "Sopa de Letras 10"),
            (["TECNOLOGIA", "DIGITAL", "INNOVACION", "TRANSFORMACION", "FUTURO"], "Sopa de Letras 11"),
            (["SERVICIO", "CALIDAD", "SATISFACCION", "EXPERIENCIA", "VALOR"], "Sopa de Letras 12"),
            (["FINANZAS", "INVERSION", "CAPITAL", "RECURSOS", "PRESUPUESTO"], "Sopa de Letras 13"),
            (["MARKETING", "PUBLICIDAD", "PROMOCION", "BRANDING", "POSICIONAMIENTO"], "Sopa de Letras 14"),
            (["NETWORKING", "CONTACTO", "RELACION", "ALIANZA", "PARTNERSHIP"], "Sopa de Letras 15"),
        ]
        
        created_word_searches = 0
        for words, name in word_sets:
            # Verificar si ya existe
            existing = WordSearchOption.objects.filter(
                activity=minigame_activity,
                name=name
            ).first()
            
            if existing:
                print(f"Ya existe: {name}")
                continue
            
            # Generar la sopa de letras
            seed = random.randint(1, 1000000)
            result = generate_word_search(words, seed=seed)
            
            word_search = WordSearchOption.objects.create(
                activity=minigame_activity,
                name=name,
                words=words,
                grid=result['grid'],
                word_positions=result['wordPositions'],
                seed=seed,
                is_active=True
            )
            created_word_searches += 1
            print(f"Creada: {name}")
        
        print(f"\n[OK] Creadas {created_word_searches} sopas de letras nuevas")
        print(f"Total de sopas de letras: {WordSearchOption.objects.filter(activity=minigame_activity, is_active=True).count()}")
    else:
        print("[ERROR] No se encontro la actividad de minijuego.")
except Exception as e:
    import traceback
    print(f"[ERROR] Error al crear sopas de letras: {str(e)}")
    print(traceback.format_exc())
