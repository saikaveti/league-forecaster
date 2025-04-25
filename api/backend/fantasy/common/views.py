from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import FantasyPlayersSerializer, FantasyAccountIdentifiersSerializer
from .models import FantasyPlayers, FantasyAccountIdentifiers
from backend.client.api_client import ApiClient

# Create your views here.
class FantasyPlayersList(generics.ListCreateAPIView):
    queryset = FantasyPlayers.objects.all()
    serializer_class = FantasyPlayersSerializer

class FantasyAccountIdentifierView(APIView):
    """
    View to add a FantasyAccountIdentifiers object.
    """

    def post(self, request, *args, **kwargs):
        data = request.data
        platform = data.get("platform")
        retrieve_id = data.get("retrieve_id")

        # Validate the retrieve_id using fantrax_get_leagues
        if platform == "Fantrax":
            api_client = ApiClient()
            leagues = api_client.fantrax_get_leagues(retrieve_id)
            if not leagues:
                return Response({"error": "Invalid retrieve_id or unable to fetch leagues."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the FantasyAccountIdentifiers object
        serializer = FantasyAccountIdentifiersSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)