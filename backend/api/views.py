from rest_framework import viewsets
from .models import SpotifyToken
from .serializers import SpotifyTokenSerializer
from django.shortcuts import render, redirect
from django.urls import reverse
from django.core.serializers import serialize
from django.http import HttpResponseRedirect, JsonResponse
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from requests import Request, get, post
from dotenv import load_dotenv
from .models import SpotifyToken
from datetime import timedelta
import datetime
import json
import os

class SpotifyTokenViewSet(viewsets.ModelViewSet):
    queryset = SpotifyToken.objects.all()
    serializer_class = SpotifyTokenSerializer

class AuthorizationUrl(APIView):
    db = SpotifyToken
    load_dotenv()
    def get(self, request, format=None):
        session_id = request.session.session_key
        try:
            user_object = self.db.objects.get(session_id = session_id)
        except SpotifyToken.DoesNotExist:
            user_object = None

        if user_object:
            pass
        else:
            redirect_uri = os.getenv('REDIRECT_URI')
            client_id = os.getenv('CLIENT_ID') 
            request.session['logged_in'] = False
            scopes = 'ugc-image-upload user-follow-modify playlist-modify-private playlist-modify-public user-library-modify playlist-read-collaborative user-read-currently-playing user-follow-read user-read-playback-position user-read-playback-state playlist-read-private user-read-recently-played user-top-read user-read-email user-library-read user-read-private app-remote-control streaming user-modify-playback-state'
            url = Request('GET', 'https://accounts.spotify.com/authorize', params={
                'scope': scopes,
                'response_type': 'code',
                'redirect_uri': redirect_uri,
                'client_id': client_id
            }).prepare().url

            print(request.session.items())
            return redirect(url)
        
        return HttpResponseRedirect("http://localhost:3000")
    
def spotify_callback(request, format=None):
    load_dotenv()
    redirect_uri = os.getenv('REDIRECT_URI')
    client_id = os.getenv('CLIENT_ID') 
    client_secret = os.getenv('CLIENT_SECRET')

    code = request.GET.get('code')
    error = request.GET.get('error')

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri,
        'client_id': client_id,
        'client_secret': client_secret
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    get_user_data = get('https://api.spotify.com/v1/me', headers={
        'Authorization': f'Bearer {access_token}'
    }).json()

    user_name = get_user_data.get('display_name')
    user_pfp_url = get_user_data.get('images')
    user_name_id = get_user_data.get('id')

    timeNow = datetime.datetime.now()
    expires_in = timeNow + timedelta(seconds=expires_in)

    SpotifyToken.objects.create(
        session_id = request.session.session_key,
        access_token = access_token,
        token_type = token_type,
        refresh_token = refresh_token,
        expires_in = expires_in,
        user_name = user_name,
        user_pfp_url = user_pfp_url,
        user_name_id = user_name_id,
    )
    
    return HttpResponseRedirect("http://localhost:3000")

class GetTokens(APIView):
    def get(self, request, format=None):
        id = request.session.session_key
        value = SpotifyToken.objects.get(session_id = id)
        data = serialize('json', [value,])
        data = json.loads(data)
        return JsonResponse(data, status=status.HTTP_200_OK, safe=False)
