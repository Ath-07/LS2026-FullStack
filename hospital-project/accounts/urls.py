from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views
from .serializers import EmailTokenObtainPairSerializer

urlpatterns = [
    path(
        "api/token/",
        TokenObtainPairView.as_view(serializer_class=EmailTokenObtainPairSerializer),
        name="token_obtain_pair",
    ),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/register/", views.RegisterView.as_view(), name="register"),
    path("api/user/", views.current_user, name="current_user"),
]
