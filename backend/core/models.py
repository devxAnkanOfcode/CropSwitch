from django.db import models


class Alert(models.Model):

    SEVERITY_CHOICES = [
        ("Low", "Low"),
        ("Moderate", "Moderate"),
        ("High", "High"),
    ]

    DELIVERY_STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Sent", "Sent"),
        ("Failed", "Failed"),
    ]

    village = models.CharField(max_length=100)

    alert_type = models.CharField(max_length=100)

    severity = models.CharField(
        max_length=20,
        choices=SEVERITY_CHOICES
    )

    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    delivery_status = models.CharField(
        max_length=20,
        choices=DELIVERY_STATUS_CHOICES,
        default="Pending"
    )

    def __str__(self):
        return f"{self.alert_type} - {self.village}"
