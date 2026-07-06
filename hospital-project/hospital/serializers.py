from django.contrib.auth import get_user_model

from rest_framework import serializers

from accounts.serializers import UserSerializer
from .models import Appointment, Department, Doctor

User = get_user_model()


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="user", write_only=True
    )

    class Meta:
        model = Doctor
        fields = "__all__"


class DoctorNameSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Doctor
        fields = ("id", "user", "specialty", "department")


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["doctor"] = DoctorSerializer(instance.doctor).data
        data["patient"] = UserSerializer(instance.patient).data
        return data
