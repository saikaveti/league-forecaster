from backend.client.api_client import ApiClient
from backend.client.database_client import DatabaseClient
from backend.model.platform import Platform

import pandas as pd

def get_leagues(account_id, retrieve_id, sport, platform):
    if not retrieve_id or not sport or not platform:
        return []

    # Create an instance of the API client
    api_client = ApiClient()
    # Create an instance of the Database client
    database_client = DatabaseClient('../../../../db/sqlite3/LeagueForecasterTest.db')

    # Get from the database client an existing secret for this account
    existing_secret = database_client.fetch_query("SELECT * FROM main.FantasyAccountIdentifiers WHERE AccountId = ? AND Platform = ? AND Sport ?", (account_id, platform, sport))

    # Initialize a list of existing leagues
    existing_leagues = pd.DataFrame()

    if not existing_secret.empty:
        existing_retrieve_id = existing_secret.iloc[0]["RetrieveId"]
        if existing_retrieve_id == retrieve_id:
            # If the retrieve ID matches, return the leagues from the database
            existing_leagues = database_client.fetch_query("SELECT * FROM main.FantasyLeague WHERE AccountId = ? AND Sport = ?", (account_id, sport))
        else:
            # If the retrieve ID does not match, update the existing secret
            database_client.execute_query("UPDATE main.FantasyAccountIdentifiers SET RetrieveId = ? WHERE AccountId = ? AND Platform = ? AND Sport = ?", (retrieve_id, account_id, platform, sport))
            # Delete the existing leagues from the database for the account
            database_client.execute_query("DELETE FROM main.FantasyLeague WHERE AccountId = ? AND Sport = ? AND Platform = ?", (account_id, sport))

    # Initalize an empty list of new_leagues
    new_leagues = []

    # Check if the platform is Fantrax and fetch leagues accordingly
    if platform == Platform.Fantrax:
        new_leagues = api_client.fantrax_get_leagues(retrieve_id)
        new_leagues = new_leagues["leagues"]
        new_leagues = [league for league in new_leagues if league["sport"] == sport]
        
    # If existing leagues is not empty, mark them as existing
        if not existing_leagues.empty:
            for league in leagues:
                league_id = league["leagueId"]
                if league_id in existing_leagues["LeagueId"].values:
                    league["existing"] = True
                else:
                    league["existing"] = False

    return new_leagues

def sync_leagues(league_ids, sport, platform, account_id):
    if not league_ids or not sport or not platform:
        return []

    # Create an instance of the API client
    api_client = ApiClient()
    # Create an instance of the Database client
    database_client = DatabaseClient('../../../../db/sqlite3/LeagueForecasterTest.db')

    # Get the existing leagues from the data for this sport, platform and account_id
    existing_leagues = database_client.fetch_query("SELECT * FROM main.FantasyLeague WHERE AccountId = ? AND Sport = ? AND Platform = ?", (account_id, sport, platform))
 
    if platform == Platform.Fantrax:
        synced_leagues = []
        for league_id in league_ids:
            league_data = api_client.fantrax_team_roster(league_id, sport)
            synced_leagues.append(league_data)
        return jsonify(synced_leagues), 200

    return []

