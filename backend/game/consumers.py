"""Channels consumers handling real-time session updates."""
from __future__ import annotations

import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncWebsocketConsumer


class SessionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_code = self.scope["url_route"]["kwargs"]["session_code"]
        self.group_name = f"session_{self.session_code}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            payload = json.loads(text_data)
            await self.channel_layer.group_send(
                self.group_name,
                {"type": "broadcast", "payload": payload},
            )

    async def broadcast(self, event):
        await self.send(text_data=json.dumps(event["payload"]))

    @classmethod
    def notify(cls, channel_layer, session_code: str, payload: dict) -> None:
        async_to_sync(channel_layer.group_send)(
            f"session_{session_code}",
            {"type": "broadcast", "payload": payload},
        )
