from django.urls import path
from . import views

urlpatterns = [
    path('fantasy_players/', views.FantasyPlayersList.as_view(), name='fantasy_players_list')
]