from django.contrib import admin
from .models import SpotifyToken

# Register your models here.
class SpotifyTokenAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'user_name')  # Fields to be displayed on the change list page

admin.site.register(SpotifyToken, SpotifyTokenAdmin)