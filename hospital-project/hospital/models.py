from django.db import models

from accounts.models import CustomUser


class Department(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Doctor(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="doctor_profile")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="doctors")
    specialty = models.CharField(max_length=100)

    def __str__(self):
        return f"Dr. {self.user.get_full_name() or self.user.username}"


class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = "Pending", "Pending"
        CONFIRMED = "Confirmed", "Confirmed"
        COMPLETED = "Completed", "Completed"
        CANCELLED = "Cancelled", "Cancelled"

    patient = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="appointments")
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="appointments")
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    reason = models.TextField(blank=True)

    def __str__(self):
        return f"{self.patient.username} - {self.doctor} - {self.appointment_date:%Y-%m-%d %H:%M}"
