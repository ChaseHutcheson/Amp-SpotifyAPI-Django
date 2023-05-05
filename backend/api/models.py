from django.contrib.auth.models import User
from django.db import models
import string
import random

# def generateCode():
#     length = 6
#     #allChars = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9']
#     while True:
#         code = ''.join(random.choices(string.ascii_uppercase, k=length))
#         # if SpotifyToken.objects.filter(code = code).count() == 0:
#         #     break
#     return code


# # Create your models here.
# class SpotifyToken(models.Model):
#     session_id = models.CharField(max_length=100)
#     access_token = models.CharField(max_length=200)
#     token_type = models.CharField(max_length=20)
#     expires_in = models.DateTimeField()
#     refresh_token = models.CharField(max_length=200)
#     user_name = models.CharField(max_length=30, default="Null")
#     user_pfp_url = models.URLField(default="Null")
#     user_name_id = models.CharField(max_length=40, default="Null")

class SpotifyToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='spotify_token')
    access_token = models.CharField(max_length=255)
    refresh_token = models.CharField(max_length=255)
    expires_in = models.DateTimeField(null=True)