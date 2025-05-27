from rest_framework import serializers
from .models import Ad
from accounts.serializers import UserSerializer
from django.utils import timezone
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class AdSerializer(serializers.ModelSerializer):
    advertiser = UserSerializer(read_only=True)
    is_active = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Ad
        fields = ['id', 'title', 'image', 'url', 'advertiser', 'start_date', 'end_date', 'created_at', 'is_active']
        read_only_fields = ['created_at', 'is_active']

    def get_is_active(self, obj):
        now = timezone.now()
        is_active = obj.start_date <= now <= obj.end_date
        logger.debug(
            f"Ad {obj.title} (ID: {obj.id}) is_active check: "
            f"start_date={obj.start_date}, end_date={obj.end_date}, now={now}, is_active={is_active}"
        )
        return is_active

    def get_image(self, obj):
        # Return absolute URL for image
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return f"{settings.MEDIA_URL}{obj.image}"
        logger.warning(f"Ad {obj.title} (ID: {obj.id}) has no image")
        return None

    def validate(self, data):
        # Ensure required fields are present
        if not data.get('title'):
            raise serializers.ValidationError("Title is required.")
        if not data.get('url'):
            raise serializers.ValidationError("URL is required.")
        if not data.get('start_date') or not data.get('end_date'):
            raise serializers.ValidationError("Start and end dates are required.")
        if data.get('start_date') > data.get('end_date'):
            raise serializers.ValidationError("Start date must be before end date.")
        return data