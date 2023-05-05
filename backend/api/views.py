from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.utils import timezone
from django.http import HttpResponseRedirect, JsonResponse
from .models import SpotifyToken
from datetime import datetime, timedelta
import spotipy
import os
from dotenv import load_dotenv

load_dotenv(".env")

def spotify_login(request):
    user = request.user.id
    try:
        token = SpotifyToken.objects.get(user=user)
        if token.expires_in < timezone.now():
            scope = ['user-library-read', 'user-read-playback-state', 'user-modify-playback-state']
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
        scope = ['user-library-read', 'user-read-playback-state', 'user-modify-playback-state']

        sp_oauth = spotipy.SpotifyOAuth(client_id=os.getenv('CLIENT_ID'),
                                client_secret=os.getenv('CLIENT_SECRET'),
                                redirect_uri=os.getenv('REDIRECT_URI'),
                                scope=scope,
                                )
        auth_url = sp_oauth.get_authorize_url()
        return HttpResponseRedirect(auth_url)
    return HttpResponseRedirect("http://localhost:8000/api/get-tokens")

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
            username = request.user.username
        else:
            username = user_info['display_name']
            password = User.objects.make_random_password()
            user = User.objects.create_user(username=username, email=email, password=password)
    
    if request.user.is_authenticated:
        user = request.user

    token, created = SpotifyToken.objects.get_or_create(user=user)
    token.access_token = access_token
    token.refresh_token = refresh_token
    token.expires_in = expires_at
    token.save()
    
    if not request.user.is_authenticated:
        login(request, user)

    return redirect('http://localhost:3000')

def get_data(request):
    user = request.user.id
    token = SpotifyToken.objects.filter(user=user).first()
    sp = spotipy.Spotify(auth=token.access_token)
    data = sp.me()
    return JsonResponse(data)
