from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, permissions, views, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import LegacyBox, Memory, Keyholder
from .serializers import UserSerializer, LegacyBoxSerializer, MemorySerializer, KeyholderSerializer

# --- User Views ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

# --- LegacyBox Views ---
class LegacyBoxListCreateView(generics.ListCreateAPIView):
    serializer_class = LegacyBoxSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return LegacyBox.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class LegacyBoxDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LegacyBoxSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return LegacyBox.objects.filter(user=self.request.user)

# --- Memory Views ---
class MemoryListCreateView(generics.ListCreateAPIView):
    serializer_class = MemorySerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    def get_queryset(self):
        box_id = self.kwargs['box_id']
        return Memory.objects.filter(box__user=self.request.user, box__id=box_id)
    def perform_create(self, serializer):
        box_id = self.kwargs['box_id']
        box = LegacyBox.objects.get(id=box_id, user=self.request.user)
        serializer.save(box=box)

# --- Keyholder Views ---
class KeyholderCreateView(generics.CreateAPIView):
    serializer_class = KeyholderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        box_id = self.kwargs['box_id']
        box = LegacyBox.objects.get(id=box_id, user=self.request.user)
        keyholder = serializer.save(box=box)

        # Send an email to the keyholder with their unique key
        subject = f"You have been designated as a Keyholder for a Digital Legacy Box"
        message = f"You are now a keyholder for '{box.name}'.\n\n"
        message += f"Your unique key is: {keyholder.key}\n\n"
        message += "Please keep this key safe. You will need it to unlock the box if requested."

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[keyholder.email],
            fail_silently=False,
        )

class KeyholderTriggerView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        key = request.data.get('key')
        if not key:
            return Response({"error": "A key is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            keyholder = Keyholder.objects.get(key=key)
            box = keyholder.box
            if box.is_released:
                return Response({"message": "This box has already been released."}, status=status.HTTP_400_BAD_REQUEST)

            box.is_released = True
            box.save()

            # TODO: In a real app, you would also trigger the email to the main recipient here.

            return Response({"message": f"Successfully triggered the release of box '{box.name}'."}, status=status.HTTP_200_OK)
        except Keyholder.DoesNotExist:
            return Response({"error": "Invalid key provided."}, status=status.HTTP_404_NOT_FOUND)

# --- Public Views ---
class RecipientView(views.APIView):
    permission_classes = [permissions.AllowAny]
    def get(self, request, *args, **kwargs):
        return Response({"message": "This is where the recipient would view the legacy box contents."})
