import logging
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser
from accounts.permissions import IsStaffOrReadOnly
from .models import News, Category
from .serializers import NewsSerializer, CategorySerializer

logger = logging.getLogger(__name__)


class NewsListCreateView(generics.ListCreateAPIView):
    """
    GET: List all news (optionally filtered by category slug)
    POST: Create a news item (staff only)
    """
    serializer_class = NewsSerializer
    permission_classes = [IsStaffOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)  # Add parsers for FormData

    def get_queryset(self):
        queryset = News.objects.all().order_by('-published_at')
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset

    def perform_create(self, serializer):
        news = serializer.save(author=self.request.user)
        logger.info(f"News created by staff {self.request.user.email}: {news.title}")


class NewsDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve a single news item by ID
    PUT/PATCH: Update news (staff only)
    DELETE: Delete news (staff only)
    """
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsStaffOrReadOnly]
    lookup_field = 'id'

    def perform_update(self, serializer):
        news = serializer.save()
        logger.info(f"News updated by staff {self.request.user.email}: {news.title}")

    def perform_destroy(self, instance):
        title = instance.title
        super().perform_destroy(instance)
        logger.info(f"News deleted by staff {self.request.user.email}: {title}")


class CategoryListCreateView(generics.ListCreateAPIView):
    """
    GET: List all categories
    POST: Create a category (staff only)
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrReadOnly]

    def perform_create(self, serializer):
        category = serializer.save()
        logger.info(f"Category created by staff {self.request.user.email}: {category.name}")
