from backend.etl.fantasy_etl import FantasyETL
from backend.model.platform import Platform
from backend.model.sport import Sport

fantasy_etl = FantasyETL()
results = fantasy_etl.run_players_etl(Platform.Fantrax, Sport.MLB, "../../db/sqlite3/LeagueForecasterTest.db", "insert")