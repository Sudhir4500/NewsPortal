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
        if self.request.query_params.get('all') == 'true' and self.request.user.is_authenticated:
            logger.debug(f"Returning all ads for authenticated user: {self.request.user.email}")
            return queryset
        now = timezone.now()
        active_queryset = queryset.filter(
            start_date__lte=now,
            end_date__gte=now
        )
        logger.debug(
            f"Filtering active ads: now (UTC)={now}, "
            f"found {active_queryset.count()} active ads"
        )
        return active_queryset

    def perform_create(self, serializer):
        serializer.save(advertiser=self.request.user)
        logger.info(f"Ad created by staff {self.request.user.email}: {serializer.data['title']}")