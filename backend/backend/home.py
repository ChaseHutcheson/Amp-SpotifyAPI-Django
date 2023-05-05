from django.http import HttpResponse
from django.template import Context, loader

def home_page(request):
    return HttpResponse("<h1>This Is The Backend Landing Page.<h1>")