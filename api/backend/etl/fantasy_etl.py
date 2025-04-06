from backend.client.api_client import ApiClient
from backend.client.database_client import DatabaseClient
import pandas as pd

from backend.model.platform import Platform

class FantasyETL:
    def extract_players(self, platform, sport):
        """
        Extract player data across a given platform + sport
        """
        # Initialize 
        api_client = ApiClient()
        
        # Call partner systems to retrieve fantasy data
        fantrax_mlb_players = api_client.get_players(platform, sport)

        # Grab the values and convert to a list
        fantrax_mlb_players = list(fantrax_mlb_players.values())

        # Return the players
        return pd.DataFrame(fantrax_mlb_players)

    def transform_players(self, dataframe, platform, sport):
        """
        Transform players data to a standard format.
        """

        # If the platform is Fantrax, transform the dataframe accordingly
        if platform == Platform.Fantrax:
            transformed_df = pd.DataFrame({
                "Platform": str(platform),
                "Sport": str(sport),
                "PlayerId": dataframe["fantraxId"],
                "Name": dataframe["name"].apply(lambda x: " ".join(reversed(x.split(", "))) if ", " in x else x),
                "Team": dataframe["team"]
            })
            return transformed_df
        else:
            return None
        
    def load_players(self, dataframe, db_path):
        """
        Load the transformed players data into the database.
        """
        # Load the dataframe into the database (this is a placeholder, implement your database loading logic here)
        database_client = DatabaseClient(db_path)
        database_client.populate_fantasy_players(dataframe, "insert")

    def run_players_etl(self, platform, sport, db_path, db_mode):
        """
        Run the ETL process for players.
        """
        # Extract
        extracted_data = self.extract_players(platform, sport)

        # Transform
        transformed_data = self.transform_players(extracted_data, platform, sport)

        print(transformed_data)

        # Load
        self.load_players(transformed_data, db_path, db_mode) if transformed_data is not None else None

        return transformed_data




