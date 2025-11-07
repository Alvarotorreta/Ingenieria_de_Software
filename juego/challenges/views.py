"""
Views para la app challenges
"""
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Stage, ActivityType, Activity, Topic, Challenge,
    RouletteChallenge, Minigame, LearningObjective
)
from .serializers import (
    StageSerializer, ActivityTypeSerializer, ActivitySerializer,
    TopicSerializer, ChallengeSerializer, RouletteChallengeSerializer,
    MinigameSerializer, LearningObjectiveSerializer
)


class StageViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Etapas
    """
    queryset = Stage.objects.filter(is_active=True)
    serializer_class = StageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['number', 'name']
    ordering = ['number']

    def get_queryset(self):
        queryset = Stage.objects.all()
        if self.request.query_params.get('include_inactive') != 'true':
            queryset = queryset.filter(is_active=True)
        return queryset


class ActivityTypeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Tipos de Actividad
    """
    queryset = ActivityType.objects.filter(is_active=True)
    serializer_class = ActivityTypeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['code', 'name']


class ActivityViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Actividades
    """
    queryset = Activity.objects.filter(is_active=True)
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['stage', 'activity_type', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['order_number', 'name']
    ordering = ['stage', 'order_number']

    def get_permissions(self):
        """
        Permite leer sin autenticación para tablets
        """
        if self.action in ['retrieve', 'list']:
            return []
        return super().get_permissions()

    def get_queryset(self):
        queryset = Activity.objects.select_related('stage', 'activity_type')
        stage_id = self.request.query_params.get('stage')
        if stage_id:
            queryset = queryset.filter(stage_id=stage_id)
        if self.request.query_params.get('include_inactive') != 'true':
            queryset = queryset.filter(is_active=True)
        return queryset


class TopicViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Temas
    """
    queryset = Topic.objects.filter(is_active=True)
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'faculties']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'category']
    ordering = ['name']

    def get_permissions(self):
        """
        Permite leer sin autenticación para tablets
        """
        if self.action in ['retrieve', 'list']:
            return []
        return super().get_permissions()

    def get_queryset(self):
        queryset = Topic.objects.prefetch_related('faculties')
        faculty_id = self.request.query_params.get('faculty')
        if faculty_id:
            queryset = queryset.filter(faculties__id=faculty_id)
        if self.request.query_params.get('include_inactive') != 'true':
            queryset = queryset.filter(is_active=True)
        return queryset.distinct()


class ChallengeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Desafíos
    """
    queryset = Challenge.objects.filter(is_active=True)
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['topic', 'difficulty_level', 'is_active']
    search_fields = ['title', 'persona_name', 'persona_story']
    ordering_fields = ['title', 'difficulty_level']
    ordering = ['title']

    def get_permissions(self):
        """
        Permite leer sin autenticación para tablets
        """
        if self.action in ['retrieve', 'list']:
            return []
        return super().get_permissions()

    def get_queryset(self):
        queryset = Challenge.objects.select_related('topic')
        topic_id = self.request.query_params.get('topic')
        if topic_id:
            queryset = queryset.filter(topic_id=topic_id)
        if self.request.query_params.get('include_inactive') != 'true':
            queryset = queryset.filter(is_active=True)
        return queryset


class RouletteChallengeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Retos de Ruleta
    """
    queryset = RouletteChallenge.objects.filter(is_active=True)
    serializer_class = RouletteChallengeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['challenge_type', 'is_active']
    search_fields = ['description']

    def get_queryset(self):
        queryset = RouletteChallenge.objects.all()
        if self.request.query_params.get('include_inactive') != 'true':
            queryset = queryset.filter(is_active=True)
        return queryset


class MinigameViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Minijuegos
    """
    queryset = Minigame.objects.filter(is_active=True)
    serializer_class = MinigameSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['type', 'is_active']
    search_fields = ['name']


class LearningObjectiveViewSet(viewsets.ModelViewSet):
    """
    ViewSet para Objetivos de Aprendizaje
    """
    queryset = LearningObjective.objects.filter(is_active=True)
    serializer_class = LearningObjectiveSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['stage', 'is_active']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'estimated_time']
    ordering = ['title']

    def get_queryset(self):
        queryset = LearningObjective.objects.select_related('stage')
        stage_id = self.request.query_params.get('stage')
        if stage_id:
            queryset = queryset.filter(stage_id=stage_id)
        if self.request.query_params.get('include_inactive') != 'true':
            queryset = queryset.filter(is_active=True)
        return queryset
