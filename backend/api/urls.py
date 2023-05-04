from django.urls import include, path
from django.contrib.auth.decorators import login_required
from .views import spotify_login, spotify_callback

urlpatterns = [
    # path('read-tokens', SpotifyTokenViewSet.as_view({'get':'list'})),
    path('spotify-login', spotify_login, name='spotify_login'),
    path('spotify-callback', spotify_callback, name='spotify_callback'),
    # path('get-tokens', GetTokens.as_view()),
]