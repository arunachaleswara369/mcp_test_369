from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from users.views import UserViewSet
from documents.views import (
    DocumentViewSet, 
    CommentViewSet, 
    SharedDocumentViewSet,
    DocumentVersionViewSet
)

# Create a router and register our viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'shares', SharedDocumentViewSet)
router.register(r'versions', DocumentVersionViewSet)

urlpatterns = [
    # JWT Authentication
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # API endpoints
    path('', include(router.urls)),
]