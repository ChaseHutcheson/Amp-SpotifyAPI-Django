from django.urls import include, path
from .views import SpotifyTokenViewSet, AuthorizationUrl, spotify_callback, GetTokens


urlpatterns = [
    path('read-tokens', SpotifyTokenViewSet.as_view({'get':'list'})),
    path('authenticate', AuthorizationUrl.as_view()),
    path("redirect", spotify_callback),
    path('get-tokens', GetTokens.as_view()),
]