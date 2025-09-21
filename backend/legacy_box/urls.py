"""
URL configuration for legacy_box project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from core_api.views import RecipientView # Import the new view

urlpatterns = [
    path("admin/", admin.site.urls),

    # Public-facing recipient view
    # In a real app, this would be a more secure, token-based URL
    path('claim/', RecipientView.as_view(), name='recipient-view'),

    # API endpoints
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('core_api.urls')),
]
