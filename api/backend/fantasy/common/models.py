from django.db import models

# Create your models here.
class FantasyLeague(models.Model):
    account_id = models.CharField(max_length=255)
    platform = models.CharField(max_length=50)
    sport = models.CharField(max_length=50)
    league_id = models.CharField(max_length=255)
    league_name = models.CharField(max_length=255)
    team_id = models.CharField(max_length=255)
    team_name = models.CharField(max_length=255)

    class Meta:
        db_table = 'main.FantasyLeague'
        unique_together = ('account_id', 'platform', 'sport', 'league_id')

class FantasyAccountIdentifiers(models.Model):
    platform = models.CharField(max_length=100)
    sport = models.CharField(max_length=100)
    account_id = models.CharField(max_length=100)
    retrieve_id = models.CharField(max_length=255)

    class Meta:
        db_table = 'main.FantasyAccountIdentifiers'
        unique_together = ('platform', 'sport', 'account_id')

class FantasyPlayers(models.Model):
    platform = models.CharField(max_length=50)
    sport = models.CharField(max_length=50)
    player_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    team = models.CharField(max_length=100)

    class Meta:
        db_table = 'main.FantasyPlayers'
        unique_together = ('platform', 'sport', 'player_id')