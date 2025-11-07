"""Serializers encapsulating business rules for the game domain."""
from __future__ import annotations

from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from accounts.serializers import UserSerializer
from . import models

User = get_user_model()


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Faculty
        fields = ("id", "name", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class CareerSerializer(serializers.ModelSerializer):
    faculty = FacultySerializer(read_only=True)
    faculty_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Faculty.objects.all(), source="faculty", write_only=True
    )

    class Meta:
        model = models.Career
        fields = (
            "id",
            "name",
            "faculty",
            "faculty_id",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "faculty")


class StageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Stage
        fields = ("id", "name", "description", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class ThemeSerializer(serializers.ModelSerializer):
    faculty = FacultySerializer(read_only=True)
    faculty_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Faculty.objects.all(), source="faculty", write_only=True
    )

    class Meta:
        model = models.Theme
        fields = (
            "id",
            "name",
            "description",
            "faculty",
            "faculty_id",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "faculty")


class ChallengeSerializer(serializers.ModelSerializer):
    theme = ThemeSerializer(read_only=True)
    theme_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Theme.objects.all(), source="theme", write_only=True
    )

    class Meta:
        model = models.Challenge
        fields = (
            "id",
            "name",
            "description",
            "theme",
            "theme_id",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "theme")


class ActivityTypeSerializer(serializers.ModelSerializer):
    stage = StageSerializer(read_only=True)
    stage_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Stage.objects.all(), source="stage", write_only=True
    )

    class Meta:
        model = models.ActivityType
        fields = (
            "id",
            "code",
            "description",
            "stage",
            "stage_id",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "stage")


class ActivitySerializer(serializers.ModelSerializer):
    stage = StageSerializer(read_only=True)
    stage_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Stage.objects.all(), source="stage", write_only=True
    )
    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.PrimaryKeyRelatedField(
        queryset=models.ActivityType.objects.all(),
        source="activity_type",
        write_only=True,
    )

    class Meta:
        model = models.Activity
        fields = (
            "id",
            "name",
            "description",
            "status",
            "image_url",
            "stage",
            "stage_id",
            "activity_type",
            "activity_type_id",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at", "stage", "activity_type")


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Student
        fields = (
            "id",
            "name",
            "career",
            "email",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class TeamSerializer(serializers.ModelSerializer):
    challenge = ChallengeSerializer(read_only=True)
    challenge_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Challenge.objects.all(), source="challenge", write_only=True
    )
    session_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Session.objects.all(), source="session", write_only=True
    )
    members = StudentSerializer(
        source="students",
        many=True,
        read_only=True,
    )

    class Meta:
        model = models.Team
        fields = (
            "id",
            "name",
            "modality",
            "total_score",
            "session_id",
            "challenge",
            "challenge_id",
            "members",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "total_score",
            "challenge",
            "members",
            "created_at",
            "updated_at",
        )


class TeamMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TeamMembership
        fields = ("id", "student", "team")


class SessionSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    career = CareerSerializer(read_only=True)
    career_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Career.objects.all(), source="career", write_only=True
    )
    teams = TeamSerializer(many=True, read_only=True)

    class Meta:
        model = models.Session
        fields = (
            "id",
            "code",
            "status",
            "owner",
            "career",
            "career_id",
            "scheduled_for",
            "team_limit",
            "players_per_team",
            "created_at",
            "updated_at",
            "teams",
        )
        read_only_fields = (
            "id",
            "created_at",
            "updated_at",
            "owner",
            "career",
            "teams",
        )


class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Response
        fields = (
            "id",
            "text",
            "image_url",
            "team",
            "activity",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class TokenLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TokenLog
        fields = (
            "id",
            "issuer",
            "receiver",
            "amount",
            "reason",
            "team",
            "activity",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Question
        fields = ("id", "description", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class SurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SurveyResponse
        fields = (
            "id",
            "response",
            "student",
            "question",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class ActivityMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ActivityMetric
        fields = (
            "id",
            "session",
            "stage",
            "teams_completed",
            "average_score",
            "max_score",
            "min_score",
            "engagement_ratio",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class TeamEnrollmentSerializer(serializers.Serializer):
    """Handle assigning multiple students to a team atomically."""

    team_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Team.objects.all(), source="team", write_only=True
    )
    student_ids = serializers.PrimaryKeyRelatedField(
        queryset=models.Student.objects.all(), many=True, source="students", write_only=True
    )

    def validate(self, attrs: dict) -> dict:
        team: models.Team = attrs["team"]
        students = attrs["students"]
        session = team.session
        current_members = team.students.count()
        if current_members + len(students) > session.players_per_team:
            raise serializers.ValidationError(
                "El equipo excede el máximo de integrantes permitido."
            )
        return attrs

    def save(self, **kwargs):  # type: ignore[override]
        team: models.Team = self.validated_data["team"]
        students = self.validated_data["students"]
        with transaction.atomic():
            for student in students:
                models.TeamMembership.objects.get_or_create(team=team, student=student)
        return team


class StudentPayloadSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    career = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class SessionImportStudentsSerializer(serializers.Serializer):
    students = StudentPayloadSerializer(many=True)
