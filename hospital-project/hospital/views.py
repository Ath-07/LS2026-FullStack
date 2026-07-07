from django.contrib.auth import get_user_model
from rest_framework import generics, viewsets, permissions
from rest_framework.permissions import IsAdminUser, IsAuthenticated, SAFE_METHODS

from accounts.serializers import UserSerializer
from .models import Appointment, Department, Doctor
from .serializers import AppointmentSerializer, DepartmentSerializer, DoctorSerializer

User = get_user_model()


class IsStaffOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class IsPatientOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return True

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        if request.method in SAFE_METHODS:
            if hasattr(obj, 'patient'):
                return obj.patient == request.user
            return True
        return obj.patient == request.user


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsStaffOrReadOnly]


class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsStaffOrReadOnly]


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.select_related("doctor__user", "patient")
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated, IsPatientOrStaff]

    def get_queryset(self):
        user = self.request.user
        qs = Appointment.objects.select_related("doctor__user", "patient")
        if user.is_staff:
            return qs
        if user.role == "doctor":
            return qs.filter(doctor__user=user)
        return qs.filter(patient=user)

    def perform_create(self, serializer):
        serializer.save(patient=self.request.user)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]
