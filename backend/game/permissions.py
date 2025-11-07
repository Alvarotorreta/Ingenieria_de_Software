"""Reusable DRF permission classes based on user roles."""
from __future__ import annotations

from rest_framework.permissions import BasePermission, SAFE_METHODS


def _has_role(user, *roles: str) -> bool:
    return bool(user and user.is_authenticated and getattr(user, "role", None) in roles)


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and (
            request.user.is_superuser or _has_role(request.user, "admin")
        )


class IsTeacherOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.is_superuser or _has_role(request.user, "admin", "teacher")
        )


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and _has_role(
            request.user, "student"
        )
