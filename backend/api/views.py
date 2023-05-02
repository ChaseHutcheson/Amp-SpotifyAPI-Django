from rest_framework import viewsets
from .models import SpotifyToken
from .serializers import SpotifyTokenSerializer

class SpotifyTokenViewSet(viewsets.ModelViewSet):
    queryset = SpotifyToken.objects.all()
    serializer_class = SpotifyTokenSerializer
