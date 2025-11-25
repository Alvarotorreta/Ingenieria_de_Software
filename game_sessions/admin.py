"""
Admin para la app game_sessions
"""
from django.contrib import admin
from .models import (
    SessionGroup, GameSession, Team, TeamStudent, TeamPersonalization,
    SessionStage, TeamActivityProgress, TeamBubbleMap, Tablet, TabletConnection,
    TeamRouletteAssignment, TokenTransaction, PeerEvaluation, ReflectionEvaluation
)


@admin.register(SessionGroup)
class SessionGroupAdmin(admin.ModelAdmin):
    list_display = ['id', 'professor', 'course', 'total_students', 'number_of_sessions', 'created_at']
    list_filter = ['professor', 'course', 'created_at']
    search_fields = ['professor__user__username', 'course__name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('professor', 'professor__user', 'course')


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = ['room_code', 'professor', 'course', 'session_group', 'status', 'started_at', 'created_at']
    list_filter = ['status', 'professor', 'course', 'session_group', 'created_at']
    search_fields = ['room_code', 'professor__user__username', 'course__name']
    readonly_fields = ['created_at', 'updated_at', 'qr_code']
    # date_hierarchy removido temporalmente debido a problemas con timezone en MySQL
    list_select_related = ['professor', 'professor__user', 'course', 'session_group', 'current_stage', 'current_activity']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('professor', 'professor__user', 'course', 'session_group', 'current_stage', 'current_activity')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'game_session', 'color', 'tokens_total', 'created_at']
    list_filter = ['game_session', 'color', 'created_at']
    search_fields = ['name', 'game_session__room_code']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('game_session')


@admin.register(TeamPersonalization)
class TeamPersonalizationAdmin(admin.ModelAdmin):
    list_display = ['team', 'team_name', 'team_members_know_each_other', 'created_at']
    list_filter = ['team_members_know_each_other', 'created_at']
    search_fields = ['team__name', 'team_name']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('team', 'team__game_session')


@admin.register(SessionStage)
class SessionStageAdmin(admin.ModelAdmin):
    list_display = ['game_session', 'stage', 'status', 'started_at', 'completed_at']
    list_filter = ['status', 'stage']
    search_fields = ['game_session__room_code', 'stage__name']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('game_session', 'stage')


@admin.register(TeamActivityProgress)
class TeamActivityProgressAdmin(admin.ModelAdmin):
    list_display = ['team', 'activity', 'status', 'progress_percentage', 'started_at']
    list_filter = ['status', 'activity']
    search_fields = ['team__name', 'activity__name']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('team', 'team__game_session', 'activity')


@admin.register(TeamBubbleMap)
class TeamBubbleMapAdmin(admin.ModelAdmin):
    list_display = ['team', 'session_stage', 'created_at', 'updated_at']
    list_filter = ['session_stage', 'created_at']
    search_fields = ['team__name', 'session_stage__stage__name']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('team', 'team__game_session', 'session_stage', 'session_stage__stage')


@admin.register(Tablet)
class TabletAdmin(admin.ModelAdmin):
    list_display = ['tablet_code', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['tablet_code']


@admin.register(TabletConnection)
class TabletConnectionAdmin(admin.ModelAdmin):
    list_display = ['tablet', 'team', 'game_session', 'connected_at', 'disconnected_at', 'last_seen']
    list_filter = ['game_session', 'connected_at']
    search_fields = ['tablet__tablet_code', 'team__name', 'game_session__room_code']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('tablet', 'team', 'game_session')


@admin.register(TeamRouletteAssignment)
class TeamRouletteAssignmentAdmin(admin.ModelAdmin):
    list_display = ['team', 'roulette_challenge', 'status', 'token_reward', 'assigned_at', 'validated_by']
    list_filter = ['status', 'assigned_at', 'validated_by']
    search_fields = ['team__name', 'roulette_challenge__description']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('team', 'team__game_session', 'roulette_challenge', 'validated_by')


@admin.register(TokenTransaction)
class TokenTransactionAdmin(admin.ModelAdmin):
    list_display = ['team', 'game_session', 'amount', 'source_type', 'created_at', 'awarded_by']
    list_filter = ['source_type', 'created_at', 'awarded_by']
    search_fields = ['team__name', 'game_session__room_code', 'reason']
    date_hierarchy = 'created_at'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('team', 'team__game_session', 'game_session', 'awarded_by')


@admin.register(ReflectionEvaluation)
class ReflectionEvaluationAdmin(admin.ModelAdmin):
    list_display = ['student_name', 'student_email', 'game_session', 'satisfaction', 'created_at']
    list_filter = ['satisfaction', 'entrepreneurship_interest', 'created_at', 'game_session']
    search_fields = ['student_name', 'student_email', 'career', 'game_session__room_code']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('game_session')


@admin.register(PeerEvaluation)
class PeerEvaluationAdmin(admin.ModelAdmin):
    list_display = ['evaluator_team', 'evaluated_team', 'game_session', 'total_score', 'tokens_awarded', 'submitted_at']
    list_filter = ['game_session', 'submitted_at']
    search_fields = ['evaluator_team__name', 'evaluated_team__name', 'game_session__room_code']
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related('evaluator_team', 'evaluated_team', 'game_session')
