from django.conf import settings
from django.db import models


class Bounty(models.Model):
    STATUS_CHOICES = [
        ("wanted", "In Transit"),
        ("captured", "Delivered"),
    ]

    target_name = models.CharField(max_length=255)
    reward = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="wanted")
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bounties",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.target_name} ({self.get_status_display()})"
