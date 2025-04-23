from django.db import models

# Create your models here.
class FangraphsHitterRange(models.Model):
    player_id = models.IntegerField(primary_key=True)
    player_name = models.CharField(max_length=255)
    last_range = models.IntegerField()
    team = models.CharField(max_length=100, null=True, blank=True)
    range_wrcplus = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    date_updated = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'baseball.FangraphsHitterRange'

class FangraphsPitcherSeason(models.Model):
    player_id = models.IntegerField(primary_key=True)
    player_name = models.CharField(max_length=255)
    team = models.CharField(max_length=100, null=True, blank=True)
    season = models.IntegerField(null=True, blank=True)
    season_xfip = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    date_updated = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'baseball.FangraphsPitcherSeason'

class FangraphsHitterSplits(models.Model):
    player_id = models.IntegerField(primary_key=True)
    player_name = models.CharField(max_length=255)
    split = models.CharField(max_length=10)
    team = models.CharField(max_length=100, null=True, blank=True)
    wrcplus = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    date_updated = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'baseball.FangraphsHitterSplits'

class PitchingProbables(models.Model):
    home_team = models.CharField(max_length=100)
    away_team = models.CharField(max_length=100)
    pitcher = models.CharField(max_length=100)
    game_date = models.DateField()

    class Meta:
        db_table = 'baseball.PitchingProbables'
        unique_together = ('game_date', 'home_team', 'away_team')