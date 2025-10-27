"""Root routing for Channels websocket connections."""
from __future__ import annotations

from django.urls import path

from game import consumers as game_consumers

websocket_urlpatterns = [
    path("ws/sessions/<uuid:session_code>/", game_consumers.SessionConsumer.as_asgi()),
]
