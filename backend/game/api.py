"""REST API viewsets covering the game domain."""
from __future__ import annotations

import itertools
import random

from django.db import transaction
from django.db.models import F
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from accounts.serializers import UserSerializer
from . import models, permissions, serializers


class CachedListMixin:
    """Adds simple caching support for list endpoints."""

    cache_timeout = 60

    @method_decorator(cache_page(cache_timeout))
    def list(self, request, *args, **kwargs):  # type: ignore[override]
        return super().list(request, *args, **kwargs)


class FacultyViewSet(CachedListMixin, viewsets.ModelViewSet):
    queryset = models.Faculty.objects.all().order_by("name")
    serializer_class = serializers.FacultySerializer
    permission_classes = (permissions.IsAdminOrReadOnly,)


class CareerViewSet(CachedListMixin, viewsets.ModelViewSet):
    queryset = models.Career.objects.select_related("faculty").order_by("name")
    serializer_class = serializers.CareerSerializer
    permission_classes = (permissions.IsAdminOrReadOnly,)

    def get_queryset(self):  # type: ignore[override]
        queryset = super().get_queryset()
        faculty_id = self.request.query_params.get("faculty")
        if faculty_id:
            queryset = queryset.filter(faculty_id=faculty_id)
        return queryset


class StageViewSet(CachedListMixin, viewsets.ModelViewSet):
    queryset = models.Stage.objects.all().order_by("id")
    serializer_class = serializers.StageSerializer
    permission_classes = (permissions.IsAdminOrReadOnly,)


class ThemeViewSet(CachedListMixin, viewsets.ModelViewSet):
    queryset = models.Theme.objects.select_related("faculty").order_by("name")
    serializer_class = serializers.ThemeSerializer
    permission_classes = (permissions.IsAdminOrReadOnly,)

    def get_queryset(self):  # type: ignore[override]
        queryset = super().get_queryset()
        faculty_id = self.request.query_params.get("faculty")
        if faculty_id:
            queryset = queryset.filter(faculty_id=faculty_id)
        return queryset


class ChallengeViewSet(CachedListMixin, viewsets.ModelViewSet):
    queryset = models.Challenge.objects.select_related("theme", "theme__faculty").order_by("name")
    serializer_class = serializers.ChallengeSerializer
    permission_classes = (permissions.IsAdminOrReadOnly,)

    def get_queryset(self):  # type: ignore[override]
        queryset = super().get_queryset()
        theme_id = self.request.query_params.get("theme")
        if theme_id:
            queryset = queryset.filter(theme_id=theme_id)
        return queryset


class ActivityTypeViewSet(CachedListMixin, viewsets.ModelViewSet):
    queryset = models.ActivityType.objects.select_related("stage").order_by("code")
    serializer_class = serializers.ActivityTypeSerializer
    permission_classes = (permissions.IsAdminOrReadOnly,)


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = models.Activity.objects.select_related("stage", "activity_type").order_by("stage__id")
    serializer_class = serializers.ActivitySerializer
    permission_classes = (permissions.IsTeacherOrAdmin,)

    def get_queryset(self):  # type: ignore[override]
        queryset = super().get_queryset()
        stage_id = self.request.query_params.get("stage")
        if stage_id:
            queryset = queryset.filter(stage_id=stage_id)
        return queryset


class SessionViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.SessionSerializer
    permission_classes = (permissions.IsTeacherOrAdmin,)

    def get_queryset(self):  # type: ignore[override]
        user = self.request.user
        base = models.Session.objects.select_related("owner", "career", "career__faculty").prefetch_related(
            "teams__students",
            "teams__challenge",
            "teams__challenge__theme",
        )
        if not user.is_authenticated:
            return base.order_by("-created_at")
        if user.is_superuser or getattr(user, "role", None) == "admin":
            return base.order_by("-created_at")
        return base.filter(owner=user).order_by("-created_at")

    def perform_create(self, serializer):  # type: ignore[override]
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=["get"], url_path="code/(?P<code>[^/]+)", permission_classes=[AllowAny])
    def by_code(self, request, code: str | None = None):
        session = get_object_or_404(self.get_queryset(), code=code)
        return Response(self.get_serializer(session).data)

    @action(
        detail=False,
        methods=["get"],
        url_path="teacher/(?P<owner_id>[^/]+)",
        permission_classes=[permissions.IsTeacherOrAdmin],
    )
    def by_teacher(self, request, owner_id: str | None = None):
        queryset = self.get_queryset().filter(owner_id=owner_id)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(
        detail=True,
        methods=["patch"],
        url_path="status",
        permission_classes=[permissions.IsTeacherOrAdmin],
    )
    def update_status(self, request, pk=None):
        session = self.get_object()
        status_value = request.data.get("status") or request.data.get("estado")
        if status_value not in models.Session.Status.values:
            raise ValidationError("Estado de sesión inválido")
        session.status = status_value
        session.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(session).data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsTeacherOrAdmin])
    def start(self, request, pk=None):
        session = self.get_object()
        session.status = models.Session.Status.IN_GAME
        session.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(session).data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsTeacherOrAdmin])
    def finish(self, request, pk=None):
        session = self.get_object()
        session.status = models.Session.Status.FINISHED
        session.save(update_fields=["status", "updated_at"])
        return Response(self.get_serializer(session).data)

    @action(
        detail=True,
        methods=["post"],
        url_path="import-students",
        permission_classes=[permissions.IsTeacherOrAdmin],
    )
    def import_students(self, request, pk=None):
        session = self.get_object()
        payload = serializers.SessionImportStudentsSerializer(data=request.data)
        payload.is_valid(raise_exception=True)
        students_data = payload.validated_data.get("students", [])
        if not students_data:
            raise ValidationError("Debe proporcionar al menos un estudiante para importar.")

        teams = list(session.teams.all())
        if not teams:
            raise ValidationError("La sala no tiene equipos configurados para asignar estudiantes.")

        random.shuffle(teams)
        team_cycle = itertools.cycle(teams)

        with transaction.atomic():
            for student_data in students_data:
                student, _ = models.Student.objects.get_or_create(
                    email=student_data["email"],
                    defaults={
                        "name": student_data["name"],
                        "career": student_data.get("career") or "",
                    },
                )
                student.name = student_data["name"]
                if "career" in student_data:
                    student.career = student_data.get("career") or ""
                student.save(update_fields=["name", "career", "updated_at"])

                models.TeamMembership.objects.filter(team__session=session, student=student).delete()

                team = next(team_cycle)
                models.TeamMembership.objects.get_or_create(team=team, student=student)

        refreshed = self.get_queryset().get(pk=session.pk)
        return Response(self.get_serializer(refreshed).data)


class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.TeamSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):  # type: ignore[override]
        queryset = models.Team.objects.select_related(
            "session",
            "challenge",
            "challenge__theme",
        ).prefetch_related("students")
        session_id = self.request.query_params.get("session")
        if session_id:
            queryset = queryset.filter(session_id=session_id)
        challenge_id = self.request.query_params.get("challenge")
        if challenge_id:
            queryset = queryset.filter(challenge_id=challenge_id)
        return queryset.order_by("name")

    def get_permissions(self):  # type: ignore[override]
        if self.action in {"list", "retrieve"}:
            return [permission() for permission in (IsAuthenticated,)]
        return [permissions.IsTeacherOrAdmin()]

    def perform_create(self, serializer):  # type: ignore[override]
        session: models.Session = serializer.validated_data["session"]
        if session.teams.count() >= session.team_limit:
            raise ValidationError("Se alcanzó el límite de equipos.")
        serializer.save()

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsTeacherOrAdmin])
    def enroll(self, request, pk=None):
        team = self.get_object()
        payload_data = request.data
        if "student_id" in payload_data and "student_ids" not in payload_data:
            payload_data = {
                "student_ids": [payload_data["student_id"]],
            }
        student_ids = payload_data.get("student_ids", [])
        payload = serializers.TeamEnrollmentSerializer(
            data={
                "team_id": team.pk,
                "student_ids": student_ids,
            }
        )
        payload.is_valid(raise_exception=True)
        payload.save()
        team = self.get_queryset().get(pk=team.pk)
        return Response(self.get_serializer(team).data)

    @action(
        detail=True,
        methods=["post"],
        url_path="score",
        permission_classes=[permissions.IsTeacherOrAdmin],
    )
    def update_score(self, request, pk=None):
        team = self.get_object()
        delta = request.data.get("puntaje_adicional") or request.data.get("delta")
        try:
            delta_int = int(delta)
        except (TypeError, ValueError):
            raise ValidationError("Debe especificar la cantidad de puntos a sumar.")
        team.total_score = F("total_score") + delta_int
        team.save(update_fields=["total_score"])
        team.refresh_from_db()
        return Response(self.get_serializer(team).data)

    @action(
        detail=True,
        methods=["delete"],
        url_path="students/(?P<student_id>[^/]+)",
        permission_classes=[permissions.IsTeacherOrAdmin],
    )
    def remove_student(self, request, student_id: str, pk=None):
        team = self.get_object()
        models.TeamMembership.objects.filter(team=team, student_id=student_id).delete()
        team = self.get_queryset().get(pk=team.pk)
        return Response(self.get_serializer(team).data)


class StudentViewSet(viewsets.ModelViewSet):
    queryset = models.Student.objects.all().order_by("name")
    serializer_class = serializers.StudentSerializer
    permission_classes = (permissions.IsTeacherOrAdmin,)

    def get_queryset(self):  # type: ignore[override]
        queryset = super().get_queryset()
        team_id = self.request.query_params.get("team")
        if team_id:
            queryset = queryset.filter(teams__id=team_id)
        return queryset


class TokenLogViewSet(viewsets.ModelViewSet):
    queryset = models.TokenLog.objects.select_related("team", "activity").order_by("-created_at")
    serializer_class = serializers.TokenLogSerializer
    permission_classes = (permissions.IsTeacherOrAdmin,)

    def get_queryset(self):  # type: ignore[override]
        queryset = super().get_queryset()
        team_id = self.request.query_params.get("team")
        if team_id:
            queryset = queryset.filter(team_id=team_id)
        activity_id = self.request.query_params.get("activity")
        if activity_id:
            queryset = queryset.filter(activity_id=activity_id)
        return queryset


class ResponseViewSet(viewsets.ModelViewSet):
    queryset = models.Response.objects.select_related("team", "activity").order_by("-created_at")
    serializer_class = serializers.ResponseSerializer
    permission_classes = (permissions.IsTeacherOrAdmin,)

    def get_queryset(self):  # type: ignore[override]
        queryset = super().get_queryset()
        team_id = self.request.query_params.get("team")
        if team_id:
            queryset = queryset.filter(team_id=team_id)
        activity_id = self.request.query_params.get("activity")
        if activity_id:
            queryset = queryset.filter(activity_id=activity_id)
        return queryset


class QuestionViewSet(CachedListMixin, viewsets.ModelViewSet):
    queryset = models.Question.objects.all().order_by("id")
    serializer_class = serializers.QuestionSerializer
    permission_classes = (permissions.IsAdminOrReadOnly,)


class SurveyResponseViewSet(mixins.CreateModelMixin, viewsets.ReadOnlyModelViewSet):
    queryset = models.SurveyResponse.objects.select_related("student", "question")
    serializer_class = serializers.SurveyResponseSerializer
    permission_classes = (permissions.IsTeacherOrAdmin | permissions.IsStudent,)

    def get_queryset(self):  # type: ignore[override]
        queryset = super().get_queryset()
        student_id = self.request.query_params.get("student")
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        question_id = self.request.query_params.get("question")
        if question_id:
            queryset = queryset.filter(question_id=question_id)
        return queryset


class MetricViewSet(viewsets.ModelViewSet):
    queryset = models.ActivityMetric.objects.select_related("session", "stage")
    serializer_class = serializers.ActivityMetricSerializer
    permission_classes = (permissions.IsTeacherOrAdmin,)


class CurrentUserViewSet(viewsets.ViewSet):
    permission_classes = (AllowAny,)

    def list(self, request):  # type: ignore[override]
        if not request.user or not request.user.is_authenticated:
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(UserSerializer(request.user).data)
