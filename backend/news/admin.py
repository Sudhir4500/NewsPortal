from django.contrib import admin
from .models import News, Category, TrendingNews

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'id']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'published_at', 'id']
    list_filter = ['category', 'published_at']

# @admin.register(Tag)
# class TagAdmin(admin.ModelAdmin):
#     list_display = ['name', 'slug', 'id']
#     prepopulated_fields = {'slug': ('name',)}


@admin.register(TrendingNews)
class TrendingNewsAdmin(admin.ModelAdmin):
    list_display = ['news', 'added_at', 'is_active']
    list_filter = ['is_active', 'added_at']
    search_fields = ['news__title']
    raw_id_fields = ['news']
