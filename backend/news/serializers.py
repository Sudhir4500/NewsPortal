from rest_framework import serializers
from .models import News, Category
from accounts.serializers import UserSerializer
from django.utils.text import slugify
import uuid

class CategorySerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

    def create(self, validated_data):
        base_slug = slugify(validated_data['name'])
        slug = base_slug
        counter = 1
        while Category.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        category = Category.objects.create(slug=slug, **validated_data)
        return category

class NewsSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True)
    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = News
        fields = ['id', 'title', 'slug', 'content', 'author', 'category', 'category_id', 'image', 'published_at', 'updated_at']

    def validate_category_id(self, value):
        if not Category.objects.filter(id=value).exists():
            raise serializers.ValidationError("Category does not exist.")
        return value
    
    def create(self, validated_data):
        category_id = validated_data.pop('category_id')
        category = Category.objects.get(id=category_id)
        image = validated_data.pop('image', None)
        base_slug = slugify(validated_data['title'])
        slug = base_slug
        counter = 1
        while News.objects.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        news = News.objects.create(category=category, image=image, slug=slug, **validated_data)
        return news