# backend/news/serializers.py
from rest_framework import serializers
from taggit.serializers import TagListSerializerField, TaggitSerializer
from .tagging import CustomTag
from .models import News, Category, TrendingNews
from accounts.serializers import UserSerializer
from django.utils.text import slugify
import logging

logger = logging.getLogger(__name__)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomTag
        fields = ['id', 'name', 'slug']

class CategorySerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class TrendingNewsSerializer(serializers.ModelSerializer):
    news = serializers.PrimaryKeyRelatedField(queryset=News.objects.all())
    news_title = serializers.CharField(source='news.title', read_only=True)

    class Meta:
        model = TrendingNews
        fields = ['id', 'news', 'news_title', 'added_at', 'is_active']

class NewsSerializer(TaggitSerializer, serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=True)
    slug = serializers.SlugField(read_only=True)
    tags = TagListSerializerField(required=False, allow_null=True, allow_empty=True)
    is_trending = serializers.BooleanField(default=False)
    is_carousel = serializers.BooleanField(default=False)

    class Meta:
        model = News
        fields = ['id', 'title', 'slug', 'content', 'author', 'category', 'category_id', 'tags', 'image', 'published_at', 'updated_at', 'is_trending', 'is_carousel']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tags'] = TagSerializer(instance.tags.all(), many=True).data
        return representation

    def validate_tags(self, value):
        logger.info(f"Validating tags: {value}")
        if value is None or value == []:
            return []
        normalized_tags = [tag.strip().lower() for tag in value if isinstance(tag, str) and tag.strip()]
        if not normalized_tags:
            raise serializers.ValidationError("All tags must be non-empty strings.")
        return normalized_tags

    def validate_category_id(self, value):
        try:
            Category.objects.get(id=value)
        except (Category.DoesNotExist, ValueError):
            raise serializers.ValidationError("Invalid or missing category ID.")
        return value

    def create(self, validated_data):
        logger.info(f"Raw validated data: {validated_data}")
        category_id = validated_data.pop('category_id')
        category = Category.objects.get(id=category_id)
        tags = validated_data.pop('tags', [])
        is_trending = validated_data.pop('is_trending', False)
        is_carousel = validated_data.pop('is_carousel', False)  # Extract is_carousel
        logger.info(f"Tags extracted: {tags}")
        base_slug = slugify(validated_data['title'])
        slug = base_slug
        counter = 1
        while News.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        news = News.objects.create(category=category, slug=slug, is_trending=is_trending, is_carousel=is_carousel, **validated_data)
        if tags:
            for tag in tags:
                tag_obj, created = CustomTag.objects.get_or_create(
                    name=tag,
                    defaults={'slug': slugify(tag.lower())}
                )
                news.tags.add(tag_obj)
        return news

    def update(self, instance, validated_data):
        category_id = validated_data.pop('category_id', None)
        if category_id:
            instance.category = Category.objects.get(id=category_id)
        tags = validated_data.pop('tags', None)
        is_trending = validated_data.pop('is_trending', instance.is_trending)
        is_carousel = validated_data.pop('is_carousel', instance.is_carousel)  # Handle is_carousel update
        instance = super().update(instance, validated_data)
        instance.is_trending = is_trending
        instance.is_carousel = is_carousel
        if tags is not None:
            instance.tags.clear()
            for tag in tags:
                tag_obj, created = CustomTag.objects.get_or_create(
                    name=tag,
                    defaults={'slug': slugify(tag.lower())}
                )
                instance.tags.add(tag_obj)
        instance.save()  # Save to trigger TrendingNews logic in model
        return instance

    def validate(self, data):
        # Handle FormData tags (sent as multiple 'tags' keys)
        request = self.context.get('request')
        if request and request.parser_context['kwargs'].get('format') == 'multipart':
            tags = request.data.getlist('tags', [])  # Get list of tags from FormData
            data['tags'] = tags
        return super().validate(data)