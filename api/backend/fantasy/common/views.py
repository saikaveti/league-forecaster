from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from backend.helper.token_helper import decode_token
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
        # Extract the bearer token
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization header missing or invalid."}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(" ")[1]
        # Decode the token to extract account_id and retrieve_id (assuming a decode_token function exists)
        try:
            decoded_token = decode_token(token)  # Replace with your token decoding logic
            
        except Exception as e:
            return Response({"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)

        # Extract account_id and retrieve_id from the decoded token
        account_id = decoded_token.get("account_id")
        retrieve_id = decoded_token.get("retrieve_id")

        # Extract platform and sport from the payload
        platform = request.data.get("platform")
        sport = request.data.get("sport")

        if not platform or not sport:
            return Response({"error": "Platform and sport are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate the retrieve_id using fantrax_get_leagues
        if platform == "Fantrax":
            api_client = ApiClient()
            leagues = api_client.fantrax_get_leagues(retrieve_id)
            if not leagues:
                return Response({"error": "Invalid retrieve_id or unable to fetch leagues."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the FantasyAccountIdentifiers object
        data = {
            "platform": platform,
            "sport": sport,
            "account_id": account_id,
            "retrieve_id": retrieve_id,
        }
        serializer = FantasyAccountIdentifiersSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)