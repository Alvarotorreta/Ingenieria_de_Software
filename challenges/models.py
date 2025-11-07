"""
Modelos para la app challenges (Etapas, Actividades, Desafíos, Retos, Temas, etc.)
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from academic.models import Faculty


class Stage(models.Model):
    """
    Etapa del juego (Trabajo en equipo, Empatía, Creatividad, Comunicación)
    """
    number = models.IntegerField(
        unique=True,
        verbose_name='Número'
    )
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descripción'
    )
    objective = models.TextField(
        blank=True,
        null=True,
        verbose_name='Objetivo'
    )
    estimated_duration = models.IntegerField(
        blank=True,
        null=True,
        verbose_name='Duración Estimada (minutos)'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'stages'
        verbose_name = 'Etapa'
        verbose_name_plural = 'Etapas'
        indexes = [
            models.Index(fields=['number']),
            models.Index(fields=['is_active']),
        ]
        ordering = ['number']

    def __str__(self):
        return f"Etapa {self.number}: {self.name}"


class ActivityType(models.Model):
    """
    Tipo de actividad (personalización, minijuego, tema, etc.)
    """
    code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Código'
    )
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descripción'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'activity_types'
        verbose_name = 'Tipo de Actividad'
        verbose_name_plural = 'Tipos de Actividades'
        indexes = [
            models.Index(fields=['code']),
        ]

    def __str__(self):
        return self.name


class Activity(models.Model):
    """
    Actividad dentro de una etapa
    """
    stage = models.ForeignKey(
        Stage,
        on_delete=models.RESTRICT,
        related_name='activities',
        verbose_name='Etapa'
    )
    activity_type = models.ForeignKey(
        ActivityType,
        on_delete=models.RESTRICT,
        related_name='activities',
        verbose_name='Tipo de Actividad'
    )
    name = models.CharField(
        max_length=100,
        verbose_name='Nombre'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descripción'
    )
    order_number = models.IntegerField(
        verbose_name='Número de Orden'
    )
    timer_duration = models.IntegerField(
        blank=True,
        null=True,
        verbose_name='Duración del Temporizador (segundos)'
    )
    config_data = models.JSONField(
        blank=True,
        null=True,
        verbose_name='Datos de Configuración'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activa'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'activities'
        verbose_name = 'Actividad'
        verbose_name_plural = 'Actividades'
        unique_together = [['stage', 'order_number']]
        indexes = [
            models.Index(fields=['stage']),
            models.Index(fields=['activity_type']),
            models.Index(fields=['stage', 'order_number']),
        ]
        ordering = ['stage', 'order_number']

    def __str__(self):
        return f"{self.stage.name} - {self.name}"


class Topic(models.Model):
    """
    Tema para la etapa de Empatía (Many-to-Many con Facultades)
    """
    name = models.CharField(
        max_length=200,
        verbose_name='Nombre'
    )
    icon = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        verbose_name='Icono',
        help_text='Emoji o símbolo para representar el tema (ej: 🏥, 💰, 🌱)'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descripción'
    )
    image_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name='URL de Imagen'
    )
    category = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Categoría'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    faculties = models.ManyToManyField(
        Faculty,
        related_name='topics',
        verbose_name='Facultades'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'topics'
        verbose_name = 'Tema'
        verbose_name_plural = 'Temas'
        indexes = [
            models.Index(fields=['is_active']),
            models.Index(fields=['category']),
        ]

    def __str__(self):
        return self.name


class Challenge(models.Model):
    """
    Desafío (Historia de Usuario) asociado a un tema
    """
    DIFFICULTY_LEVEL_CHOICES = [
        ('low', 'Baja'),
        ('medium', 'Media'),
        ('high', 'Alta'),
    ]

    topic = models.ForeignKey(
        Topic,
        on_delete=models.RESTRICT,
        related_name='challenges',
        verbose_name='Tema'
    )
    title = models.CharField(
        max_length=200,
        verbose_name='Título'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descripción del Desafío',
        help_text='Descripción del problema o desafío que se busca resolver'
    )
    icon = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        verbose_name='Icono',
        help_text='Emoji o símbolo para representar el desafío (ej: 💰, 🎓, 📱)'
    )
    # Campos para la persona de la historia de usuario
    persona_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name='Nombre de la Persona',
        help_text='Nombre de la persona en la historia de usuario'
    )
    persona_age = models.IntegerField(
        blank=True,
        null=True,
        verbose_name='Edad de la Persona',
        help_text='Edad de la persona en la historia de usuario'
    )
    persona_story = models.TextField(
        blank=True,
        null=True,
        verbose_name='Historia de la Persona',
        help_text='Cita o historia específica de la persona'
    )
    difficulty_level = models.CharField(
        max_length=20,
        choices=DIFFICULTY_LEVEL_CHOICES,
        default='medium',
        verbose_name='Nivel de Dificultad'
    )
    learning_objectives = models.TextField(
        blank=True,
        null=True,
        verbose_name='Objetivos de Aprendizaje'
    )
    additional_resources = models.TextField(
        blank=True,
        null=True,
        verbose_name='Recursos Adicionales'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'challenges'
        verbose_name = 'Desafío'
        verbose_name_plural = 'Desafíos'
        indexes = [
            models.Index(fields=['topic']),
            models.Index(fields=['difficulty_level']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.title} - {self.topic.name}"


class RouletteChallenge(models.Model):
    """
    Reto de ruleta (retos físicos/mentales/creativos)
    """
    CHALLENGE_TYPE_CHOICES = [
        ('physical', 'Físico'),
        ('mental', 'Mental'),
        ('creative', 'Creativo'),
        ('other', 'Otro'),
    ]

    description = models.TextField(
        verbose_name='Descripción'
    )
    challenge_type = models.CharField(
        max_length=20,
        choices=CHALLENGE_TYPE_CHOICES,
        verbose_name='Tipo de Reto'
    )
    difficulty_estimated = models.IntegerField(
        default=5,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        verbose_name='Dificultad Estimada (1-10)'
    )
    token_reward_min = models.IntegerField(
        default=0,
        verbose_name='Recompensa Mínima en Tokens'
    )
    token_reward_max = models.IntegerField(
        default=0,
        verbose_name='Recompensa Máxima en Tokens'
    )
    stages_applicable = models.JSONField(
        blank=True,
        null=True,
        verbose_name='Etapas Aplicables'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'roulette_challenges'
        verbose_name = 'Reto de Ruleta'
        verbose_name_plural = 'Retos de Ruleta'
        indexes = [
            models.Index(fields=['challenge_type']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.description[:50]}... ({self.challenge_type})"


class Minigame(models.Model):
    """
    Minijuego (sopa de letras, puzzle, etc.)
    """
    MINIGAME_TYPE_CHOICES = [
        ('word_search', 'Sopa de Letras'),
        ('puzzle', 'Puzzle'),
        ('other', 'Otro'),
    ]

    name = models.CharField(
        max_length=100,
        verbose_name='Nombre'
    )
    type = models.CharField(
        max_length=20,
        choices=MINIGAME_TYPE_CHOICES,
        verbose_name='Tipo'
    )
    config = models.JSONField(
        blank=True,
        null=True,
        verbose_name='Configuración'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'minigames'
        verbose_name = 'Minijuego'
        verbose_name_plural = 'Minijuegos'
        indexes = [
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


class LearningObjective(models.Model):
    """
    Objetivo de aprendizaje (puede estar asociado a una etapa)
    """
    stage = models.ForeignKey(
        Stage,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='learning_objectives',
        verbose_name='Etapa'
    )
    title = models.CharField(
        max_length=200,
        verbose_name='Título'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descripción'
    )
    evaluation_criteria = models.TextField(
        blank=True,
        null=True,
        verbose_name='Criterios de Evaluación'
    )
    pedagogical_recommendations = models.TextField(
        blank=True,
        null=True,
        verbose_name='Recomendaciones Pedagógicas'
    )
    estimated_time = models.IntegerField(
        blank=True,
        null=True,
        verbose_name='Tiempo Estimado (minutos)'
    )
    associated_resources = models.TextField(
        blank=True,
        null=True,
        verbose_name='Recursos Asociados'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Activo'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'learning_objectives'
        verbose_name = 'Objetivo de Aprendizaje'
        verbose_name_plural = 'Objetivos de Aprendizaje'
        indexes = [
            models.Index(fields=['stage']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return f"{self.title} - {self.stage.name if self.stage else 'General'}"
