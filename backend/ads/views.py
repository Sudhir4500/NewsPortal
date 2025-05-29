from rest_framework import generics
from accounts.permissions import IsStaffOrReadOnly
from .models import Ad
from .serializers import AdSerializer
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class AdListCreateView(generics.ListCreateAPIView):
    serializer_class = AdSerializer
    permission_classes = [IsStaffOrReadOnly]

    def get_queryset(self):
        queryset = Ad.objects.all()
        now = timezone.now()
        logger.info(f"Current time (UTC): {now}, Local time: {now.astimezone(timezone.get_default_timezone())}")

        # Check for ?all=true and authenticated user
        if self.request.query_params.get('all') == 'true' and self.request.user.is_authenticated:
            logger.debug(f"Returning all ads for authenticated user: {self.request.user.email}")
            logger.info(f"Total ads in database: {queryset.count()}")
            return queryset

        # Filter active ads
        active_queryset = queryset.filter(
            start_date__lte=now,
            end_date__gte=now
        )
        logger.info(f"Found {active_queryset.count()} active ads")
        if active_queryset.count() == 0:
            logger.warning(
                f"No active ads found. Current time: {now}. "
                f"Total ads in database: {queryset.count()}. "
                "Check start_date and end_date of ads."
            )
        return active_queryset

    def perform_create(self, serializer):
        serializer.save(advertiser=self.request.user)
        logger.info(f"Ad created by staff {self.request.user.email}: {serializer.data['title']}")