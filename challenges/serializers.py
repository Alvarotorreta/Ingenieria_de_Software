"""
Serializers para la app challenges
"""
from rest_framework import serializers
from .models import (
    Stage, ActivityType, Activity, Topic, Challenge,
    RouletteChallenge, Minigame, LearningObjective
)
from academic.serializers import FacultySerializer


class StageSerializer(serializers.ModelSerializer):
    """Serializer para Etapa"""
    class Meta:
        model = Stage
        fields = ['id', 'number', 'name', 'description', 'objective', 'estimated_duration', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ActivityTypeSerializer(serializers.ModelSerializer):
    """Serializer para Tipo de Actividad"""
    class Meta:
        model = ActivityType
        fields = ['id', 'code', 'name', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer para Actividad"""
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    activity_type_name = serializers.CharField(source='activity_type.name', read_only=True)
    
    class Meta:
        model = Activity
        fields = [
            'id', 'stage', 'stage_name', 'activity_type', 'activity_type_name',
            'name', 'description', 'order_number', 'timer_duration', 'config_data',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'stage_name', 'activity_type_name', 'created_at', 'updated_at']


class TopicSerializer(serializers.ModelSerializer):
    """Serializer para Tema"""
    from academic.models import Faculty
    
    faculties = FacultySerializer(many=True, read_only=True)
    faculty_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Faculty.objects.all(),
        source='faculties',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Topic
        fields = ['id', 'name', 'icon', 'description', 'image_url', 'category', 'faculties', 'faculty_ids', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ChallengeSerializer(serializers.ModelSerializer):
    """Serializer para Desafío"""
    topic_name = serializers.CharField(source='topic.name', read_only=True)
    
    class Meta:
        model = Challenge
        fields = [
            'id', 'topic', 'topic_name', 'title', 'description', 'icon',
            'persona_name', 'persona_age', 'persona_story',
            'difficulty_level', 'learning_objectives', 'additional_resources',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'topic_name', 'created_at', 'updated_at']


class RouletteChallengeSerializer(serializers.ModelSerializer):
    """Serializer para Reto de Ruleta"""
    class Meta:
        model = RouletteChallenge
        fields = [
            'id', 'description', 'challenge_type', 'difficulty_estimated',
            'token_reward_min', 'token_reward_max', 'stages_applicable',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MinigameSerializer(serializers.ModelSerializer):
    """Serializer para Minijuego"""
    class Meta:
        model = Minigame
        fields = ['id', 'name', 'type', 'config', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class LearningObjectiveSerializer(serializers.ModelSerializer):
    """Serializer para Objetivo de Aprendizaje"""
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    
    class Meta:
        model = LearningObjective
        fields = [
            'id', 'stage', 'stage_name', 'title', 'description',
            'evaluation_criteria', 'pedagogical_recommendations',
            'estimated_time', 'associated_resources', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'stage_name', 'created_at', 'updated_at']

