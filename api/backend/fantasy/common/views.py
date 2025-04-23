from django.shortcuts import render
from rest_framework import generics
from .serializers import FantasyPlayersSerializer
from .models import FantasyPlayers

# Create your views here.
class FantasyPlayersList(generics.ListCreateAPIView):
    queryset = FantasyPlayers.objects.all()
    serializer_class = FantasyPlayersSerializer