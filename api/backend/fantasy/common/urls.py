from django.urls import path
from . import views
from .views import FantasyAccountIdentifierView

urlpatterns = [
    path('fantasy_players/', views.FantasyPlayersList.as_view(), name='fantasy_players_list'),
    path('account-identifier/', FantasyAccountIdentifierView.as_view(), name='account-identifier'),
]