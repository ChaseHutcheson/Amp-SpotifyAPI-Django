from django.urls import include, path
from rest_framework import routers
from .views import SpotifyTokenViewSet

router = routers.DefaultRouter()
router.register(r'tokens', SpotifyTokenViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]