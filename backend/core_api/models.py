from django.db import models
from django.contrib.auth.models import User

class LegacyBox(models.Model):
    """
    Represents a single Digital Legacy Box.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='legacy_boxes')
    name = models.CharField(max_length=255)
    recipient_email = models.EmailField()
    release_date = models.DateField()
    is_released = models.BooleanField(default=False) # To track if the box has been sent
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"'{self.name}' for {self.recipient_email}"

class Memory(models.Model):
    """
    Represents a single memory (e.g., a letter) within a LegacyBox.
    """
    box = models.ForeignKey(LegacyBox, on_delete=models.CASCADE, related_name='memories')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Memory for {self.box.name} created at {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        ordering = ['created_at']
