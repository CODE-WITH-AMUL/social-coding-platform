from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework_simplejwt.views import TokenObtainPairView

from .views import RegisterSerializer
from .views import LoginSerializer

from django.urls import path

urlpatterns = [
    
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterSerializer, name='register'),
    path('login/', LoginSerializer, name='login'),
]
