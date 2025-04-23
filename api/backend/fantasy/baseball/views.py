from django.shortcuts import render
from rest_framework import generics
from .serializers import FangraphsHitterRangeSerializer
from .models import FangraphsHitterRange

# Create your views here.
class FangraphsHitterRangeList(generics.ListCreateAPIView):
    queryset = FangraphsHitterRange.objects.all()
    serializer_class = FangraphsHitterRangeSerializer