from django.contrib.auth.models import User
from rest_framework import generics, permissions, views
from rest_framework.response import Response
from .models import LegacyBox, Memory
from .serializers import UserSerializer, LegacyBoxSerializer, MemorySerializer

# --- User Views ---

class RegisterView(generics.CreateAPIView):
    """
    API endpoint that allows new users to be created.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


# --- LegacyBox Views ---

class LegacyBoxListCreateView(generics.ListCreateAPIView):
    """
    API endpoint that allows a user's legacy boxes to be viewed or a new one created.
    """
    serializer_class = LegacyBoxSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LegacyBox.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LegacyBoxDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that allows a single legacy box to be viewed, updated, or deleted.
    """
    serializer_class = LegacyBoxSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LegacyBox.objects.filter(user=self.request.user)


# --- Memory Views ---

class MemoryListCreateView(generics.ListCreateAPIView):
    """
    API endpoint for listing and creating memories within a specific box.
    """
    serializer_class = MemorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        box_id = self.kwargs['box_id']
        return Memory.objects.filter(box__user=self.request.user, box__id=box_id)

    def perform_create(self, serializer):
        box_id = self.kwargs['box_id']
        box = LegacyBox.objects.get(id=box_id, user=self.request.user)
        serializer.save(box=box)


# --- Public Views ---

class RecipientView(views.APIView):
    """
    A public view for a recipient to see their legacy box content.
    This is a placeholder for the MVP.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        # In a real implementation, a token would be used to find the box
        # e.g., token = self.kwargs['token']
        return Response({
            "message": "This is where the recipient would view the legacy box contents."
        })
