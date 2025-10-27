"""Admin registrations for game domain models."""
from __future__ import annotations

from django.contrib import admin

from . import models


@admin.register(models.Faculty)
class FacultyAdmin(admin.ModelAdmin):
    search_fields = ("name",)
    list_display = ("name", "created_at")


@admin.register(models.Career)
class CareerAdmin(admin.ModelAdmin):
    search_fields = ("name", "faculty__name")
    list_display = ("name", "faculty", "created_at")


@admin.register(models.Theme)
class ThemeAdmin(admin.ModelAdmin):
    search_fields = ("name", "faculty__name")
    list_display = ("name", "faculty", "created_at")


@admin.register(models.Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    search_fields = ("name", "theme__name")
    list_display = ("name", "theme", "created_at")


@admin.register(models.Stage)
class StageAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")


@admin.register(models.ActivityType)
class ActivityTypeAdmin(admin.ModelAdmin):
    list_display = ("code", "stage", "created_at")


@admin.register(models.Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("name", "stage", "activity_type", "status")
    list_filter = ("status", "stage")


class TeamMembershipInline(admin.TabularInline):
    model = models.TeamMembership
    extra = 0


@admin.register(models.Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("name", "session", "modality", "total_score")
    list_filter = ("modality", "session__status")
    inlines = (TeamMembershipInline,)


@admin.register(models.Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "career")
    search_fields = ("name", "email")


@admin.register(models.Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ("code", "status", "owner", "career", "scheduled_for")
    list_filter = ("status", "career")
    search_fields = ("code",)


@admin.register(models.Response)
class ResponseAdmin(admin.ModelAdmin):
    list_display = ("team", "activity", "created_at")


@admin.register(models.TokenLog)
class TokenLogAdmin(admin.ModelAdmin):
    list_display = ("team", "activity", "amount", "issuer", "receiver")


@admin.register(models.Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("description", "created_at")


@admin.register(models.SurveyResponse)
class SurveyResponseAdmin(admin.ModelAdmin):
    list_display = ("student", "question", "created_at")


@admin.register(models.ActivityMetric)
class ActivityMetricAdmin(admin.ModelAdmin):
    list_display = ("session", "stage", "teams_completed", "average_score")
