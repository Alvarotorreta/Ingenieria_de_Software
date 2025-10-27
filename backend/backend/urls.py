"""URL configuration for the Mission Emprende backend."""
from __future__ import annotations

from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from accounts import api as accounts_api
from game import api as game_api
from game import views as game_views

router = routers.DefaultRouter()
router.register(r"users", accounts_api.UserViewSet)
router.register(r"register", accounts_api.RegisterViewSet, basename="register")
router.register(r"faculties", game_api.FacultyViewSet)
router.register(r"careers", game_api.CareerViewSet)
router.register(r"themes", game_api.ThemeViewSet)
router.register(r"challenges", game_api.ChallengeViewSet)
router.register(r"stages", game_api.StageViewSet)
router.register(r"activity-types", game_api.ActivityTypeViewSet)
router.register(r"activities", game_api.ActivityViewSet)
router.register(r"sessions", game_api.SessionViewSet, basename="session")
router.register(r"teams", game_api.TeamViewSet, basename="team")
router.register(r"students", game_api.StudentViewSet, basename="student")
router.register(r"tokens", game_api.TokenLogViewSet, basename="token-log")
router.register(r"responses", game_api.ResponseViewSet, basename="response")
router.register(r"survey-questions", game_api.QuestionViewSet)
router.register(r"survey-responses", game_api.SurveyResponseViewSet, basename="survey-response")
router.register(r"metrics", game_api.MetricViewSet, basename="metric")
router.register(r"me", game_api.CurrentUserViewSet, basename="current-user")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", game_views.TokenPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", game_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include(router.urls)),
]
