from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        PATIENT = "patient", "Patient"
        DOCTOR = "doctor", "Doctor"

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.PATIENT,
    )

    def __str__(self):
        return f"{self.username} ({self.role})"
