"""Auxiliary API views for authentication and real-time helpers."""
from __future__ import annotations

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView as SimpleJWTRefreshView,
)

from accounts.serializers import EmailOrUsernameTokenSerializer


class TokenPairView(TokenObtainPairView):
    serializer_class = EmailOrUsernameTokenSerializer


class TokenRefreshView(SimpleJWTRefreshView):
    pass
