from django.urls import path
from . import views

urlpatterns = [
    path('fangraphs_hitter_range/', views.FangraphsHitterRangeList.as_view(), name='fangraphs_hitter_range_list')
]