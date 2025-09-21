import uuid
from django.db import models
from django.contrib.auth.models import User

class LegacyBox(models.Model):
    """
    Represents a single Digital Legacy Box.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='legacy_boxes')
    name = models.CharField(max_length=255)
    recipient_email = models.EmailField()
    release_date = models.DateField(null=True, blank=True) # Can be null if keyholder-only release
    is_released = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"'{self.name}' for {self.recipient_email}"

class Memory(models.Model):
    """
    Represents a single memory (e.g., a letter, photo, video) within a LegacyBox.
    """
    class MemoryType(models.TextChoices):
        LETTER = 'LETTER', 'Letter'
        PHOTO = 'PHOTO', 'Photo'
        VIDEO = 'VIDEO', 'Video'

    box = models.ForeignKey(LegacyBox, on_delete=models.CASCADE, related_name='memories')
    memory_type = models.CharField(
        max_length=10,
        choices=MemoryType.choices,
        default=MemoryType.LETTER
    )
    content = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='memories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_memory_type_display()} for {self.box.name}"

    class Meta:
        ordering = ['created_at']

class Keyholder(models.Model):
    """
    Represents a trusted keyholder for a specific LegacyBox.
    """
    box = models.ForeignKey(LegacyBox, on_delete=models.CASCADE, related_name='keyholders')
    email = models.EmailField()
    key = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('box', 'email')

    def __str__(self):
        return f"Keyholder {self.email} for box '{self.box.name}'"
