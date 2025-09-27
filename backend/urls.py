from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('useraccounts.urls')),
    path('api/', include('core.urls')),
    
]
