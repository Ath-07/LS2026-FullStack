from django.contrib.auth.models import User
from rest_framework import serializers

from bounties.models import Bounty


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "password")

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class BountySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.id")
    reward = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)

    class Meta:
        model = Bounty
        fields = ("id", "target_name", "reward", "status", "owner", "created_at")
        read_only_fields = ("created_at",)
