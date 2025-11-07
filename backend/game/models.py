"""Domain models for Mission Emprende game flow."""
from __future__ import annotations

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone


class TimestampedModel(models.Model):
    """Abstract base adding created/updated timestamps."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Faculty(TimestampedModel):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self) -> str:  # pragma: no cover - debug helper
        return self.name


class Career(TimestampedModel):
    name = models.CharField(max_length=255)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name="careers")

    class Meta:
        unique_together = ("name", "faculty")

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.name} - {self.faculty.name}"


class Stage(TimestampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class Theme(TimestampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    faculty = models.ForeignKey(Faculty, on_delete=models.PROTECT, related_name="themes")

    class Meta:
        unique_together = ("name", "faculty")

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class Challenge(TimestampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE, related_name="challenges")

    class Meta:
        unique_together = ("name", "theme")

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class ActivityType(TimestampedModel):
    code = models.CharField(max_length=50)
    description = models.TextField(blank=True)
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE, related_name="activity_types")

    class Meta:
        unique_together = ("code", "stage")

    def __str__(self) -> str:  # pragma: no cover
        return self.code


class Activity(TimestampedModel):
    class Status(models.TextChoices):
        SCHEDULED = "programada", "Programada"
        IN_GAME = "en_juego", "En juego"
        FINISHED = "finalizado", "Finalizada"

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.IN_GAME)
    image_url = models.URLField(max_length=2048, blank=True, null=True)
    stage = models.ForeignKey(Stage, on_delete=models.PROTECT, related_name="activities")
    activity_type = models.ForeignKey(
        ActivityType, on_delete=models.PROTECT, related_name="activities"
    )

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class Session(TimestampedModel):
    class Status(models.TextChoices):
        SCHEDULED = "programada", "Programada"
        IN_GAME = "en_juego", "En juego"
        FINISHED = "finalizado", "Finalizada"

    code = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.IN_GAME)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="owned_sessions",
    )
    career = models.ForeignKey(Career, on_delete=models.PROTECT, related_name="sessions")
    scheduled_for = models.DateTimeField(default=timezone.now)
    team_limit = models.PositiveIntegerField(default=4, validators=[MinValueValidator(1)])
    players_per_team = models.PositiveIntegerField(default=8, validators=[MinValueValidator(1)])

    def __str__(self) -> str:  # pragma: no cover
        return f"Session {self.code} ({self.status})"


class Team(TimestampedModel):
    class Modality(models.TextChoices):
        KNOW_EACH_OTHER = "known", "Nos conocemos"
        DO_NOT_KNOW = "unknown", "No nos conocemos"

    name = models.CharField(max_length=255)
    modality = models.CharField(
        max_length=20,
        choices=Modality.choices,
        default=Modality.DO_NOT_KNOW,
    )
    total_score = models.PositiveIntegerField(default=0)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="teams")
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.PROTECT,
        related_name="teams",
    )

    class Meta:
        unique_together = ("name", "session")

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class Student(TimestampedModel):
    name = models.CharField(max_length=255)
    career = models.CharField(max_length=255, blank=True)
    email = models.EmailField(unique=True)
    teams = models.ManyToManyField(
        Team,
        through="TeamMembership",
        related_name="students",
    )

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class TeamMembership(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("student", "team")


class Response(TimestampedModel):
    text = models.TextField(blank=True)
    image_url = models.URLField(max_length=2048, blank=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="responses")
    activity = models.ForeignKey(
        Activity,
        on_delete=models.CASCADE,
        related_name="responses",
    )


class TokenLog(TimestampedModel):
    issuer = models.CharField(max_length=255)
    receiver = models.CharField(max_length=255)
    amount = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    reason = models.TextField(blank=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="token_logs")
    activity = models.ForeignKey(
        Activity,
        on_delete=models.CASCADE,
        related_name="token_logs",
    )


class Question(TimestampedModel):
    description = models.TextField()

    def __str__(self) -> str:  # pragma: no cover
        return self.description[:50]


class SurveyResponse(TimestampedModel):
    response = models.TextField()
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="survey_responses")
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="survey_responses",
    )


class ActivityMetric(TimestampedModel):
    """Stores metrics for reporting dashboards."""

    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="metrics")
    stage = models.ForeignKey(Stage, on_delete=models.CASCADE, related_name="metrics")
    teams_completed = models.PositiveIntegerField(default=0)
    average_score = models.FloatField(default=0, validators=[MinValueValidator(0)])
    max_score = models.PositiveIntegerField(default=0)
    min_score = models.PositiveIntegerField(default=0)
    engagement_ratio = models.FloatField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(1)],
    )

    class Meta:
        unique_together = ("session", "stage")
