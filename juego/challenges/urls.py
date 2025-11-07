"""
URLs para la app challenges (desafíos y retos)
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StageViewSet, ActivityTypeViewSet, ActivityViewSet,
    TopicViewSet, ChallengeViewSet, RouletteChallengeViewSet,
    MinigameViewSet, LearningObjectiveViewSet
)

router = DefaultRouter()
router.register(r'stages', StageViewSet, basename='stage')
router.register(r'activity-types', ActivityTypeViewSet, basename='activity-type')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'topics', TopicViewSet, basename='topic')
router.register(r'challenges', ChallengeViewSet, basename='challenge')
router.register(r'roulette-challenges', RouletteChallengeViewSet, basename='roulette-challenge')
router.register(r'minigames', MinigameViewSet, basename='minigame')
router.register(r'learning-objectives', LearningObjectiveViewSet, basename='learning-objective')

urlpatterns = [
    path('', include(router.urls)),
]

