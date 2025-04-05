from backend.etl.fantasy_etl import FantasyETL
from backend.model.platform import Platform
from backend.model.sport import Sport

fantasy_etl = FantasyETL()
print(str(Sport.MLB))
results = fantasy_etl.extract_players(Platform.Fantrax, Sport.MLB)
print(results)