import sqlite3
import pandas as pd

class DatabaseClient:
    def __init__(self, db_path):
        self.db_path = db_path

    def _execute_query(self, query, params=None):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(query, params or ())
            conn.commit()
            
    def execute_query(self, query, params=None):
        self._execute_query(query, params)
            
    def _fetch_query(self, query, params=None):
        with sqlite3.connect(self.db_path) as conn:
            return pd.read_sql_query(query, conn, params or ())
        
    def fetch_query(self, query, params=None):
        return self._fetch_query(query, params)

    def _populate_table(self, table_name, dataframe, type):
        with sqlite3.connect(self.db_path) as conn:
            if type == "insert":
                conn.execute(f"DELETE FROM {table_name}")
            dataframe.to_sql(table_name, conn, if_exists="append", index=False)

    def populate_fantasy_league(self, dataframe, type):
        self._populate_table("main.FantasyLeague", dataframe, type)

    def populate_fantasy_players(self, dataframe, type):
        self._populate_table("main.FantasyPlayers", dataframe, type)

    def populate_fantasy_account_identifiers(self, dataframe, type)

    def populate_pitching_probables(self, dataframe, type):
        self._populate_table("main.PitchingProbables", dataframe, type)

    def populate_fangraphs_pitcher_season(self, dataframe, type):
        self._populate_table("main.FangraphsPitcherSeason", dataframe, type)

    def populate_fangraphs_hitter_range(self, dataframe, type):
        self._populate_table("main.FangraphsHitterRange", dataframe, type)

    def populate_fangraphs_hitter_splits(self, dataframe, type):
        self._populate_table("main.FangraphsHitterSplits", dataframe, type)
