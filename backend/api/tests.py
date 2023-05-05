from django.test import TestCase
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, JsonResponse
from .models import SpotifyToken
from datetime import datetime, timedelta
import spotipy
import os
from dotenv import load_dotenv

# Create your tests here.
def test(request):
    user = request.user.id
    print(SpotifyToken.objects.filter(user=user).values_list('access_token'))
