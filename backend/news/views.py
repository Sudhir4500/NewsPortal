from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.exceptions import NotFound
from accounts.permissions import IsStaffOrReadOnly
from .models import News, Category
from .serializers import NewsSerializer, CategorySerializer, TagSerializer
from news.tagging import CustomTag  # Add this import
import logging

logger = logging.getLogger(__name__)

class NewsListCreateView(generics.ListCreateAPIView):
    serializer_class = NewsSerializer
    permission_classes = [IsStaffOrReadOnly]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = News.objects.all().order_by('-published_at')
        category_slug = self.request.query_params.get('category')
        tag_slug = self.request.query_params.get('tag')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
            logger.info(f"Filtering by category: {category_slug}")
        if tag_slug:
            try:
                tag = CustomTag.objects.get(slug__iexact=tag_slug)  # Use CustomTag
                queryset = queryset.filter(tags=tag)
                logger.info(f"Filtering by tag: {tag.name} (found {queryset.count()} items)")
            except CustomTag.DoesNotExist:
                logger.warning(f"No tag found for slug: {tag_slug}")
                queryset = News.objects.none()
        return queryset

    def perform_create(self, serializer):
        news = serializer.save(author=self.request.user)
        logger.info(f"News created by staff {self.request.user.email}: {news.title}")

class NewsDetailView(generics.RetrieveUpdateDestroyAPIView):
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
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [IsStaffOrReadOnly]

    def perform_create(self, serializer):
        category = serializer.save()
        logger.info(f"Category created by staff {self.request.user.email}: {category.name}")

class TagNewsListView(generics.ListAPIView):
    serializer_class = NewsSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        tag_slug = self.kwargs.get('slug')
        if not tag_slug:
            logger.error("No tag slug provided")
            raise NotFound("Tag slug not provided.")
        try:
            tag = CustomTag.objects.get(slug__iexact=tag_slug)  # Use CustomTag
            logger.info(f"Found tag: {tag.name} (slug: {tag.slug})")
            queryset = News.objects.filter(tags=tag).order_by('-published_at')
            logger.info(f"Found {queryset.count()} news items for tag: {tag.name}")
            return queryset
        except CustomTag.DoesNotExist:
            logger.error(f"No tag found with slug: {tag_slug}")
            raise NotFound(f"No tag found with slug: {tag_slug}")

class TagListView(generics.ListAPIView):
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = TagSerializer

    def get_queryset(self):
        queryset = CustomTag.objects.all().order_by('name')  # Use CustomTag
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        logger.info(f"Returning {queryset.count()} tags: {[tag.slug for tag in queryset]}")
        return queryset