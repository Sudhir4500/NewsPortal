from rest_framework import serializers
from taggit.serializers import TagListSerializerField, TaggitSerializer

from .tagging import CustomTag
from .models import News, Category
from accounts.serializers import UserSerializer
from django.utils.text import slugify
import logging
from taggit.models import Tag

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

class NewsSerializer(TaggitSerializer, serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=True)
    slug = serializers.SlugField(read_only=True)
    tags = TagListSerializerField(required=False, allow_null=True, allow_empty=True)

    class Meta:
        model = News
        fields = ['id', 'title', 'slug', 'content', 'author', 'category', 'category_id', 'tags', 'image', 'published_at', 'updated_at']

    def to_representation(self, instance):
        """Override to show tags as objects (id, name, slug)"""
        representation = super().to_representation(instance)
        representation['tags'] = TagSerializer(instance.tags.all(), many=True).data
        return representation


    def validate_tags(self, value):
        logger.info(f"Validating tags: {value}")
        if value is None or value == []:
            return []
        # Normalize tags to lowercase to avoid duplicates
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
        logger.info(f"Tags extracted: {tags}")
        base_slug = slugify(validated_data['title'])
        slug = base_slug
        counter = 1
        while News.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        news = News.objects.create(category=category, slug=slug, **validated_data)
        if tags:
            for tag in tags:
                tag_obj, created = CustomTag.objects.get_or_create(  # Use CustomTag
                    name=tag,
                    defaults={'slug': slugify(tag.lower())}
                )
                news.tags.add(tag_obj)
        return news