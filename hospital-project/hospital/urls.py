from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AppointmentViewSet, DepartmentViewSet, DoctorViewSet, UserListView

router = DefaultRouter()
router.register("departments", DepartmentViewSet)
router.register("doctors", DoctorViewSet)
router.register("appointments", AppointmentViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/users/", UserListView.as_view(), name="user-list"),
]
