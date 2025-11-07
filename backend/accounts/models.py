"""Custom user and role management models."""
from __future__ import annotations

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extends Django's user with roles aligned to the platform."""

    class Role(models.TextChoices):
        STUDENT = "student", "Alumno"
        TEACHER = "teacher", "Profesor"
        ADMIN = "admin", "Administrador"

    role = models.CharField(
        max_length=32,
        choices=Role.choices,
        default=Role.STUDENT,
        help_text="Rol de usuario en la plataforma.",
    )
    faculty = models.ForeignKey(
        "game.Faculty",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )
    career = models.ForeignKey(
        "game.Career",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="users",
    )

    def __str__(self) -> str:  # pragma: no cover - simple debug helper
        return f"{self.username} ({self.get_role_display()})"
