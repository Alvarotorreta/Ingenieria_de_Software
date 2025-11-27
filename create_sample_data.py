"""
Script para crear datos de ejemplo en la base de datos
Ejecutar: python manage.py shell < create_sample_data.py
O mejor: python manage.py shell
Luego copiar y pegar el contenido de este archivo
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mision_emprende_backend.settings')
django.setup()

from challenges.models import (
    AnagramWord, ChaosQuestion, GeneralKnowledgeQuestion,
    WordSearchOption, Activity
)
from challenges.services import generate_word_search
import random

print("Creando datos de ejemplo...")

# 1. Crear palabras de Anagrama
print("\n[1/4] Creando palabras de Anagrama...")
anagram_words = [
    "EMPRENDIMIENTO", "INNOVACION", "CREATIVIDAD", "LIDERAZGO", "EQUIPO",
    "NEGOCIO", "CLIENTE", "PRODUCTO", "VENTA", "MARKETING",
    "ESTRATEGIA", "PLANIFICACION", "OBJETIVO", "META", "RESULTADO",
    "COMPETENCIA", "MERCADO", "OPORTUNIDAD", "RIESGO", "EXITO",
    "FRACASO", "APRENDIZAJE", "EXPERIENCIA", "CONOCIMIENTO", "HABILIDAD",
    "COMUNICACION", "COLABORACION", "TRABAJO", "PROYECTO", "SOLUCION",
    "PROBLEMA", "DESAFIO", "RETO", "MOTIVACION", "PASION",
    "VISION", "MISION", "VALORES", "CULTURA", "ORGANIZACION",
    "ADMINISTRACION", "GESTION", "DIRECCION", "SUPERVISION", "COORDINACION",
    "PLANIFICACION", "EJECUCION", "EVALUACION", "MEJORA", "OPTIMIZACION"
]

created_anagrams = 0
for word in anagram_words:
    word_obj, created = AnagramWord.objects.get_or_create(
        word=word,
        defaults={'is_active': True}
    )
    if created:
        created_anagrams += 1
        # El modelo auto-genera scrambled_word en el save()
        word_obj.save()

print(f"[OK] Creadas {created_anagrams} palabras de Anagrama (total: {AnagramWord.objects.count()})")

# 2. Crear Preguntas del Caos
print("\n[2/4] Creando Preguntas del Caos...")
chaos_questions = [
    "¿Cuál es tu mayor miedo al emprender?",
    "¿Qué te motiva más en la vida?",
    "¿Cuál es tu superpoder oculto?",
    "¿Qué harías si tuvieras un millón de dólares?",
    "¿Cuál es tu comida favorita?",
    "¿Qué animal te representa mejor y por qué?",
    "¿Cuál es tu película favorita?",
    "¿Qué lugar del mundo te gustaría visitar?",
    "¿Cuál es tu hobby favorito?",
    "¿Qué te hace reír?",
    "¿Cuál es tu mayor fortaleza?",
    "¿Qué te gustaría aprender?",
    "¿Cuál es tu sueño más grande?",
    "¿Qué te inspira?",
    "¿Cuál es tu canción favorita?",
    "¿Qué te relaja?",
    "¿Cuál es tu libro favorito?",
    "¿Qué te enoja?",
    "¿Cuál es tu mayor logro?",
    "¿Qué te da miedo?",
    "¿Cuál es tu color favorito?",
    "¿Qué te hace feliz?",
    "¿Cuál es tu estación del año favorita?",
    "¿Qué te sorprende?",
    "¿Cuál es tu deporte favorito?",
    "¿Qué te emociona?",
    "¿Cuál es tu serie favorita?",
    "¿Qué te frustra?",
    "¿Cuál es tu juego favorito?",
    "¿Qué te apasiona?",
]

created_chaos = 0
for question in chaos_questions:
    question_obj, created = ChaosQuestion.objects.get_or_create(
        question=question,
        defaults={'is_active': True}
    )
    if created:
        created_chaos += 1

print(f"[OK] Creadas {created_chaos} preguntas del Caos (total: {ChaosQuestion.objects.count()})")

# 3. Crear Preguntas de Conocimiento General
print("\n[3/4] Creando Preguntas de Conocimiento General...")
general_knowledge_questions = [
    {
        "question": "¿Cuál es la capital de Francia?",
        "option_a": "Londres",
        "option_b": "París",
        "option_c": "Madrid",
        "option_d": "Roma",
        "correct_answer": 1
    },
    {
        "question": "¿En qué año llegó el hombre a la Luna?",
        "option_a": "1965",
        "option_b": "1969",
        "option_c": "1972",
        "option_d": "1975",
        "correct_answer": 1
    },
    {
        "question": "¿Cuál es el océano más grande del mundo?",
        "option_a": "Atlántico",
        "option_b": "Índico",
        "option_c": "Pacífico",
        "option_d": "Ártico",
        "correct_answer": 2
    },
    {
        "question": "¿Quién pintó la Mona Lisa?",
        "option_a": "Picasso",
        "option_b": "Van Gogh",
        "option_c": "Leonardo da Vinci",
        "option_d": "Miguel Ángel",
        "correct_answer": 2
    },
    {
        "question": "¿Cuál es el planeta más cercano al Sol?",
        "option_a": "Venus",
        "option_b": "Tierra",
        "option_c": "Mercurio",
        "option_d": "Marte",
        "correct_answer": 2
    },
    {
        "question": "¿Cuántos continentes hay en el mundo?",
        "option_a": "5",
        "option_b": "6",
        "option_c": "7",
        "option_d": "8",
        "correct_answer": 2
    },
    {
        "question": "¿Cuál es el río más largo del mundo?",
        "option_a": "Amazonas",
        "option_b": "Nilo",
        "option_c": "Misisipi",
        "option_d": "Yangtsé",
        "correct_answer": 0
    },
    {
        "question": "¿En qué continente está Egipto?",
        "option_a": "Asia",
        "option_b": "Europa",
        "option_c": "África",
        "option_d": "América",
        "correct_answer": 2
    },
    {
        "question": "¿Cuál es la montaña más alta del mundo?",
        "option_a": "K2",
        "option_b": "Kilimanjaro",
        "option_c": "Everest",
        "option_d": "Aconcagua",
        "correct_answer": 2
    },
    {
        "question": "¿Quién escribió 'Don Quijote de la Mancha'?",
        "option_a": "Gabriel García Márquez",
        "option_b": "Miguel de Cervantes",
        "option_c": "Pablo Neruda",
        "option_d": "Mario Vargas Llosa",
        "correct_answer": 1
    },
    {
        "question": "¿Cuál es el elemento químico más abundante en el universo?",
        "option_a": "Oxígeno",
        "option_b": "Hidrógeno",
        "option_c": "Helio",
        "option_d": "Carbono",
        "correct_answer": 1
    },
    {
        "question": "¿En qué año comenzó la Segunda Guerra Mundial?",
        "option_a": "1937",
        "option_b": "1939",
        "option_c": "1941",
        "option_d": "1943",
        "correct_answer": 1
    },
    {
        "question": "¿Cuál es el país más grande del mundo?",
        "option_a": "China",
        "option_b": "Estados Unidos",
        "option_c": "Rusia",
        "option_d": "Canadá",
        "correct_answer": 2
    },
    {
        "question": "¿Qué instrumento tocaba Mozart?",
        "option_a": "Violín",
        "option_b": "Piano",
        "option_c": "Flauta",
        "option_d": "Todos los anteriores",
        "correct_answer": 3
    },
    {
        "question": "¿Cuál es el animal más rápido del mundo?",
        "option_a": "Guepardo",
        "option_b": "León",
        "option_c": "Águila",
        "option_d": "Pez vela",
        "correct_answer": 0
    },
    {
        "question": "¿Cuántos huesos tiene el cuerpo humano adulto?",
        "option_a": "196",
        "option_b": "206",
        "option_c": "216",
        "option_d": "226",
        "correct_answer": 1
    },
    {
        "question": "¿Cuál es la velocidad de la luz?",
        "option_a": "300,000 km/s",
        "option_b": "150,000 km/s",
        "option_c": "450,000 km/s",
        "option_d": "600,000 km/s",
        "correct_answer": 0
    },
    {
        "question": "¿En qué país está la Torre Eiffel?",
        "option_a": "Italia",
        "option_b": "España",
        "option_c": "Francia",
        "option_d": "Alemania",
        "correct_answer": 2
    },
    {
        "question": "¿Cuál es el idioma más hablado del mundo?",
        "option_a": "Inglés",
        "option_b": "Español",
        "option_c": "Mandarín",
        "option_d": "Hindi",
        "correct_answer": 2
    },
    {
        "question": "¿Qué es la fotosíntesis?",
        "option_a": "Proceso de respiración de las plantas",
        "option_b": "Proceso por el cual las plantas producen su alimento",
        "option_c": "Proceso de reproducción de las plantas",
        "option_d": "Proceso de crecimiento de las plantas",
        "correct_answer": 1
    },
]

created_gk = 0
for q_data in general_knowledge_questions:
    question_obj, created = GeneralKnowledgeQuestion.objects.get_or_create(
        question=q_data["question"],
        defaults={
            'option_a': q_data["option_a"],
            'option_b': q_data["option_b"],
            'option_c': q_data["option_c"],
            'option_d': q_data["option_d"],
            'correct_answer': q_data["correct_answer"],
            'is_active': True
        }
    )
    if created:
        created_gk += 1

print(f"[OK] Creadas {created_gk} preguntas de Conocimiento General (total: {GeneralKnowledgeQuestion.objects.count()})")

# 4. Crear Sopa de Letras (necesitamos la actividad de minijuego)
print("\n[4/4] Creando Sopa de Letras...")
try:
    # Buscar la actividad de minijuego
    minigame_activity = Activity.objects.filter(
        name__icontains='minijuego',
        stage__number=1
    ).first()
    
    if not minigame_activity:
        print("⚠️  No se encontró la actividad de minijuego. Buscando por tipo...")
        from challenges.models import ActivityType
        minigame_type = ActivityType.objects.filter(code='minigame').first()
        if minigame_type:
            minigame_activity = Activity.objects.filter(
                activity_type=minigame_type,
                stage__number=1
            ).first()
    
    if minigame_activity:
        # Crear 15 sopas de letras de ejemplo para mayor variedad
        word_sets = [
            ["IDEA", "META", "EQUIPO", "PITCH", "LIDER"],
            ["NEGOCIO", "CLIENTE", "VENTA", "PRODUCTO", "MERCADO"],
            ["CREATIVIDAD", "INNOVACION", "ESTRATEGIA", "PLANIFICACION", "OBJETIVO"],
            ["COMUNICACION", "COLABORACION", "TRABAJO", "PROYECTO", "SOLUCION"],
            ["LIDERAZGO", "MOTIVACION", "PASION", "VISION", "MISION"],
            ["RIESGO", "EXITO", "FRACASO", "APRENDIZAJE", "EXPERIENCIA"],
            ["CONOCIMIENTO", "HABILIDAD", "DESAFIO", "RETO", "COMPETENCIA"],
            ["ORGANIZACION", "ADMINISTRACION", "GESTION", "DIRECCION", "SUPERVISION"],
            ["PLANIFICACION", "EJECUCION", "EVALUACION", "MEJORA", "OPTIMIZACION"],
            ["VALORES", "CULTURA", "ETICA", "RESPONSABILIDAD", "COMPROMISO"],
            ["TECNOLOGIA", "DIGITAL", "INNOVACION", "TRANSFORMACION", "FUTURO"],
            ["SERVICIO", "CALIDAD", "SATISFACCION", "EXPERIENCIA", "VALOR"],
            ["FINANZAS", "INVERSION", "CAPITAL", "RECURSOS", "PRESUPUESTO"],
            ["MARKETING", "PUBLICIDAD", "PROMOCION", "BRANDING", "POSICIONAMIENTO"],
            ["NETWORKING", "CONTACTO", "RELACION", "ALIANZA", "PARTNERSHIP"],
        ]
        
        created_word_searches = 0
        for i, words in enumerate(word_sets, 1):
            # Generar la sopa de letras
            seed = random.randint(1, 1000000)
            result = generate_word_search(words, seed=seed)
            
            word_search, created = WordSearchOption.objects.get_or_create(
                activity=minigame_activity,
                name=f"Sopa de Letras {i}",
                defaults={
                    'words': words,
                    'grid': result['grid'],
                    'word_positions': result['wordPositions'],
                    'seed': seed,
                    'is_active': True
                }
            )
            if created:
                created_word_searches += 1
        
        print(f"[OK] Creadas {created_word_searches} sopas de letras (total: {WordSearchOption.objects.count()})")
    else:
        print("[WARNING] No se encontro la actividad de minijuego. Las sopas de letras se pueden crear desde el admin panel.")
except Exception as e:
    print(f"[WARNING] Error al crear sopas de letras: {str(e)}")
    print("   Las sopas de letras se pueden crear desde el admin panel.")

print("\n[COMPLETADO] Datos de ejemplo creados exitosamente!")
print("\nResumen:")
print(f"   - Anagramas: {AnagramWord.objects.filter(is_active=True).count()} palabras activas")
print(f"   - Preguntas del Caos: {ChaosQuestion.objects.filter(is_active=True).count()} preguntas activas")
print(f"   - Preguntas Conocimiento General: {GeneralKnowledgeQuestion.objects.filter(is_active=True).count()} preguntas activas")
print(f"   - Sopa de Letras: {WordSearchOption.objects.filter(is_active=True).count()} opciones activas")

