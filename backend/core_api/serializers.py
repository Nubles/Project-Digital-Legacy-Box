from django.contrib.auth.models import User
from rest_framework import serializers
from .models import LegacyBox, Memory


class MemorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Memory
        fields = ('id', 'box', 'content', 'created_at')
        read_only_fields = ('box',)


class LegacyBoxSerializer(serializers.ModelSerializer):
    memories = MemorySerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = LegacyBox
        fields = ('id', 'user', 'name', 'recipient_email', 'release_date', 'created_at', 'updated_at', 'memories')


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    legacy_boxes = LegacyBoxSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'first_name', 'last_name', 'legacy_boxes')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user
