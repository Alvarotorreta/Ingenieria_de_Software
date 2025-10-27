"""Django settings for the Mission Emprende backend."""
from __future__ import annotations

import os
from pathlib import Path
from typing import Final

from dotenv import load_dotenv

load_dotenv()

BASE_DIR: Final[Path] = Path(__file__).resolve().parent.parent

SECRET_KEY: Final[str] = os.getenv("DJANGO_SECRET_KEY", "changeme-in-production")
DEBUG: Final[bool] = os.getenv("DJANGO_DEBUG", "True").lower() in {"true", "1", "yes"}
ALLOWED_HOSTS: Final[list[str]] = [
    host.strip()
    for host in os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if host.strip()
]

INSTALLED_APPS: Final[list[str]] = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "channels",
    "accounts",
    "game",
]

MIDDLEWARE: Final[list[str]] = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF: Final[str] = "backend.urls"

TEMPLATES: Final[list[dict[str, object]]] = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

WSGI_APPLICATION: Final[str] = "backend.wsgi.application"
ASGI_APPLICATION: Final[str] = "backend.asgi.application"

DATABASES: Final[dict[str, dict[str, object]]] = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": 'MISION',
        "USER": 'root',
        "PASSWORD": '1234',
        "HOST": os.getenv("DB_HOST", "127.0.0.1"),
        "PORT": int(os.getenv("DB_PORT", "3306")),
        "OPTIONS": {"charset": "utf8mb4", "init_command": "SET sql_mode='STRICT_TRANS_TABLES'"},
    }
}

AUTH_PASSWORD_VALIDATORS: Final[list[dict[str, str]]] = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE: Final[str] = "es-cl"
TIME_ZONE: Final[str] = os.getenv("TIME_ZONE", "America/Santiago")
USE_I18N: Final[bool] = True
USE_TZ: Final[bool] = True

STATIC_URL: Final[str] = "static/"
STATIC_ROOT: Final[Path] = BASE_DIR / "staticfiles"
STATICFILES_DIRS: Final[list[Path]] = [BASE_DIR / "static"] if (BASE_DIR / "static").exists() else []

MEDIA_URL: Final[str] = "media/"
MEDIA_ROOT: Final[Path] = BASE_DIR / "media"

DEFAULT_AUTO_FIELD: Final[str] = "django.db.models.BigAutoField"
AUTH_USER_MODEL: Final[str] = "accounts.User"

CORS_ALLOWED_ORIGINS: Final[list[str]] = [
    origin.strip()
    for origin in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]
CORS_ALLOW_CREDENTIALS: Final[bool] = True

REST_FRAMEWORK: Final[dict[str, object]] = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
}

from datetime import timedelta  # imported late to avoid circular references

SIMPLE_JWT: Final[dict[str, object]] = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(os.getenv("JWT_ACCESS_MINUTES", "60"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.getenv("JWT_REFRESH_DAYS", "7"))),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

CHANNEL_LAYERS: Final[dict[str, dict[str, object]]] = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [
                (
                    os.getenv("REDIS_HOST", "127.0.0.1"),
                    int(os.getenv("REDIS_PORT", "6379")),
                )
            ],
        },
    }
}

EMAIL_BACKEND: Final[str] = os.getenv(
    "EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend"
)
