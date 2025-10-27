"""Serializers for authentication and user management."""
from __future__ import annotations

from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "role",
            "faculty",
            "career",
        )
        read_only_fields = ("id",)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "password",
            "role",
            "faculty",
            "career",
        )
        read_only_fields = ("id",)

    def create(self, validated_data: dict):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class EmailOrUsernameTokenSerializer(TokenObtainPairSerializer):
    """Allow authentication using either username or email."""

    def validate(self, attrs):  # type: ignore[override]
        identifier = attrs.get(self.username_field)
        if identifier:
            lookup = {"email__iexact": identifier}
            user = User.objects.filter(**lookup).first()
            if user:
                # Replace with the actual username so default logic works.
                attrs[self.username_field] = getattr(user, self.username_field)
        return super().validate(attrs)
