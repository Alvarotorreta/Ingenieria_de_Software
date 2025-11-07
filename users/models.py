"""
Modelos para la app users (Usuarios, Profesores, Estudiantes, Administradores)
"""
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator


class Administrator(models.Model):
    """
    Administrador del sistema (OneToOne con User)
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='administrator',
        verbose_name='Usuario'
    )
    is_super_admin = models.BooleanField(
        default=False,
        verbose_name='Super Administrador'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'administrators'
        verbose_name = 'Administrador'
        verbose_name_plural = 'Administradores'
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"Administrador: {self.user.username}"


class Professor(models.Model):
    """
    Profesor que gestiona sesiones de juego (OneToOne con User)
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='professor',
        verbose_name='Usuario'
    )
    access_code = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True,
        verbose_name='Código de Acceso',
        validators=[
            RegexValidator(
                regex=r'^\d+$',
                message='El código de acceso debe contener solo números'
            )
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'professors'
        verbose_name = 'Profesor'
        verbose_name_plural = 'Profesores'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['access_code']),
        ]

    def __str__(self):
        return f"Profesor: {self.user.get_full_name() or self.user.username}"


class Student(models.Model):
    """
    Estudiante que participa en el juego (NO tiene login, solo datos)
    """
    full_name = models.CharField(
        max_length=200,
        verbose_name='Nombre Completo'
    )
    email = models.EmailField(
        unique=True,
        verbose_name='Correo UDD'
    )
    rut = models.CharField(
        max_length=20,
        unique=True,
        verbose_name='RUT'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'students'
        verbose_name = 'Estudiante'
        verbose_name_plural = 'Estudiantes'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['rut']),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.rut})"
