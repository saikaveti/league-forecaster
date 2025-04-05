import requests
import pandas as pd

class ApiClient:
    def __init__(self):
        """
        Initialize the API client with a base URL.
        
        :param base_url: The base URL for the API.
        """

    def get_players(self, platform, sport, params=None):
        """
        Fetch player IDs from the API and return as a DataFrame.

        :param sport: The sport to fetch player IDs for.
        :param platform: The platform (not used in this implementation).
        :param params: Additional query parameters for the request.
        :return: A pandas DataFrame containing player IDs.
        """
        url = f"https://www.fantrax.com/fxea/general/getPlayerIds?sport={str(sport)}"
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            return data
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None
        
    def fantrax_team_roster(self, league_id):
        """
        Fetch team rosters from the Fantrax API for a given league ID.

        :param league_id: The league ID to fetch team rosters for.
        :return: The data returned by the API.
        """
        url = f"https://www.fantrax.com/fxea/general/getTeamRosters?leagueId={league_id}"
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            return data
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None
    
    def fantrax_get_league_info(self, league_id):
        """
        Fetch league information from the Fantrax API for a given league ID.

        :param league_id: The league ID to fetch information for.
        :return: The data returned by the API.
        """
        url = f"https://www.fantrax.com/fxea/general/getLeagueInfo?leagueId={league_id}"
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            return data
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None

    def fangraphs_get_hitter_for_range(start_date, end_date):
        """
        Fetch hitter statistics from Fangraphs for a given date range.

        :param start_date: The start date for the statistics.
        :param end_date: The end date for the statistics.
        :return: The data returned by the API.
        """
        url = f"https://www.fangraphs.com/api/leaders/major-league/data?pos=all&stats=bat&lg=all&type=8&season=2025&month=1000&season1=2025&ind=0&qual=0&startdate={start_date}&enddate={end_date}&team=0&pageitems=2000000000"
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            return data
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None
        
    def fangraphs_get_splits_for_year(year, past_years, split):
        """
        Fetch splits data from Fangraphs for a given year.

        :param year: The year to fetch splits data for.
        :param past_years: The number of past years to include.
        :param split: The type of split to fetch.
        :return: The data returned by the API.
        """
        calc_split = 13 if split == "L" else 14
        url = f"https://www.fangraphs.com/api/leaders/major-league/data?pos=all&stats=bat&lg=all&ind=0&qual=0&type=8&month={calc_split}&startdate=&enddate=&season1={year-past_years}&season={year}&pageitems=2000000000"
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            return data
        except requests.RequestException as e:
            print(f"An error occurred: {e}")
            return None
        
    