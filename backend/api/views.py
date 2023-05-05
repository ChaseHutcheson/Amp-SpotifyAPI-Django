from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.utils import timezone
from django.http import HttpResponseRedirect, JsonResponse
from .models import SpotifyToken
from datetime import datetime, timedelta
import spotipy
import os
from dotenv import load_dotenv

load_dotenv(".env")

def spotify_login(request):
    user = request.user
    try:
        SpotifyToken.objects.get(user=user)
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
    
    # Save the tokens to the database
    token, created = SpotifyToken.objects.get_or_create(user=request.user)
    token.access_token = access_token
    token.refresh_token = refresh_token
    token.expires_in = expires_at
    token.save()
    
    # Use the access token to authenticate the user and make requests to the Spotify Web API
    sp = spotipy.Spotify(auth=access_token)
    user_info = sp.current_user()
    return HttpResponseRedirect('http://localhost:3000')

def get_data(request):
    user = request.user
    token = SpotifyToken.objects.filter(user=user).first()
    sp = spotipy.Spotify(auth=token.access_token)
    data = sp.me()
    return JsonResponse(data)
