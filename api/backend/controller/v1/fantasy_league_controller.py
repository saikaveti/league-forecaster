from backend.client.api_client import ApiClient
from backend.model.platform import Platform
from flask import Blueprint, request, jsonify

profile_controller = Blueprint('profile_controller', __name__)

@profile_controller.route('/fantasy/leagues', methods=['POST'])
def get_leagues():
    data = request.get_json()
    secret_id = data.get('secret_id')
    sport = data.get('sport')
    platform = data.get('platform')

    if not secret_id or not sport or not platform:
        return jsonify({"error": "Missing required fields"}), 400

    # Create an instance of the API client
    api_client = ApiClient()
    if platform == Platform.Fantrax:
        leagues = api_client.fantrax_get_leagues(secret_id)
        leagues = leagues["leagues"]
        return [league for league in leagues if league["sport"] == sport], 200

    return jsonify([]), 200

@profile_controller.route('/fantasy/sync', methods=['POST'])
def sync_leagues():
    data = request.get_json()
    league_ids = data.get('league_ids')
    sport = data.get('sport')
    platform = data.get('platform')
    account_id = data.get('account_id')

    if not league_ids or not sport or not platform:
        return jsonify({"error": "Missing required fields"}), 400

    # Create an instance of the API client
    api_client = ApiClient()
    if platform == Platform.Fantrax:
        synced_leagues = []
        for league_id in league_ids:
            league_data = api_client.fantrax_team_roster(league_id, sport)
            synced_leagues.append(league_data)
        return jsonify(synced_leagues), 200

    return jsonify({"error": "Unsupported platform"}), 400

