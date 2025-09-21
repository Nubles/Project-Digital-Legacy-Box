from django.core.management.base import BaseCommand
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from core_api.models import LegacyBox

class Command(BaseCommand):
    help = "Checks for and releases any legacy boxes that are due."

    def handle(self, *args, **options):
        today = timezone.now().date()
        self.stdout.write(f"Checking for boxes to release as of {today}...")

        boxes_to_release = LegacyBox.objects.filter(
            release_date__lte=today,
            is_released=False
        )

        if not boxes_to_release.exists():
            self.stdout.write(self.style.SUCCESS("No new boxes to release today."))
            return

        released_count = 0
        for box in boxes_to_release:
            self.stdout.write(f"Releasing box '{box.name}' for {box.recipient_email}...")

            # Send the email
            subject = f"You have received a Digital Legacy Box from {box.user.username}!"
            message = f"You can now view the contents of '{box.name}'.\n\n"
            message += "Click this link to view: [Placeholder for secure link]" # TODO: Add real link

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL, # Configure this in settings.py if needed
                recipient_list=[box.recipient_email],
                fail_silently=False,
            )

            # Mark the box as released to prevent re-sending
            box.is_released = True
            box.save()
            released_count += 1
            self.stdout.write(self.style.SUCCESS(f"Successfully sent notification for box {box.id}."))

        self.stdout.write(self.style.SUCCESS(f"\nFinished. A total of {released_count} boxes were released."))
