from rest_framework import serializers
from .models import Ad
from accounts.serializers import UserSerializer
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class AdSerializer(serializers.ModelSerializer):
    advertiser = UserSerializer(read_only=True)
    is_active = serializers.SerializerMethodField()

    class Meta:
        model = Ad
        fields = ['id', 'title', 'image', 'url', 'advertiser', 'start_date', 'end_date', 'created_at', 'is_active']

    def get_is_active(self, obj):
        now = timezone.now()
        local_tz = timezone.get_default_timezone()
        now_local = now.astimezone(local_tz)
        start_local = obj.start_date.astimezone(local_tz)
        end_local = obj.end_date.astimezone(local_tz)
        is_active = start_local <= now_local <= end_local
        logger.debug(
            f"Ad {obj.title} (ID: {obj.id}) is_active check: "
            f"start_date={start_local}, end_date={end_local}, now={now_local}, is_active={is_active}"
        )
        return is_active