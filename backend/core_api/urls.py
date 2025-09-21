from django.urls import path
from .views import (
    RegisterView,
    LegacyBoxListCreateView,
    LegacyBoxDetailView,
    MemoryListCreateView,
    KeyholderCreateView,
    KeyholderTriggerView,
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='auth_register'),

    # Legacy Boxes
    path('boxes/', LegacyBoxListCreateView.as_view(), name='box-list-create'),
    path('boxes/<int:pk>/', LegacyBoxDetailView.as_view(), name='box-detail'),

    # Memories (nested under boxes)
    path('boxes/<int:box_id>/memories/', MemoryListCreateView.as_view(), name='memory-list-create'),

    # Keyholders
    path('boxes/<int:box_id>/keyholders/', KeyholderCreateView.as_view(), name='keyholder-create'),
    path('keyholder/trigger/', KeyholderTriggerView.as_view(), name='keyholder-trigger'),
]
