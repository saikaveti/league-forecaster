from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.urls import path

from backend.helper.token_helper import decode_token
from .serializers import FantasyPlayersSerializer, FantasyAccountIdentifiersSerializer
from .models import FantasyPlayers, FantasyAccountIdentifiers, FantasyLeague, FantasyTeamRoster, FantasyRosteredData
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

class FantasyAccountLeagueView(APIView):
    """
    View to retrieve leagues for a specific account, sport, and platform.
    """

    def get(self, request, sport, platform, *args, **kwargs):
        # Extract the bearer token
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization header missing or invalid."}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(" ")[1]
        # Decode the token to extract account_id
        try:
            decoded_token = decode_token(token)
            account_id = decoded_token.get("account_id")
        except Exception as e:
            return Response({"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)

        # Validate sport and platform
        if not sport or not platform:
            return Response({"error": "Sport and platform are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Query the database for the retrieve_id using Django ORM
        try:
            identifier = FantasyAccountIdentifiers.objects.get(account_id=account_id, sport=sport, platform=platform)
            retrieve_id = identifier.retrieve_id
        except FantasyAccountIdentifiers.DoesNotExist:
            return Response({"error": "No retrieve_id exists for this account, sport, and platform combination"}, status=status.HTTP_404_NOT_FOUND)

        # Call the Fantrax API to get leagues
        if platform == "Fantrax":
            api_client = ApiClient()
            leagues = api_client.fantrax_get_leagues(retrieve_id)
            if not leagues:
                return Response({"error": "Unable to fetch leagues from Fantrax."}, status=status.HTTP_400_BAD_REQUEST)

            return Response(leagues['leagues'], status=status.HTTP_200_OK)

        return Response({"error": "Unsupported platform."}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, sport, platform, *args, **kwargs):
        # Extract the bearer token
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization header missing or invalid."}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(" ")[1]
        # Decode the token to extract account_id
        try:
            decoded_token = decode_token(token)
            account_id = decoded_token.get("account_id")
        except Exception as e:
            return Response({"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)

        # Validate sport and platform
        if not sport or not platform:
            return Response({"error": "Sport and platform are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Extract league_ids from the request body
        league_ids = request.data.get("league_ids")
        if not league_ids or not isinstance(league_ids, list):
            return Response({"error": "A list of league_ids is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Process each league_id
        if platform == "Fantrax":
            api_client = ApiClient()
            for league_id in league_ids:
                # Fetch league data from Fantrax API
                league_data = api_client.fantrax_get_league_data(league_id)
                if not league_data:
                    continue  # Skip if unable to fetch data for this league_id

                # Extract team_id from league_data (assuming it exists in the response)
                team_id = league_data.get("team_id")
                if not team_id:
                    continue  # Skip if team_id is missing

                # Check if the league_id, team_id, and account_id already exist in FantasyLeague
                if not FantasyLeague.objects.filter(league_id=league_id, team_id=team_id, account_id=account_id).exists():
                    # Save the league data to FantasyLeague
                    FantasyLeague.objects.create(
                        league_id=league_id,
                        team_id=team_id,
                        account_id=account_id,
                        sport=sport,
                        platform=platform,
                        data=league_data  # Assuming a JSONField for storing league data
                    )

            # Invoke the sync method after leagues are added
            self.sync(request, sport)

            return Response({"message": "Leagues processed and synced successfully."}, status=status.HTTP_200_OK)

        return Response({"error": "Unsupported platform."}, status=status.HTTP_400_BAD_REQUEST)

    def sync(self, request, sport, *args, **kwargs):
        # Extract the bearer token
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization header missing or invalid."}, status=status.HTTP_401_UNAUTHORIZED)

        token = auth_header.split(" ")[1]
        # Decode the token to extract account_id
        try:
            decoded_token = decode_token(token)
            account_id = decoded_token.get("account_id")
        except Exception as e:
            return Response({"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)

        # Validate sport
        if not sport:
            return Response({"error": "Sport is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Query all teams for the account_id and sport
        teams = FantasyLeague.objects.filter(account_id=account_id, sport=sport)
        if not teams.exists():
            return Response({"error": "No teams found for the given account and sport."}, status=status.HTTP_404_NOT_FOUND)

        api_client = ApiClient()

        for team in teams:
            league_id = team.league_id
            team_id = team.team_id

            # Delete any existing FantasyTeamRoster data for the team_id
            FantasyTeamRoster.objects.filter(team_id=team_id).delete()

            # Fetch the team roster from the API
            team_roster = api_client.fantrax_team_roster(league_id, team_id)
            if not team_roster:
                continue  # Skip if unable to fetch roster data

            # Insert players into FantasyTeamRoster
            for player in team_roster.get("players", []):
                FantasyTeamRoster.objects.create(
                    team_id=team_id,
                    league_id=league_id,
                    player_id=player.get("player_id"),
                    data=player  # Assuming a JSONField for storing player data
                )

            # Delete all existing FantasyRosteredData for the team_id and league_id
            FantasyRosteredData.objects.filter(team_id=team_id, league_id=league_id).delete()

            # Add all rostered data for the league_id into FantasyRosteredData
            rostered_data = team_roster.get("rostered_data", [])
            for data in rostered_data:
                FantasyRosteredData.objects.create(
                    team_id=team_id,
                    league_id=league_id,
                    data=data  # Assuming a JSONField for storing rostered data
                )

        return Response({"message": "Sync completed successfully."}, status=status.HTTP_200_OK)

# URL patterns for the updated endpoints
urlpatterns = [
    path('sport/<str:sport>/platform/<str:platform>/', FantasyAccountLeagueView.as_view({'get': 'get', 'post': 'post'})),
    path('sport/<str:sport>/', FantasyAccountLeagueView.as_view({'post': 'sync'})),
]

