from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from accounts.permissions import IsStaffOrReadOnly
from .models import News, Category
from .serializers import NewsSerializer, CategorySerializer
import logging

logger = logging.getLogger(__name__)

class NewsListCreateView(generics.ListCreateAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsStaffOrReadOnly]  # Updated permission

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        logger.info(f"News created by staff {self.request.user.email}: {serializer.data['title']}")

class NewsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsStaffOrReadOnly]  # Updated permission
    lookup_field = 'id'

    def perform_update(self, serializer):
        serializer.save()
        logger.info(f"News updated by staff {self.request.user.email}: {serializer.data['title']}")

    def perform_destroy(self, instance):
        title = instance.title
        super().perform_destroy(instance)
        logger.info(f"News deleted by staff {self.request.user.email}: {title}")

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrReadOnly]  # Updated permission

    def perform_create(self, serializer):
        serializer.save()
        logger.info(f"Category created by staff {self.request.user.email}: {serializer.data['name']}")