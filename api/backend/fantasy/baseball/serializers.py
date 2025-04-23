from rest_framework import serializers
from .models import (
    FangraphsHitterRange,
    FangraphsPitcherSeason,
    FangraphsHitterSplits,
    PitchingProbables
)

class FangraphsHitterRangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FangraphsHitterRange
        fields = '__all__'

class FangraphsPitcherSeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = FangraphsPitcherSeason
        fields = '__all__'

class FangraphsHitterSplitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FangraphsHitterSplits
        fields = '__all__'

class PitchingProbablesSerializer(serializers.ModelSerializer):
    class Meta:
        model = PitchingProbables
        fields = '__all__'