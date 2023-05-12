from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.utils import timezone
from django.http import HttpResponseRedirect, JsonResponse
from .models import SpotifyToken
from datetime import datetime, timedelta
import spotipy
import json
import os
from dotenv import load_dotenv

load_dotenv(".env")

def spotify_login(request):
    user = request.user.id
    try:
        token = SpotifyToken.objects.get(user=user)
        if token.expires_in < timezone.now():
            scope = ['ugc-image-upload', 'user-follow-modify', 'playlist-modify-private', 'playlist-modify-public', 'user-library-modify', 'playlist-read-collaborative', 'user-read-currently-playing', 'user-follow-read', 'user-read-playback-position', 'user-read-playback-state', 'playlist-read-private', 'user-read-recently-played', 'user-top-read', 'user-read-email', 'user-library-read user-read-private', 'app-remote-control', 'streaming', 'user-modify-playback-state']
            sp_oauth = spotipy.SpotifyOAuth(client_id=os.getenv('CLIENT_ID'),
                                    client_secret=os.getenv('CLIENT_SECRET'),
                                    redirect_uri=os.getenv('REDIRECT_URI'),
                                    scope=scope,
                                    )
            auth_url = sp_oauth.get_authorize_url()
            return HttpResponseRedirect(auth_url)
        else:
            pass
    except SpotifyToken.DoesNotExist:
        scope = scope = ['ugc-image-upload', 'user-follow-modify', 'playlist-modify-private', 'playlist-modify-public', 'user-library-modify', 'playlist-read-collaborative', 'user-read-currently-playing', 'user-follow-read', 'user-read-playback-position', 'user-read-playback-state', 'playlist-read-private', 'user-read-recently-played', 'user-top-read', 'user-read-email', 'user-library-read user-read-private', 'app-remote-control streaming', 'user-modify-playback-state']

        sp_oauth = spotipy.SpotifyOAuth(client_id=os.getenv('CLIENT_ID'),
                                client_secret=os.getenv('CLIENT_SECRET'),
                                redirect_uri=os.getenv('REDIRECT_URI'),
                                scope=scope,
                                )
        auth_url = sp_oauth.get_authorize_url()
        return HttpResponseRedirect(auth_url)
    return HttpResponseRedirect("http://localhost:8000/api/spotify-callback")

def spotify_callback(request):
    code = request.GET.get('code')
    sp_oauth = spotipy.SpotifyOAuth(client_id=os.getenv('CLIENT_ID'),
                            client_secret=os.getenv('CLIENT_SECRET'),
                            redirect_uri=os.getenv('REDIRECT_URI'),
                            )
    token_info = sp_oauth.get_access_token(code)
    access_token = token_info['access_token']
    refresh_token = token_info['refresh_token']
    expires_in = token_info['expires_in']
    expires_at = timezone.now() + timedelta(seconds=expires_in)

    sp = spotipy.Spotify(auth=access_token)
    user_info = sp.current_user()

    email = user_info['email']
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        if request.user.is_authenticated:
            user_name = request.user.username
        else:
            user_name = user_info['display_name']
            password = User.objects.make_random_password()
            user = User.objects.create_user(username=user_name, email=email, password=password)
    
    if request.user.is_authenticated:
        user = request.user

    token, created = SpotifyToken.objects.get_or_create(user=user)
    token.access_token = access_token
    token.refresh_token = refresh_token
    token.expires_in = expires_at
    token.save()
    
    if not request.user.is_authenticated:
        login(request, user)

    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        
    data = {
        "PROFILE_DATA": sp.me(),
        "SENSETIVE": {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_in": expires_in,
            "device_id": sp.devices()
        },
        "PLAYLIST_SONGS":  sp.current_user_playlists()
    }
    return JsonResponse(data)

def get_data(request):
    permission_classes = [SpotifyToken.Is]
    user = request.user.id
    access_token = SpotifyToken.objects.filter(user=user).values_list('access_token', flat=True).first()
    sp = spotipy.Spotify(auth=str(access_token))
    data = sp.current_user() 
    return JsonResponse(data)
