from django.urls import include, path
from django.contrib.auth.decorators import login_required
from .views import  spotifyCallback, logOut

urlpatterns = [
    # path('read-tokens', SpotifyTokenViewSet.as_view({'get':'list'})),
    path('spotify-callback', spotifyCallback, name='spotify_callback'),
    path('spotify-logout', logOut, name='spotify_logout'),
]