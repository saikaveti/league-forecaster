from rest_framework import serializers
from .models import (
    FantasyAccountIdentifiers,
    FantasyPlayers,
    FantasyLeague
)

class FantasyAccountIdentifiersSerializer(serializers.ModelSerializer):
    class Meta:
        model = FantasyAccountIdentifiers
        fields = '__all__'

class FantasyPlayersSerializer(serializers.ModelSerializer):
    class Meta:
        model = FantasyPlayers
        fields = '__all__'

class FantasyLeagueSerializer(serializers.ModelSerializer):
    class Meta:
        model = FantasyLeague
        fields = '__all__'
