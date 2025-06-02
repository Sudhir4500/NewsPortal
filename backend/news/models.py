# backend/news/models.py
import uuid
from django.db import models
from accounts.models import User
from django.utils.text import slugify
from taggit.managers import TaggableManager
from .tagging import CustomUUIDTaggedItem

from cloudinary.models import CloudinaryField

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        base_slug = slugify(self.name)
        slug = base_slug
        counter = 1
        while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        self.slug = slug
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Categories"

class News(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    tags = TaggableManager(through=CustomUUIDTaggedItem, blank=True)
    # image = models.ImageField(upload_to='news/', blank=True, null=True)
    image=CloudinaryField('image', blank=True, null=True, help_text="Upload an image for the news article. Supported formats: jpg, png, webp.")
    published_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_trending = models.BooleanField(default=False, help_text="Check to mark this news as trending.")
    is_carousel = models.BooleanField(default=False, help_text="Check to include this news in the carousel.")

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Auto-generate slug from title
        base_slug = slugify(self.title)
        slug = base_slug
        counter = 1
        while News.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        self.slug = slug

        # Save the instance first to ensure it has a pk
        super().save(*args, **kwargs)

        # Handle trending status changes
        if self.is_trending:
            # Ensure a TrendingNews entry exists and is active
            trending_entry, created = TrendingNews.objects.get_or_create(
                news=self,
                defaults={'is_active': True}
            )
            if not created and not trending_entry.is_active:
                trending_entry.is_active = True
                trending_entry.save()
        else:
            # Deactivate any existing TrendingNews entry
            TrendingNews.objects.filter(news=self, is_active=True).update(is_active=False)

    @classmethod
    def get_trending_news(cls, limit=5):
        return cls.objects.filter(is_trending=True).order_by('-published_at')[:limit]

    class Meta:
        ordering = ['-published_at']

class TrendingNews(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    news = models.ForeignKey(News, on_delete=models.CASCADE, related_name='trending_entries')
    added_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True, help_text="Indicates if the news is currently trending.")

    def __str__(self):
        return f"{self.news.title} (Trending since {self.added_at})"

    class Meta:
        verbose_name_plural = "Trending News"
        ordering = ['-added_at']

    @classmethod
    def get_active_trending(cls, limit=5):
        return cls.objects.filter(is_active=True).select_related('news').order_by('-added_at')[:limit]

    @classmethod
    def get_carousel_news(cls, limit=5):
        return cls.objects.filter(is_carousel=True).order_by('-published_at')[:limit]