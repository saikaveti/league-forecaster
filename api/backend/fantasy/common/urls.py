from django.urls import path
from . import views

urlpatterns = [
    path('fantasy_players/', views.FantasyPlayersList.as_view(), name='fantasy_players_list'),
    path('account-identifier/', views.FantasyAccountIdentifierView.as_view(), name='account-identifier'),
    path('account-leagues/', views.FantasyAccountLeagueView.as_view(), name='account-leagues')
]