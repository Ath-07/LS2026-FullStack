from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from bounties.views import BountyViewSet, UserCreateView

router = DefaultRouter()
router.register("bounties", BountyViewSet, basename="bounty")

urlpatterns = [
    path("api/auth/register/", UserCreateView.as_view(), name="register"),
    path("api/auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include(router.urls)),
]
